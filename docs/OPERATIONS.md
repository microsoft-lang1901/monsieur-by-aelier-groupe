# Operations

Operational notes for maintaining MONSIEUR by Aelier Groupe without assuming live service access.

<!-- portfolio-maintenance-20260717:operations:start -->
## Routine Validation

- `start` is declared in the root package scripts.
- `typecheck` is declared in the root package scripts.
- `test` is declared in the root package scripts.
- `verify` is declared in the root package scripts.

For documentation-only changes, always run `git diff --check`, validate relative Markdown links, and scan the changed tree for secrets. Runtime tests require the repository dependencies and should not be installed solely for a documentation edit when storage is constrained.

## Controlled Commands

The following root scripts are operationally sensitive and require their project approvals: lint:deployment, release:local, release:production-check.

## Data and Secrets

- Treat local environment files, credentials, customer data, supplier data, and generated browser profiles as non-source artifacts.
- Keep reproducible outputs such as `node_modules/`, `.next/`, `dist/`, build caches, and virtual environments out of preservation commits unless a repository explicitly tracks a release artifact.
- Back up source and evidence before removing duplicate worktrees.

## Recovery

The baseline for this documentation branch is `5047131afab78e77ab91069ad7e52cd96f8e7b7f` on `main`. Restore runtime state from Git history and repository-managed migrations or seed procedures; do not treat local caches as backups.
<!-- portfolio-maintenance-20260717:operations:end -->
