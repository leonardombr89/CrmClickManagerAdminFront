# DS-1 plan

1. Add `docs/CONSUMING-PRIVATE-PACKAGES.md` as the single consumer guide; link to
   it from `README.md` and replace the duplicated consumer-installation detail in
   `docs/PUBLISHING.md` with a concise reference.
2. Document a PAT classic with the minimum `read:packages` scope, issued by an
   account with access to the private organization packages, stored in the
   consumer repository as `CODE2YOULABS_PACKAGES_TOKEN`, and mapped only at the
   relevant step to `NODE_AUTH_TOKEN`.
3. Add `examples/private-angular-consumer/` outside the workspaces. Its `.npmrc`
   must contain only the Code2YouLabs registry and
   `//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}`. Pin one published
   package version (`@code2youlabs/tokens@0.2.0`) for a reproducible install.
4. Add a copyable Actions workflow example with `contents: read` permission,
   scoped token mapping for package installation, and Docker invocation
   `docker build --secret id=node_auth_token,env=NODE_AUTH_TOKEN ...`. It must not
   define a job-level token environment, build argument, or persistent Docker
   environment variable.
5. Add a multi-stage BuildKit Dockerfile for the fixture. It may access the token
   only through `RUN --mount=type=secret,id=node_auth_token,env=NODE_AUTH_TOKEN`
   in the build stage; the final nginx image receives only the build output.
6. Add an image-inspection script that reads `docker image save` from stdin and
   compares it with `NODE_AUTH_TOKEN` without ever printing the token. Wire the
   documented local command and protected verification workflow to build the
   fixture and pipe the final image to that script. Also check `docker history
   --no-trunc` for the absence of token-bearing configuration.
7. Keep a static fixture-invariant check in ordinary CI (parameterized `.npmrc`,
   BuildKit mount present, no token `ARG`/`ENV`) and put real package installation
   plus Docker layer inspection in a dedicated protected/dispatch workflow using
   `CODE2YOULABS_PACKAGES_TOKEN`; do not add it to `yarn verify`.
8. Validate the guide's diagnostic and rotation paths: distinguish absent token
   from `401/403` permission errors; rotate by replacing the repository secret,
   running the verification build, and revoking the old PAT only after success.
