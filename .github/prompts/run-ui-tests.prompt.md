---
description: "Run UI tests and summarize failures"
agent: "test-engineer"
tools: ["read", "execute", "todo"]
---

# Run UI Tests

Execute Playwright UI tests and provide detailed failure analysis.

## Workflow

### 1. Install Playwright Dependencies (REQUIRED FIRST STEP)

**CRITICAL**: Before running UI tests, install Playwright browsers and system dependencies.

Run this command from the repository root:
```bash
npm run test:ui:install --workspace=frontend
```

**Ubuntu/Linux Requirement**:
- In Ubuntu/Linux environments, `test:ui:install` is MANDATORY
- It performs `playwright install --with-deps chromium` to install browser and OS dependencies
- The command now includes automatic bounded Ubuntu repository remediation for the common Yarn GPG key issue
- It includes one automatic retry after remediation

**If install fails**:
- Stop immediately - do NOT continue to test execution
- Report an environment blocker with:
  - The failing command
  - Key error lines from the output
- Do NOT perform ad-hoc package hunting or broad OS troubleshooting beyond the automated remediation

**When to re-run**:
- After any container rebuild or fresh environment setup
- First time running UI tests in a new workspace
- If you see "executable doesn't exist" errors

### 2. Ensure Services Are Running

Before executing UI tests, verify both backend and frontend are running:

Check for running processes:
```bash
ps aux | grep -E "(node.*backend|node.*frontend)"
```

If services are NOT running, start them from the repository root:
```bash
npm start
```

This starts both backend (port 3001) and frontend (port 3000) concurrently.

Wait a few seconds for both services to be ready before proceeding.

### 3. Run UI Tests

Execute Playwright tests using the project command:
```bash
npm run test:ui --workspace=frontend
```

This runs all UI tests in `packages/frontend/tests/ui/`.

### 4. Analyze Results

Review the test output:

**Pass/Fail Summary**:
- Total tests executed
- Number passed
- Number failed
- Number skipped

**For Passing Tests**:
- Confirm all critical user journeys are covered
- Note any skipped tests and why

**For Failing Tests**:
- Capture the failure message and stack trace
- Identify which test scenario failed
- Note any screenshots or trace files generated

### 5. Categorize Failures

For each failing test, determine the likely root cause:

**Application Code Defect**:
- Feature not implemented correctly
- Business logic error
- API response issue
- UI rendering problem

**Test Code Defect**:
- Flaky selector (element not found)
- Incorrect assertion
- Race condition (timing issue)
- Test setup/teardown problem

**Environment Defect**:
- Service not running
- Port conflict
- Browser dependency missing
- Network issue

### 6. Provide Recommendations

Based on failure analysis:

**For Application Code Defects**:
- Identify the source file and approximate location
- Suggest fix or reference related implementation
- Recommend re-running `/execute-step` if significant work is needed

**For Test Code Defects**:
- Identify the test file and failing assertion
- Suggest test improvements (better selectors, waits, etc.)
- Recommend updating the test with `/create-ui-tests`

**For Environment Defects**:
- Provide specific commands to resolve the issue
- Check service status, port availability, etc.

### 7. Report Summary

Provide a clear, actionable report:

```
## UI Test Results

✅ **Passed**: X tests
❌ **Failed**: Y tests
⏭️ **Skipped**: Z tests

### Failures

1. **Test Name**: Brief description
   - **Category**: Application Code / Test Code / Environment
   - **Root Cause**: Specific reason for failure
   - **Recommendation**: What to do next

### Next Steps

- [ ] Fix identified issues
- [ ] Re-run `/run-ui-tests` to verify fixes
- [ ] Proceed to `/validate-step` once all tests pass
```

## Troubleshooting Common Issues

**"Executable doesn't exist"**:
- Run `npm run test:ui:install --workspace=frontend` first
- This is REQUIRED in Ubuntu/Linux environments

**"Connection refused" or "ECONNREFUSED"**:
- Ensure both backend and frontend services are running
- Run `npm start` from the repository root
- Check that ports 3000 and 3001 are available

**"Cannot find module" errors**:
- Ensure dependencies are installed: `npm install`
- Check for missing test dependencies

**"Test timeout"**:
- Check if services are responsive
- Look for infinite loops or blocking operations
- Increase timeout if needed for slower environments

## References

- [Testing Guidelines](../../docs/testing-guidelines.md) for UI testing standards
- [Playwright Documentation](https://playwright.dev/) for debugging tools
