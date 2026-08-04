---
description: "Create UI tests for required critical user journeys"
agent: "test-engineer"
tools: ["search", "read", "edit", "execute", "todo"]
---

# Create UI Tests

Create Playwright UI tests for critical user journeys with a strict limit on test count.

## Input

**Journeys (optional)**: ${input:journeys:Enter specific journeys to test, or leave blank for default set}

## Default Test Scenarios

If no specific journeys are provided, create tests for:
- Create a new TODO item
- Edit an existing TODO item
- Toggle TODO completion status
- Delete a TODO item
- Core error-state handling (e.g., empty input, server error)

## Test Count Constraints

**HARD LIMIT**: Create a maximum of 5 Playwright test cases in this run.

**Target**: 3-5 total test cases that cover the highest-risk scenarios.

**Requirements**:
- Include at least 1 error-path test within the 3-5 total
- If more than 5 candidate scenarios exist, select the 5 highest-risk scenarios
- List any deferred scenarios instead of creating more tests

## Workflow

### 1. Review Existing UI Tests

- Check `packages/frontend/tests/ui/` for existing tests
- Identify what's already covered
- Determine what needs to be added or updated

### 2. Plan Test Scenarios

Based on the requested journeys:
- Identify critical user paths
- Select highest-risk scenarios (max 5)
- Include both happy paths and error paths
- Document any deferred scenarios

### 3. Apply Page Object Model (POM)

**Page Objects**: Place reusable interactions and selectors in page objects
- Create or update page objects in a dedicated location
- Extract common actions (click, fill, wait for element)
- Use stable selectors (test IDs, roles, accessible labels)

**Test Files**: Keep tests scenario-focused
- Import and use page objects
- Write clear test descriptions
- Focus on user journey validation

Example structure:
```javascript
// page-objects/TodoPage.js
class TodoPage {
  constructor(page) {
    this.page = page;
  }
  
  async addTodo(text) {
    await this.page.fill('[data-testid="todo-input"]', text);
    await this.page.click('[data-testid="add-button"]');
  }
}

// tests/ui/todo-crud.spec.js
test('user can create a new todo', async ({ page }) => {
  const todoPage = new TodoPage(page);
  await todoPage.addTodo('New task');
  // assertions...
});
```

### 4. Write Test Cases

For each test case:
- Use descriptive test names that explain the user journey
- Prefer stable selectors: `data-testid`, `role`, `aria-label`
- Use state-based waits: `waitForSelector`, `waitForResponse`
- Avoid hard-coded timeouts
- Include clear assertions that validate expected outcomes

### 5. Verify Test Count

**CRITICAL VERIFICATION**:
- Count all created/updated Playwright test cases (`test(...)` or `it(...)`)
- If count exceeds 5, reduce to the 5 highest-priority tests
- Move lower-priority tests to a "Deferred Scenarios" list

Do NOT claim "small scope" if the final authored count is greater than 5.

### 6. Report Results

Provide a summary:

**Files Created/Modified**:
- List all test files and page objects changed

**Test Scenarios Covered** (max 5):
- List each test case with description
- Indicate which are happy paths vs. error paths

**Deferred Scenarios** (if applicable):
- List scenarios that were not implemented due to the 5-test limit
- Explain prioritization rationale

**Next Steps**:
- Recommend running `/run-ui-tests` to validate the new tests

## Best Practices

- **Stable Selectors**: Use `data-testid` attributes or semantic roles
- **State-Based Waits**: Wait for specific conditions, not arbitrary timeouts
- **Isolation**: Each test should be independent and reusable
- **Clarity**: Test names should read like user stories
- **Error Paths**: Include at least one test for error handling

## References

- [Testing Guidelines](../../docs/testing-guidelines.md) for UI testing patterns
- [Playwright Documentation](https://playwright.dev/) for API reference
