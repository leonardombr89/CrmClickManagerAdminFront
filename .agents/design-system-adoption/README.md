# Design System Adoption Control

This directory stores orchestration state for the Design System adoption program.
It deliberately contains no product implementation instructions: each stage links to
its issue and records only ownership, dependencies, state transitions, and evidence
paths.

## Files

- `program.json` is the current program state and stage dependency graph.
- `schema.json` documents the JSON shape and valid states.
- `events.jsonl` is the append-only transition log (one JSON object per line).
- `stages/<id>/` holds evidence produced by the planner, implementer, and reviewer.
- `scripts/validate-state.mjs` validates the graph, state, events, and required
  evidence without external dependencies.

## Operating contract

For every stage, use distinct planner, implementer, and reviewer agents. The planner
writes `brief.md` and `plan.md`; the implementer writes `implementation.json`; the
reviewer writes `cycles/<nn>/review.json`. A reviewer finding moves the stage to
`correcting`; the same implementer records its response in
`cycles/<nn>/correction.json`, then the reviewer evaluates the next cycle. Historical
cycles are never overwritten.

A stage can be blocked outside the normal flow only with a documented `blockedReason`
in its transition event. Review rejection may block only from `correcting`, after
three `changes_requested` review cycles; a direct `reviewing` to `blocked` transition
is invalid.

The orchestrator advances or completes a stage only when its dependencies are
`complete`; it does not make implementation decisions. After every state change,
append an event (including `cycle` for review transitions) and run:

```sh
node .agents/design-system-adoption/scripts/validate-state.mjs
```
