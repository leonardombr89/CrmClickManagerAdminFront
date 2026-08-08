# DS-2 plan — Compatibility preflight / doctor for Angular

## Contract and compatibility policy

1. Make `packages/angular/src/compatibility.json` the versioned, package-local
   source of truth for the supported consumer family. For this release it must
   declare: Angular framework and CLI/CDK `>=22.0.0 <23.0.0`; Node
   `^20.19.0 || ^22.12.0 || ^24.0.0`; Tailwind `>=4.0.0 <5.0.0`; and Spartan
   `@spartan-ng/brain >=1.3.0 <2.0.0`. TypeScript must be derived from the
   selected Angular compiler-cli version's declared peer range, with the
   expected range stored alongside the tested Angular 22 release in this file.
   The implementing PR must align the Angular package's own dev dependency and
   lockfile to that same supported TypeScript range if they currently disagree.
2. Use this JSON in both the CLI source and tests; do not duplicate version
   ranges in prose or code. The Angular major is intentionally fixed at 22 in
   this stage. Updating it later is an explicit compatibility-data change plus
   fixture coverage, not an implicit widening of ranges.
3. Extend the existing shared `preflight` interface with `framework: 'angular'`
   and `operation: 'doctor' | 'init' | 'add'`; React behavior and its existing
   result shape must remain backward compatible. Angular CLI passes the command
   as `operation` before its planner or mutator runs. The result remains
   `{ ok, checks }`; every compatibility check has `kind`, `status`, `found`,
   `source`, `expected`, and a Portuguese remediation message. `message` is a
   newline join of check messages and never includes raw environment values.

## Read-only discovery and blocking rules

1. Add a pure Angular compatibility inspector under `packages/angular/src/` and
   export it for unit tests. It reads only the consumer's `package.json`,
   installed `node_modules/<package>/package.json` when present, and at most one
   root lockfile. It does not invoke npm, Yarn, pnpm, Angular CLI or TypeScript,
   and it does not resolve modules through arbitrary consumer code.
2. Resolve each package in this precedence: installed package manifest (exact
   version) → lockfile (exact version) → any dependency section of
   `package.json` (declared range) → absent. Mark the source respectively as
   `node_modules`, `lockfile`, `package_json`, or `absent`. Read npm v7+ and
   legacy `package-lock.json`/`npm-shrinkwrap.json` and Yarn Classic/Berry lock
   entries. `pnpm-lock.yaml` is intentionally ignored because npm and Yarn are
   the supported consumer package managers. Invalid or unparseable supported
   lockfiles do not crash the CLI: emit `lockfile_unreadable`, fall back to the
   manifest declaration, and block only when no safe compatible conclusion can
   be made.
3. Use one small, tested semver utility rather than regex ranges. It must compare
   exact resolved versions against the JSON policy and determine whether a
   declared range has a non-empty intersection with the policy. Prereleases,
   aliases, tags, git/file/workspace specifiers, malformed versions and ranges
   with no provable intersection are `unsupported_specifier` and block; do not
   guess an installed version from them.
4. Check runtime Node from `process.versions.node` against the Node policy. Check
   `@angular/core`, `@angular/cli`, `typescript`, `tailwindcss`,
   `@angular/cdk`, and `@spartan-ng/brain`. Additionally require the resolved
   `@angular/core`, `@angular/cli`, and `@angular/cdk` majors to agree when all
   are present; a mixed Angular major is a separate `angular_major_mismatch`
   blocker. TypeScript is checked against the selected Angular compiler policy,
   not merely against its own declared range.
5. `doctor` evaluates readiness for `init`: Node, Angular core/CLI, TypeScript
   and Tailwind must be compatible; CDK and Spartan may be absent and are
   reported as `will_install` informational checks because `init` owns their
   installation. Existing incompatible CDK/Spartan are blockers. `init` uses
   the same policy. `add` requires compatible CDK and Spartan to already be
   present, so absence is a blocker instructing the user to run `init` first.
   The existing private-package/token checks run only after all local blockers
   pass, preserving the no-network behavior for an invalid local environment.
6. `doctor` always performs inspection only and returns exit 0 iff no blocking
   check exists. `init`/`add` call the identical preflight before path planning,
   package JSON/CSS/component writes, or installation; `--skip-install` does
   not bypass it. A compatibility failure yields exit 1 with no partial files.

## CLI, tests, and documentation

1. Keep `company-angular doctor [--cwd path]` as the public diagnostic command;
   add `--json` for machine-readable `{ ok, checks }` output while the default
   remains human-readable Portuguese messages. Reject unknown/missing flag
   values through the existing argument error path. `init` and `add` do not need
   a new public flag.
2. Update `packages/angular/build.mjs` so the compatibility module and policy
   are shipped in `dist/`; package tests must import built artifacts to prove the
   published CLI works independently of workspace source.
3. Expand `packages/angular/test/cli.test.mjs` with fixtures for npm, Yarn
   Classic and Yarn Berry exact locks; installed-manifest precedence;
   declaration fallback; invalid lockfile; each supported and unsupported Node
   line; Angular 21/22/23; mismatched core/CLI/CDK majors; supported and
   unsupported TypeScript, Tailwind and Spartan; absent CDK/Spartan for
   doctor/init versus add; aliases/prereleases; and JSON/default output. Stub
   package-registry requests and assert local blockers avoid calling the stub.
   Snapshot every relevant consumer file before each failing `doctor`, `init`,
   and `add` test and assert byte-for-byte equality afterward.
4. Add an Angular README compatibility table and troubleshooting section that
   names the supported ranges from the policy, explains resolved-versus-declared
   results, `will_install`, lockfile repair, and the exact commands for doctor,
   init and add. Link the package README from the root documentation; do not
   paste a second version matrix elsewhere.
5. Validate with the Angular package test suite, template check, package build,
   the repository verification command, and a packed-package smoke fixture that
   invokes `doctor --json` using only the generated `dist`. Record all commands
   and outcomes in the implementation evidence. No release, tag, or package
   publication belongs to DS-2.
