---
description: "Execute instructions from the current GitHub Issue step"
agent: "tdd-developer"
tools: ["search", "read", "edit", "execute", "web", "todo"]
---

# Execute Step Instructions

Execute the current step's instructions from the GitHub Issue, following Test-Driven Development principles.

## Input

Issue number (optional): ${input:issueNumber:Enter issue number, or leave blank to auto-detect}

## Workflow

### 1. Find the Exercise Issue

${issueNumber}

If no issue number was provided:
- Use `gh issue list --state open` to find issues
- Identify the main exercise issue (has "Exercise:" in the title)
- Extract the issue number

### 2. Get Issue Content with Comments

- Run `gh issue view <issue-number> --comments`
- Parse the complete issue including all step comments

### 3. Identify Current Step

- Look for the latest step that hasn't been completed
- Parse the step instructions including all `:keyboard: Activity:` sections

### 4. Execute Activities Systematically

For each activity in the current step:

- Follow TDD workflow: write tests first, then implementation
- Make incremental changes that are small and testable
- Run relevant tests after each change to validate
- Apply patterns from project documentation

**SCOPE BOUNDARY**: Do NOT create or run Playwright UI tests in this prompt.

**HANDOFF RULE**: If the step requires UI testing:
- Use `/create-ui-tests` for Playwright test creation (auto-switches to test-engineer)
- Use `/run-ui-tests` for Playwright test execution (auto-switches to test-engineer)

### 5. Validate Work

- Run unit tests: `npm test`
- Run integration tests if applicable
- Fix any lint errors: `npm run lint`

### 6. Report Completion

**DO NOT commit or push changes** - that's handled by `/commit-and-push`

Provide next steps in this order:

**If the current step requires UI workflow:**
1. `/create-ui-tests` (creates Playwright tests)
2. `/run-ui-tests` (runs and validates UI tests)
3. `/validate-step {step-number}` (verifies success criteria)

**If UI workflow is NOT required:**
1. `/validate-step {step-number}` (verifies success criteria)

**IMPORTANT**: Never recommend `/validate-step` before completing required UI prompts.

## References

- [Testing Guidelines](../../docs/testing-guidelines.md) for TDD patterns
- [Workflow Patterns](../../docs/workflow-patterns.md) for development workflow
- Workflow Utilities section in [copilot-instructions.md](../copilot-instructions.md) for gh CLI commands
