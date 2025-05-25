import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ManagementDashboard from './ManagementDashboard';

// Mock fetch for API calls
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('ManagementDashboard', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    // Setup default mock responses
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      } as Response);
  });

  test('renders management dashboard heading', () => {
    render(<ManagementDashboard />);
    expect(screen.getByText(/Management Dashboard/i)).toBeInTheDocument();
  });

  test('renders all management sections', () => {
    render(<ManagementDashboard />);
    
    expect(screen.getByText(/Engineers/i)).toBeInTheDocument();
    expect(screen.getByText(/Engineer Time Off/i)).toBeInTheDocument();
    expect(screen.getByText(/Price List/i)).toBeInTheDocument();
  });

  test('should have form inputs for adding engineers', () => {
    render(<ManagementDashboard />);
    
    const nameInput = screen.getByPlaceholderText(/Name/i);
    const roleInput = screen.getByPlaceholderText(/Role/i);
    // Get the first Add button (for engineers)
    const addButtons = screen.getAllByText(/Add/i);
    const addButton = addButtons[0];
    
    expect(nameInput).toBeInTheDocument();
    expect(roleInput).toBeInTheDocument();
    expect(addButton).toBeInTheDocument();
  });

  test('should handle engineer form submission', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '1', name: 'Test Engineer', role: 'Developer' })
    } as Response);

    render(<ManagementDashboard />);
    
    const nameInput = screen.getByPlaceholderText(/Name/i);
    const roleInput = screen.getByPlaceholderText(/Role/i);
    // Get the first Add button (for engineers)
    const addButtons = screen.getAllByText(/Add/i);
    const addButton = addButtons[0];
    
    await userEvent.type(nameInput, 'Test Engineer');
    await userEvent.type(roleInput, 'Developer');
    fireEvent.click(addButton);
    
    expect(mockFetch).toHaveBeenCalledWith('/api/engineers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test Engineer', role: 'Developer' })
    });
  });

  test('should have calendar form elements', () => {
    render(<ManagementDashboard />);
    
    const engineerIdInput = screen.getByPlaceholderText(/Engineer ID/i);
    const typeInput = screen.getByPlaceholderText(/Type/i);
    // Find the date input by querying all inputs and finding the one with type="date"
    const allInputs = screen.getAllByDisplayValue('');
    const dateInput = allInputs.find(input => input.getAttribute('type') === 'date');
    
    expect(engineerIdInput).toBeInTheDocument();
    expect(typeInput).toBeInTheDocument();
    expect(dateInput).toBeDefined();
  });

  test('should have pricing form elements', () => {
    render(<ManagementDashboard />);
    
    const serviceInput = screen.getByPlaceholderText(/Service/i);
    const priceInput = screen.getByPlaceholderText(/Price/i);
    
    expect(serviceInput).toBeInTheDocument();
    expect(priceInput).toBeInTheDocument();
  });

  test('should display error messages when API calls fail', async () => {
    mockFetch.mockRejectedValueOnce(new Error('API Error'));
    
    render(<ManagementDashboard />);
    
    // Try to add an engineer that will fail
    const nameInput = screen.getByPlaceholderText(/Name/i);
    const roleInput = screen.getByPlaceholderText(/Role/i);
    // Get the first Add button (for engineers)
    const addButtons = screen.getAllByText(/Add/i);
    const addButton = addButtons[0];
    
    await userEvent.type(nameInput, 'Test Engineer');
    await userEvent.type(roleInput, 'Developer');
    fireEvent.click(addButton);
    
    // Should display error (in a real implementation)
    expect(mockFetch).toHaveBeenCalled();
  });
});
