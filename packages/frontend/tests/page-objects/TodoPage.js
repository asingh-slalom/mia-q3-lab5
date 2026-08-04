/**
 * Page Object Model for TODO Application
 * Encapsulates selectors and interactions for the TODO app
 */
class TodoPage {
  constructor(page) {
    this.page = page;
    
    // Selectors
    this.todoInput = 'input[placeholder="What needs to be done?"]';
    this.addButton = 'button:has-text("Add")';
    this.todoList = 'ul';
    this.loadingSpinner = '[role="progressbar"]';
    this.errorMessage = 'text=Error loading todos';
    this.emptyStateMessage = 'text=No todos yet';
    this.statsIncomplete = 'text=/\\d+ items left/';
    this.statsCompleted = 'text=/\\d+ completed/';
  }

  /**
   * Navigate to the TODO app
   */
  async goto() {
    await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  }

  /**
   * Add a new TODO item
   * @param {string} title - The title of the TODO
   */
  async addTodo(title) {
    await this.page.fill(this.todoInput, title);
    await this.page.click(this.addButton);
    // Wait for the new todo to appear in the list
    await this.page.waitForSelector(`text=${title}`, { state: 'visible' });
  }

  /**
   * Get a TODO item by its title text
   * @param {string} title - The title to search for
   * @returns {Locator} The TODO list item locator
   */
  getTodoByTitle(title) {
    return this.page.locator(`li:has-text("${title}")`);
  }

  /**
   * Toggle the completion status of a TODO
   * @param {string} title - The title of the TODO to toggle
   */
  async toggleTodo(title) {
    const todoItem = this.getTodoByTitle(title);
    const checkbox = todoItem.locator('input[type="checkbox"]');
    await checkbox.click();
    // Wait for the UI to update (text decoration change)
    await this.page.waitForTimeout(300); // Brief wait for animation
  }

  /**
   * Check if a TODO is marked as completed (has line-through)
   * @param {string} title - The title of the TODO to check
   * @returns {Promise<boolean>} True if completed
   */
  async isTodoCompleted(title) {
    const todoItem = this.getTodoByTitle(title);
    const todoText = todoItem.locator('p');
    const textDecoration = await todoText.evaluate((el) => 
      window.getComputedStyle(el).textDecoration
    );
    return textDecoration.includes('line-through');
  }

  /**
   * Delete a TODO item
   * @param {string} title - The title of the TODO to delete
   */
  async deleteTodo(title) {
    const todoItem = this.getTodoByTitle(title);
    const deleteButton = todoItem.locator('button[aria-label="delete"]');
    await deleteButton.click();
    // Wait for the todo to be removed from the DOM
    await this.page.waitForSelector(`text=${title}`, { state: 'detached' });
  }

  /**
   * Get all TODO items from the list
   * @returns {Promise<Array>} Array of TODO items
   */
  async getAllTodos() {
    const todos = await this.page.locator('li').all();
    return todos;
  }

  /**
   * Check if the empty state message is visible
   * @returns {Promise<boolean>}
   */
  async isEmptyStateVisible() {
    return await this.page.locator(this.emptyStateMessage).isVisible();
  }

  /**
   * Check if the loading spinner is visible
   * @returns {Promise<boolean>}
   */
  async isLoadingVisible() {
    return await this.page.locator(this.loadingSpinner).isVisible();
  }

  /**
   * Check if an error message is displayed
   * @returns {Promise<boolean>}
   */
  async isErrorVisible() {
    return await this.page.locator(this.errorMessage).isVisible();
  }

  /**
   * Get the incomplete items count from stats chip
   * @returns {Promise<number>}
   */
  async getIncompleteCount() {
    const text = await this.page.locator(this.statsIncomplete).textContent();
    const match = text.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  /**
   * Get the completed items count from stats chip
   * @returns {Promise<number>}
   */
  async getCompletedCount() {
    const text = await this.page.locator(this.statsCompleted).textContent();
    const match = text.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  /**
   * Clear the input field
   */
  async clearInput() {
    await this.page.fill(this.todoInput, '');
  }

  /**
   * Get the current value of the input field
   * @returns {Promise<string>}
   */
  async getInputValue() {
    return await this.page.inputValue(this.todoInput);
  }
}

module.exports = { TodoPage };
