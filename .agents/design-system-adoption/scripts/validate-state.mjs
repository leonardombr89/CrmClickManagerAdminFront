import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const controlRoot = process.env.DESIGN_SYSTEM_CONTROL_ROOT
  ? process.env.DESIGN_SYSTEM_CONTROL_ROOT
  : join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const readJson = (file) => JSON.parse(readFileSync(join(controlRoot, file), 'utf8'));
const schema = readJson('schema.json');
const program = readJson('program.json');
const requiredRoles = {
  planning: ['planner'], ready: ['planner'], implementing: ['planner', 'implementer'],
  reviewing: ['planner', 'implementer', 'reviewer'], correcting: ['planner', 'implementer', 'reviewer'],
  approved: ['planner', 'implementer', 'reviewer'], complete: ['planner', 'implementer', 'reviewer'],
  blocked: []
};
// Planning may overlap a dependency's review; only execution and terminal
// states require dependencies to be complete.
const dependencyBoundStates = new Set(['ready', 'implementing', 'reviewing', 'correcting', 'approved', 'complete']);
const stageById = new Map();
const parseJson = (path, label) => {
  try { return JSON.parse(readFileSync(path, 'utf8')); }
  catch { errors.push(`${label}: invalid JSON`); return null; }
};
const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

for (const stage of program.stages) {
  if (!isNonEmptyString(stage.id) || stageById.has(stage.id)) { errors.push(`stage IDs must be unique: ${stage.id ?? '<missing>'}`); continue; }
  stageById.set(stage.id, stage);
  if (!schema.states.includes(stage.state)) errors.push(`${stage.id}: unknown state ${stage.state}`);
}
for (const stage of program.stages) for (const dependency of stage.dependencies ?? []) {
  if (!stageById.has(dependency)) errors.push(`${stage.id}: missing dependency ${dependency}`);
}

const visiting = new Set();
const visited = new Set();
const visit = (id, ancestry = []) => {
  if (visiting.has(id)) { errors.push(`dependency cycle: ${[...ancestry, id].join(' -> ')}`); return; }
  if (visited.has(id) || !stageById.has(id)) return;
  visiting.add(id);
  for (const dependency of stageById.get(id).dependencies ?? []) visit(dependency, [...ancestry, id]);
  visiting.delete(id); visited.add(id);
};
for (const id of stageById.keys()) visit(id);

const events = readFileSync(join(controlRoot, 'events.jsonl'), 'utf8').trim().split('\n').filter(Boolean)
  .map((line, index) => {
    try { return JSON.parse(line); } catch { errors.push(`events.jsonl:${index + 1}: invalid JSON`); return null; }
  }).filter(Boolean);
const eventState = new Map([...stageById.keys()].map((id) => [id, 'pending']));
const stageEvents = new Map([...stageById.keys()].map((id) => [id, []]));
for (const [index, event] of events.entries()) {
  const prefix = `events.jsonl:${index + 1}`;
  if (!stageById.has(event.stageId)) { errors.push(`${prefix}: unknown stage ${event.stageId}`); continue; }
  stageEvents.get(event.stageId).push(event);
  if (!schema.states.includes(event.from) || !schema.states.includes(event.to)) { errors.push(`${prefix}: unknown transition state`); continue; }
  if (eventState.get(event.stageId) !== event.from) errors.push(`${prefix}: expected from ${eventState.get(event.stageId)}, got ${event.from}`);
  if (!(schema.transitions[event.from] ?? []).includes(event.to)) errors.push(`${prefix}: transition ${event.from} -> ${event.to} is not allowed`);
  if (event.to === 'blocked' && !isNonEmptyString(event.blockedReason)) errors.push(`${prefix}: blocked transition requires blockedReason`);
  eventState.set(event.stageId, event.to);
}

