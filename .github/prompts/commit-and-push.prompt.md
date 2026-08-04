---
description: "Analyze changes, generate commit message, and push to feature branch"
tools: ["read", "execute", "todo"]
---

# Commit and Push Changes

Analyze changes, generate a conventional commit message, and push to a feature branch.

## Input

**Branch name (REQUIRED)**: ${input:branchName:Enter feature branch name (e.g., feature/add-todo-edit)}

## Workflow

### 1. Pre-Commit Validation

Check if the current step requires UI workflow:
- If UI tests are required AND have not been run successfully in this chat:
  - Run `npm run test:ui` to validate UI tests pass
  - If tests fail, stop and report failures
  - Do not proceed to commit until UI tests pass

### 2. Analyze Changes

- Run `git diff` to review all modifications
- Run `git status` to see staged and unstaged files
- Identify the primary purpose of the changes

### 3. Generate Commit Message

Create a conventional commit message following the format:

```
<type>: <short description>

<optional detailed description if needed>
```

Types:
- `feat:` - New feature
- `fix:` - Bug fix
- `chore:` - Maintenance task
- `docs:` - Documentation changes
- `test:` - Test additions or modifications
- `refactor:` - Code restructuring without behavior change

Example: `feat: add todo editing functionality`

### 4. Branch Management

Check if the branch exists:
- Run `git branch --list ${branchName}`

If the branch does NOT exist:
- Create and switch to it: `git checkout -b ${branchName}`

If the branch exists:
- Switch to it: `git checkout ${branchName}`

**CRITICAL**: DO NOT commit to `main` or any other branch. ONLY use the user-provided branch name.

### 5. Stage, Commit, and Push

- Stage all changes: `git add .`
- Commit with the generated message: `git commit -m "<commit-message>"`
- Push to the specified branch: `git push origin ${branchName}`

### 6. Report Results

Confirm:
- Commit message used
- Branch name
- Files committed
- Push status

## References

- Git Workflow section in [copilot-instructions.md](../copilot-instructions.md) for commit conventions
