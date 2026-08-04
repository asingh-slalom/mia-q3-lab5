---
description: "Workspace-wide Copilot instructions for the TODO application"
---

# TODO Application Copilot Instructions

## Project Context

- Full-stack TODO application with React frontend and Express backend.
- Focus on iterative, feedback-driven development.
- Current phase: Backend stabilization and frontend feature completion.

## Documentation References

Use the existing project documentation before making changes:

- [Project Overview](../docs/project-overview.md) for architecture, tech stack, and repository structure.
- [Testing Guidelines](../docs/testing-guidelines.md) for test patterns, TDD expectations, and quality standards.
- [Workflow Patterns](../docs/workflow-patterns.md) for development workflow guidance.

## Development Principles

- Follow Test-Driven Development with a Red-Green-Refactor cycle.
- Make incremental changes that stay small, reviewable, and testable.
- Debug systematically by using failing tests and runtime feedback as the next guide.
- Validate before commit: all relevant tests pass and no lint errors remain.

## Testing Scope

This project uses unit tests, integration tests, and UI end-to-end tests to balance fast feedback with end-to-end confidence.

- Backend: Jest + Supertest for API testing.
- Frontend: React Testing Library for component unit and integration tests.
- UI testing: Playwright for critical user journey automation.
- Manual browser testing for exploratory validation and visual checks.
- Reason: combine fast feedback from unit and integration tests with quality confidence from browser-level UI coverage.

**Testing Approach by Context**

- Backend API changes: write Jest tests first, then implement using Red-Green-Refactor.
- Frontend component features: write React Testing Library tests first for component behavior, then implement using Red-Green-Refactor.
- After frontend behavior changes, follow with manual browser testing for full UI flow validation.
- Treat this as true TDD: test first, then write the code required to pass the test.

## Workflow Patterns

Use these development workflows consistently:

1. TDD Workflow: write or fix tests, run them, confirm failure, implement the minimum change, pass the tests, then refactor.
2. Code Quality Workflow: run lint, categorize the issues, fix them systematically, then re-validate.
3. Integration Workflow: identify the issue, debug it, add or run tests, fix the root cause, then verify end-to-end behavior.
4. UI Testing Workflow: define critical journeys, create UI tests, run them, debug failures, and validate coverage.

## Agent Usage

Use specialized agents according to scope:

- `tdd-developer`: implementation work and unit or integration TDD cycles. Do not create or run Playwright UI tests in this mode.
- `code-reviewer`: lint remediation and code quality improvements.
- `test-engineer`: all Playwright UI test authoring, execution, failure triage, and isolation checks.

## Memory System

- Persistent Memory: This file (.github/copilot-instructions.md) contains foundational principles and workflows.
- Working Memory: .github/memory/ directory contains discoveries and patterns.
- During active development, take notes in .github/memory/scratch/working-notes.md (not committed).
- At end of session, summarize key findings into .github/memory/session-notes.md (committed).
- Document recurring code patterns in .github/memory/patterns-discovered.md (committed).
- Reference these files when providing context-aware suggestions.

## Workflow Utilities

Use GitHub CLI to support issue-driven workflow automation in any mode:

- List open issues: `gh issue list --state open`
- Get issue details: `gh issue view <issue-number>`
- Get issue with comments: `gh issue view <issue-number> --comments`
- The main exercise issue will have `Exercise:` in the title.
- Steps are posted as comments on the main issue.
- Use these commands when `/execute-step` or `/validate-step` prompts are invoked.

## Git Workflow

- Use conventional commits such as `feat:`, `fix:`, `chore:`, and `docs:`.
- Create feature branches with the format `feature/<descriptive-name>`.
- Stage all changes before committing with `git add .`.
- Push to the intended branch with `git push origin <branch-name>`.