const readCycles = (stage) => {
  const cyclesPath = join(controlRoot, 'stages', stage.id, 'cycles');
  if (!existsSync(cyclesPath)) return new Map();
  const cycles = new Map();
  for (const name of readdirSync(cyclesPath)) {
    if (!/^\d{2}$/.test(name)) { errors.push(`${stage.id}: cycle directory must be two digits: ${name}`); continue; }
    const cycle = Number(name);
    const path = join(cyclesPath, name, 'review.json');
    if (!existsSync(path)) {
      if (existsSync(join(cyclesPath, name, 'plan.md'))) continue;
      errors.push(`${stage.id}: missing review for cycle ${name}`); continue;
    }
    const review = parseJson(path, `${stage.id}: cycle ${name} review`);
    if (review) cycles.set(cycle, { review, dir: name, correctionPath: join(cyclesPath, name, 'correction.json') });
  }
  return cycles;
};
const validEvidence = (evidence) => Array.isArray(evidence) && evidence.length > 0 && evidence.every((item) => item && isNonEmptyString(item.path) && isNonEmptyString(item.description));
const validReviewEvidence = (evidence) => Array.isArray(evidence) && evidence.length > 0 && evidence.every((item) => item && ((isNonEmptyString(item.path) && isNonEmptyString(item.description)) || (isNonEmptyString(item.command) && isNonEmptyString(item.result))));

