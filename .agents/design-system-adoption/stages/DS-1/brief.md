# DS-1 — Private package consumption

Document the secure consumption of private `@code2youlabs/*` packages by Angular
consumer repositories that remain outside the `Code2YouLabs` organization.

## Issue and outcome

- Issue: `Code2YouLabs/design-system#12`.
- Consumers can install the packages in local development, GitHub Actions, and a
  Docker build without putting a PAT in Git, logs, Docker `ARG`/`ENV`, or image
  layers.

## Acceptance criteria

- The consumer `.npmrc` references only `${NODE_AUTH_TOKEN}`.
- A copyable GitHub Actions workflow uses a repository secret for an external
  consumer repository.
- A BuildKit Docker example and local command pass the token as a secret only.
- The guide covers absent tokens, account/package permission, rotation, and
  revocation.
- An automated inspection verifies that the final Docker image does not contain
  the token.

## Constraints

- Keep the Design System package repository free of consumer credentials.
- Do not assume the external consumer's `GITHUB_TOKEN` can read private packages.
- Keep the example outside Yarn workspaces and avoid making Docker/secret access a
  requirement of the repository's normal `yarn verify` command.
