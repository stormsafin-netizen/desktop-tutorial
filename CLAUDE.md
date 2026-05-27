# CLAUDE.md

## Repository Overview

This is a GitHub Desktop tutorial repository (`stormsafin-netizen/desktop-tutorial`). It was created as a learning exercise for the [GitHub Desktop](https://desktop.github.com/) application and has no application source code — the only content file is `README.md`.

**Current state:** Single-file repository with one initial commit. Use it to practice git workflows, branching, and pull requests.

## Repository Structure

```
desktop-tutorial/
└── README.md    # GitHub Desktop welcome/tutorial stub
```

## Git Workflow

### Branching

- Default branch: `main`
- Feature/task branches follow the pattern: `<actor>/<short-description>-<id>`
  - Example: `claude/claude-md-docs-feHbz`
- Always develop on a named branch; never commit directly to `main`.

### Commit Style

- Use short imperative subject lines (≤72 chars): `Add CLAUDE.md documentation`
- No period at the end of the subject line.
- If a body is needed, separate it from the subject with a blank line.

### Pull Requests

- Open PRs as **draft** until ready for review.
- PR title mirrors the commit subject style.
- Keep PRs focused: one logical change per PR.
- After pushing a branch, always create a PR targeting `main`.

## Development Conventions

Since there is no application code yet, conventions below apply when code is added:

- **Language / tooling:** Not yet established. Update this file when a stack is chosen.
- **Tests:** None configured. Add test commands here when a test framework is introduced.
- **Linting / formatting:** None configured. Document tools and run commands here when added.
- **Build:** No build step. Document here when one is introduced.

## Working in This Repository

Because the repository is essentially empty, most tasks will be:

1. **Editing `README.md`** — fill in the owner's name or expand project documentation.
2. **Practicing git workflows** — create branches, open PRs, merge changes.
3. **Adding new files** — if a project grows out of this tutorial repo, update this file to reflect the new structure, stack, and commands.

## Updating This File

Keep CLAUDE.md current whenever:
- New source files or directories are added.
- A build, test, or lint tool is introduced.
- Branching or commit conventions change.
- A new contributor workflow is established.