for (const stage of program.stages) {
  if (dependencyBoundStates.has(stage.state)) for (const dependency of stage.dependencies ?? []) {
    if (stageById.get(dependency)?.state !== 'complete') errors.push(`${stage.id}: ${stage.state} requires complete dependency ${dependency}`);
  }
  for (const artifact of schema.requiredArtifacts[stage.state] ?? []) {
    if (!existsSync(join(controlRoot, 'stages', stage.id, artifact))) errors.push(`${stage.id}: missing required artifact stages/${stage.id}/${artifact}`);
  }
  const roles = requiredRoles[stage.state] ?? [];
  const values = roles.map((role) => stage.roles?.[role]);
  if (values.some((value) => !isNonEmptyString(value))) errors.push(`${stage.id}: missing required role for state ${stage.state}`);
  if (new Set(values).size !== values.length) errors.push(`${stage.id}: reached roles must be distinct`);

  const implementationPath = join(controlRoot, 'stages', stage.id, 'implementation.json');
  if (existsSync(implementationPath)) {
    const implementation = parseJson(implementationPath, `${stage.id}: implementation`);
    if (implementation && (implementation.stageId !== stage.id || implementation.status !== 'implemented' || !isNonEmptyString(implementation.actor) || !isNonEmptyString(implementation.summary) || !validEvidence(implementation.evidence) || !isNonEmptyString(implementation.validation?.command) || implementation.validation?.result !== 'passed')) errors.push(`${stage.id}: implementation evidence is incomplete`);
  }

  const cycles = readCycles(stage);
  const requested = [...cycles.values()].filter(({ review }) => review.outcome === 'changes_requested');
  for (const [cycle, record] of cycles) {
    const { review, correctionPath } = record;
    if (review.stageId !== stage.id || review.cycle !== cycle || !['pending', 'changes_requested', 'approved'].includes(review.outcome) || review.verdict !== review.outcome || !isNonEmptyString(review.reviewer) || !isNonEmptyString(review.summary) || !Array.isArray(review.findings) || !validReviewEvidence(review.evidence)) errors.push(`${stage.id}: review cycle ${cycle} is incomplete`);
    const correctionExists = existsSync(correctionPath);
    const pendingCorrection = review.outcome === 'pending' && stage.state === 'reviewing' && stage.reviewCycle === cycle;
    if (correctionExists && review.outcome !== 'changes_requested' && !pendingCorrection) errors.push(`${stage.id}: correction cycle ${cycle} requires changes_requested review`);
    const terminalBlock = stageEvents.get(stage.id).find((event) => event.from === 'correcting' && event.to === 'blocked' && event.cycle === cycle);
    // While an implementer is actively correcting a finding, its correction
    // evidence does not exist yet. Require it once the stage moves back to
    // review (or enters a terminal state), not at the reviewing -> correcting
    // handoff itself.
    const activeCorrection = review.outcome === 'changes_requested' && stage.state === 'correcting' && stage.reviewCycle === cycle;
    if (review.outcome === 'changes_requested' && !correctionExists && !terminalBlock && !activeCorrection) errors.push(`${stage.id}: changes requested in cycle ${cycle} lack correction.json`);
    if (correctionExists) {
      const correction = parseJson(correctionPath, `${stage.id}: correction cycle ${cycle}`);
      if (!correction || correction.stageId !== stage.id || correction.cycle !== cycle || correction.implementer !== stage.roles?.implementer || !isNonEmptyString(correction.summary) || !Array.isArray(correction.resolutions) || correction.resolutions.length === 0 || !isNonEmptyString(correction.validation?.command) || correction.validation?.result !== 'passed') errors.push(`${stage.id}: correction cycle ${cycle} is incomplete`);
    }
  }
  const reviewEvents = stageEvents.get(stage.id).filter((event) => event.to === 'reviewing' || event.from === 'reviewing' || event.from === 'correcting');
  let expectedCycle = 1;
  for (const event of reviewEvents) {
    if (!Number.isInteger(event.cycle) || event.cycle < 1) { errors.push(`${stage.id}: review transition requires positive integer cycle`); continue; }
    if (event.to === 'reviewing') {
      if (event.cycle !== expectedCycle) errors.push(`${stage.id}: expected review cycle ${expectedCycle}, got ${event.cycle}`);
      expectedCycle += 1;
    } else if (event.from === 'reviewing' && event.to === 'correcting') {
      const record = cycles.get(event.cycle);
      if (!record || record.review.outcome !== 'changes_requested') errors.push(`${stage.id}: correction transition cycle ${event.cycle} lacks changes_requested review`);
    } else if (event.from === 'correcting' && event.to === 'blocked') {
      const limit = event.reviewCycleLimit ?? 3;
      if (!Number.isInteger(limit) || limit < 1 || event.cycle !== limit || requested.filter(({ review }) => review.cycle <= limit).length < limit) errors.push(`${stage.id}: terminal block must occur at its recorded review-cycle limit after changes_requested reviews`);
    }
  }
  for (const [cycle, record] of cycles) {
    const correctionExists = existsSync(record.correctionPath);
    const correctionEvent = stageEvents.get(stage.id).find((event) => event.from === 'reviewing' && event.to === 'correcting' && event.cycle === cycle);
    const terminalBlock = stageEvents.get(stage.id).find((event) => event.from === 'correcting' && event.to === 'blocked' && event.cycle === cycle);
    if (record.review.outcome === 'changes_requested' && !correctionEvent) errors.push(`${stage.id}: changes_requested cycle ${cycle} lacks reviewing -> correcting event`);
    const pendingCorrection = record.review.outcome === 'pending' && stage.state === 'reviewing' && stage.reviewCycle === cycle;
    if (correctionExists && !correctionEvent && !pendingCorrection) errors.push(`${stage.id}: correction cycle ${cycle} lacks matching reviewing -> correcting event`);
  }
  if (stage.state === 'reviewing') {
    if (!Number.isInteger(stage.reviewCycle) || stage.reviewCycle < 1) errors.push(`${stage.id}: reviewing requires reviewCycle`);
    const record = cycles.get(stage.reviewCycle);
    if (!record || record.review.outcome !== 'pending' || record.review.reviewer !== stage.roles?.reviewer) errors.push(`${stage.id}: current review cycle must be pending and assigned to reviewer`);
  }
  if (stage.state === 'correcting' && (!Number.isInteger(stage.reviewCycle) || cycles.get(stage.reviewCycle)?.review.outcome !== 'changes_requested')) errors.push(`${stage.id}: correcting requires a changes_requested current cycle`);
  const approvalEvents = stageEvents.get(stage.id).filter((event) => event.from === 'reviewing' && event.to === 'approved');
  for (const event of approvalEvents) {
    const review = cycles.get(event.cycle)?.review;
    if (!Number.isInteger(event.cycle) || !review || review.outcome !== 'approved' || review.verdict !== 'approved' || review.reviewer !== stage.roles?.reviewer) errors.push(`${stage.id}: reviewing -> approved requires matching approved review by registered reviewer`);
  }
  if (stage.state === 'approved' || stage.state === 'complete') {
    const review = cycles.get(stage.reviewCycle)?.review;
    const approvalEvent = approvalEvents.find((event) => event.cycle === stage.reviewCycle);
    if (!Number.isInteger(stage.reviewCycle) || !review || review.outcome !== 'approved' || review.verdict !== 'approved' || review.reviewer !== stage.roles?.reviewer || !approvalEvent) errors.push(`${stage.id}: ${stage.state} requires a matching approved review cycle and reviewing -> approved event`);
  }
  if (eventState.get(stage.id) !== stage.state && (eventState.get(stage.id) !== 'pending' || stage.state !== 'pending')) errors.push(`${stage.id}: program state ${stage.state} does not match event state ${eventState.get(stage.id)}`);
}

if (errors.length) {
  console.error(`State validation failed (${errors.length} error${errors.length === 1 ? '' : 's'}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else console.log(`State validation passed for ${program.stages.length} stages.`);
