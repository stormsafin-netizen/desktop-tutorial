# CLAUDE.md

This file provides guidance for AI assistants working in this repository.

## Repository Overview

**desktop-tutorial** is a GitHub Desktop tutorial/starter repository. It was initialized via GitHub Desktop and is currently in an early stage with minimal content.

- **Owner:** stormsafin-netizen
- **Remote:** `http://local_proxy@127.0.0.1:19648/git/stormsafin-netizen/desktop-tutorial`
- **Default branch:** `master`
- **Initial commit date:** February 26, 2026

## Current State

This repository contains only a default GitHub Desktop template README. No application code, build system, or dependencies exist yet.

```
desktop-tutorial/
├── .git/
├── README.md        # GitHub Desktop default template (stub)
└── CLAUDE.md        # This file
```

## Development Workflow

### Branch Naming

Claude-driven development branches follow this pattern:
```
claude/<task-slug>-<session-id>
```
Example: `claude/claude-md-mm7na3s09gg2s0ao-NALhV`

Always develop on the designated feature branch and push there. Never push to `master` without explicit permission.

### Git Practices

```bash
# Push to the current feature branch
git push -u origin <branch-name>

# If push fails due to network errors, retry with exponential backoff:
# wait 2s → retry, wait 4s → retry, wait 8s → retry, wait 16s → retry
```

Commit messages should be clear and descriptive, summarizing _why_ the change was made.

## Conventions to Follow

Since the project has no established conventions yet, apply these defaults until project-specific ones are documented:

- **Keep changes minimal and focused** — only make changes directly requested or clearly necessary.
- **Do not create files unless required** — prefer editing existing files.
- **Avoid adding documentation** (READMEs, extra markdown) unless explicitly asked.
- **Avoid over-engineering** — no abstractions, helpers, or error handling beyond what is needed.
- **Do not add features beyond the scope** of a given task.

## Setting Up the Project

There is currently no build, test, or lint configuration. When a technology stack is introduced, update this file with:

- Installation steps (`npm install`, `pip install`, etc.)
- How to run the project locally
- How to run tests
- How to run the linter/formatter
- Any required environment variables

## Key Files

| File | Purpose |
|------|---------|
| `README.md` | Project description (currently a stub template) |
| `CLAUDE.md` | This file — AI assistant guidance |

## Notes for AI Assistants

- This repository is in an **initial/empty state**. There is no application code to analyze.
- When the user begins adding code or a technology stack, **update this CLAUDE.md** to reflect the new structure, scripts, and conventions.
- Always work on the designated `claude/` feature branch and push when complete.
- Do not guess at project conventions — ask if unclear.
