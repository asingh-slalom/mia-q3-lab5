/**
 * End-to-End UI Tests for TODO Application
 * Tests critical user journeys using Page Object Model pattern
 */
const { test, expect } = require('@playwright/test');
const { TodoPage } = require('../page-objects/TodoPage');

test.describe('TODO Application - Critical User Journeys', () => {
  let todoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    
    // Clear all existing todos for test isolation
    const response = await fetch('http://localhost:3001/api/todos');
    const existingTodos = await response.json();
    for (const todo of existingTodos) {
      await fetch(`http://localhost:3001/api/todos/${todo.id}`, { method: 'DELETE' });
    }
    
    await todoPage.goto();
    // Wait for app to load
    await page.waitForLoadState('networkidle');
  });

  /**
   * Test 1: Happy Path - Create TODO
   * User creates a new TODO item and sees it appear in the list
   */
  test('user can create a new TODO item', async ({ page }) => {
    const todoTitle = 'Buy groceries';

    // Add a new TODO
    await todoPage.addTodo(todoTitle);

    // Verify the TODO appears in the list
    const todoItem = todoPage.getTodoByTitle(todoTitle);
    await expect(todoItem).toBeVisible();

    // Verify stats update (1 incomplete item)
    const incompleteCount = await todoPage.getIncompleteCount();
    expect(incompleteCount).toBeGreaterThanOrEqual(1);

    // Verify input field is cleared after adding
    const inputValue = await todoPage.getInputValue();
    expect(inputValue).toBe('');
  });

  /**
   * Test 2: Happy Path - Toggle Completion
   * User marks a TODO as completed and sees visual feedback
   */
  test('user can toggle TODO completion status', async ({ page }) => {
    const todoTitle = 'Complete assignment';

    // Create a TODO first
    await todoPage.addTodo(todoTitle);

    // Verify it starts as incomplete
    let isCompleted = await todoPage.isTodoCompleted(todoTitle);
    expect(isCompleted).toBe(false);

    // Toggle to completed
    await todoPage.toggleTodo(todoTitle);
    isCompleted = await todoPage.isTodoCompleted(todoTitle);
    expect(isCompleted).toBe(true);

    // Toggle back to incomplete
    await todoPage.toggleTodo(todoTitle);
    isCompleted = await todoPage.isTodoCompleted(todoTitle);
    expect(isCompleted).toBe(false);

    // Verify stats reflect completion changes
    const incompleteCount = await todoPage.getIncompleteCount();
    expect(incompleteCount).toBeGreaterThanOrEqual(1);
  });

  /**
   * Test 3: Happy Path - Delete TODO
   * User deletes a TODO and it's removed from the list
   */
  test('user can delete a TODO item', async ({ page }) => {
    const todoTitle = 'Task to delete';

    // Create a TODO first
    await todoPage.addTodo(todoTitle);

    // Verify it exists
    let todoItem = todoPage.getTodoByTitle(todoTitle);
    await expect(todoItem).toBeVisible();

    // Delete the TODO
    await todoPage.deleteTodo(todoTitle);

    // Verify it's removed from the list
    todoItem = todoPage.getTodoByTitle(todoTitle);
    await expect(todoItem).not.toBeVisible();
  });

  /**
   * Test 4: Error Path - Empty Input
   * User attempts to create a TODO with empty input
   * System should not create an empty TODO
   */
  test('user cannot create a TODO with empty input', async ({ page }) => {
    // Get initial TODO count
    const initialTodos = await todoPage.getAllTodos();
    const initialCount = initialTodos.length;

    // Try to add empty TODO (just click Add without typing)
    await page.click('button:has-text("Add")');
    
    // Wait a moment for any potential async operations
    await page.waitForTimeout(500);

    // Verify no new TODO was added
    const finalTodos = await todoPage.getAllTodos();
    const finalCount = finalTodos.length;
    expect(finalCount).toBe(initialCount);

    // Try with whitespace-only input
    await page.fill('input[placeholder="What needs to be done?"]', '   ');
    await page.click('button:has-text("Add")');
    await page.waitForTimeout(500);

    // Verify still no new TODO added
    const todosAfterWhitespace = await todoPage.getAllTodos();
    expect(todosAfterWhitespace.length).toBe(initialCount);
  });

  /**
   * Test 5: Error Path - Backend Failure
   * System displays error message when backend is unavailable
   * Note: This test requires backend to be stopped or mocked to fail
   */
  test('user sees error message when backend fails', async ({ page, context }) => {
    // Intercept API calls and force them to fail
    await page.route('**/api/todos', (route) => {
      route.abort('failed');
    });

    // Reload the page to trigger the failed API call
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Wait for loading spinner to disappear (React Query retry completes)
    await page.waitForSelector('[role="progressbar"]', { state: 'detached', timeout: 5000 });

    // Verify error message is displayed
    const isErrorVisible = await todoPage.isErrorVisible();
    expect(isErrorVisible).toBe(true);

    // Verify no todos are displayed (error state)
    const errorText = await page.textContent('text=Error loading todos');
    expect(errorText).toContain('Error loading todos');
  });
});