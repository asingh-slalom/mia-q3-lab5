import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../App';

// Create a test query client
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

// Mock fetch for tests
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
);

test('renders TODO App heading', async () => {
  const testQueryClient = createTestQueryClient();

  render(
    <QueryClientProvider client={testQueryClient}>
      <App />
    </QueryClientProvider>
  );

  const headingElement = await screen.findByText(/TODO App/i);
  expect(headingElement).toBeInTheDocument();
});

describe('Delete Functionality', () => {
  test('should call DELETE endpoint when delete button is clicked', async () => {
    const mockTodos = [
      { id: 1, title: 'Test Todo', completed: false },
    ];

    global.fetch = jest.fn((url, options) => {
      if (options?.method === 'DELETE') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTodos),
      });
    });

    const testQueryClient = createTestQueryClient();
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={testQueryClient}>
        <App />
      </QueryClientProvider>
    );

    // Wait for todo to appear
    await screen.findByText('Test Todo');

    // Find and click the delete button
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    // Verify DELETE fetch was called
    await waitFor(() => {
      const deleteCalls = global.fetch.mock.calls.filter(
        call => call[1]?.method === 'DELETE'
      );
      expect(deleteCalls.length).toBeGreaterThan(0);
    });
    
    await waitFor(() => {
      const deleteCalls = global.fetch.mock.calls.filter(
        call => call[1]?.method === 'DELETE'
      );
      expect(deleteCalls[0][0]).toContain('/api/todos/1');
    });
  });

  test('should remove todo from list after successful deletion', async () => {
    let mockTodos = [
      { id: 1, title: 'Test Todo to Delete', completed: false },
    ];

    global.fetch = jest.fn((url, options) => {
      if (options?.method === 'DELETE') {
        mockTodos = [];
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTodos),
      });
    });

    const testQueryClient = createTestQueryClient();
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={testQueryClient}>
        <App />
      </QueryClientProvider>
    );

    // Wait for todo to appear
    await screen.findByText('Test Todo to Delete');

    // Find and click the delete button
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    // Verify the todo is removed from the list
    await waitFor(() => {
      expect(screen.queryByText('Test Todo to Delete')).not.toBeInTheDocument();
    });
  });
});

describe('Stats Calculation', () => {
  test('should display correct count of incomplete todos', async () => {
    const mockTodos = [
      { id: 1, title: 'Todo 1', completed: false },
      { id: 2, title: 'Todo 2', completed: false },
      { id: 3, title: 'Todo 3', completed: true },
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTodos),
      })
    );

    const testQueryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={testQueryClient}>
        <App />
      </QueryClientProvider>
    );

    // Wait for todos to load and check stats
    await waitFor(() => {
      expect(screen.getByText('2 items left')).toBeInTheDocument();
    });
  });

  test('should display correct count of completed todos', async () => {
    const mockTodos = [
      { id: 1, title: 'Todo 1', completed: false },
      { id: 2, title: 'Todo 2', completed: true },
      { id: 3, title: 'Todo 3', completed: true },
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTodos),
      })
    );

    const testQueryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={testQueryClient}>
        <App />
      </QueryClientProvider>
    );

    // Wait for todos to load and check stats
    await waitFor(() => {
      expect(screen.getByText('2 completed')).toBeInTheDocument();
    });
  });

  test('should update stats when all todos are completed', async () => {
    const mockTodos = [
      { id: 1, title: 'Todo 1', completed: true },
      { id: 2, title: 'Todo 2', completed: true },
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTodos),
      })
    );

    const testQueryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={testQueryClient}>
        <App />
      </QueryClientProvider>
    );

    // Wait for todos to load and check stats
    await waitFor(() => {
      expect(screen.getByText('0 items left')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText('2 completed')).toBeInTheDocument();
    });
  });
});

describe('Empty State', () => {
  test('should display empty state message when there are no todos', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    const testQueryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={testQueryClient}>
        <App />
      </QueryClientProvider>
    );

    // Wait for and check empty state message
    await waitFor(() => {
      expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
    });
  });

  test('should not display empty state message when there are todos', async () => {
    const mockTodos = [
      { id: 1, title: 'Test Todo', completed: false },
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTodos),
      })
    );

    const testQueryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={testQueryClient}>
        <App />
      </QueryClientProvider>
    );

    // Wait for todo to appear
    await screen.findByText('Test Todo');

    // Verify empty state is not shown
    expect(screen.queryByText(/no todos yet/i)).not.toBeInTheDocument();
  });
});

describe('Error Handling', () => {
  test('should display error message when fetching todos fails', async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Network error'))
    );

    const testQueryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={testQueryClient}>
        <App />
      </QueryClientProvider>
    );

    // Wait for and check error message
    await waitFor(() => {
      expect(screen.getByText(/error loading todos/i)).toBeInTheDocument();
    });
  });

  test('should display error message when API returns error response', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Server error' }),
      })
    );

    const testQueryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={testQueryClient}>
        <App />
      </QueryClientProvider>
    );

    // Wait for and check error message
    await waitFor(() => {
      expect(screen.getByText(/error loading todos/i)).toBeInTheDocument();
    });
  });
});

afterEach(() => {
  jest.clearAllMocks();
});
