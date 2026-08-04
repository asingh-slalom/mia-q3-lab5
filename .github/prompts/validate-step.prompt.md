---
description: "Validate that all success criteria for the current step are met"
agent: "code-reviewer"
tools: ["search", "read", "execute", "web", "todo"]
---

# Validate Step Completion

Verify that all success criteria for a specific step have been met.

## Input

**Step number (REQUIRED)**: ${input:stepNumber:Enter step number (e.g., 5-0, 5-1)}

## Workflow

### 1. Find the Exercise Issue

- Use `gh issue list --state open` to list open issues
- Identify the main exercise issue (look for "Exercise:" in the title)
- Extract the issue number

### 2. Get Issue Content with Comments

- Run `gh issue view <issue-number> --comments`
- Retrieve the complete issue including all step comments

### 3. Locate Target Step

Search through the issue content to find:
- The section starting with `# Step ${stepNumber}:`
- Extract all content for that specific step

### 4. Extract Success Criteria

Find the "Success Criteria" section within the target step:
- This section lists all requirements that must be met
- Each criterion should be checkable against the workspace

Example format:
```
## Success Criteria
- [ ] Backend API endpoint implemented
- [ ] Frontend component renders correctly
- [ ] Tests pass
- [ ] No lint errors
```

### 5. Check Each Criterion

For each success criterion:

1. **Code Verification**
   - Check if required files exist
   - Verify implementations are complete
   - Review code quality and adherence to patterns

2. **Test Verification**
   - Run relevant tests: `npm test`
   - Check test coverage for new code
   - Verify all tests pass

3. **Quality Verification**
   - Run linter: `npm run lint`
   - Check for compilation errors
   - Verify no console errors or warnings

4. **Functional Verification**
   - Verify the feature works as intended
   - Check edge cases are handled
   - Validate error handling

### 6. Report Results

Provide a detailed report:

✅ **Completed Criteria**:
- List each criterion that has been met

❌ **Incomplete Criteria**:
- List each criterion that has NOT been met
- Provide specific guidance on what needs to be done
- Include file references and line numbers where applicable

🔍 **Code Quality Issues**:
- List any lint errors or code smells
- Suggest improvements

### 7. Next Steps

If all criteria are met:
- Confirm the step is complete
- Recommend using `/commit-and-push` to save progress

If criteria are incomplete:
- Provide actionable next steps
- Reference specific files and changes needed
- Suggest re-running `/execute-step` if major work remains

## References

- [Testing Guidelines](../../docs/testing-guidelines.md) for quality standards
- Workflow Utilities section in [copilot-instructions.md](../copilot-instructions.md) for gh CLI commands
