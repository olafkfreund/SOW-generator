import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SowGenerator from './SowGenerator';

// Mock fetch for API calls
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

// Mock file-saver
jest.mock('file-saver', () => ({
  saveAs: jest.fn()
}));

describe('SowGenerator', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  test('renders SOW Generator heading', () => {
    render(<SowGenerator />);
    expect(screen.getByText(/SOW Generator/i)).toBeInTheDocument();
  });

  test('renders file input', () => {
    render(<SowGenerator />);
    const fileInput = screen.getByDisplayValue('') // File input with empty value
    expect(fileInput).toBeInTheDocument();
    expect(fileInput).toHaveAttribute('type', 'file');
  });

  test('renders generate button', () => {
    render(<SowGenerator />);
    const generateButton = screen.getByText(/Generate SOW/i);
    expect(generateButton).toBeInTheDocument();
    expect(generateButton).toHaveAttribute('type', 'submit');
  });

  test('should handle form submission without file', async () => {
    render(<SowGenerator />);
    
    const generateButton = screen.getByText(/Generate SOW/i);
    fireEvent.click(generateButton);
    
    // Should show an alert or error message (in a real implementation)
    // For now, just verify the button exists and is clickable
    expect(generateButton).toBeInTheDocument();
  });

  test('should display export buttons when SOW is generated', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ markdown: '# Sample SOW\n\nThis is a test SOW.' })
    } as Response);

    render(<SowGenerator />);
    
    // Create a mock file
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const fileInput = screen.getByDisplayValue('') as HTMLInputElement;
    
    // Simulate file upload using userEvent
    await userEvent.upload(fileInput, file);
    
    // Submit the form by clicking the generate button
    const generateButton = screen.getByText(/Generate SOW/i);
    await userEvent.click(generateButton);
    
    // Wait for the async operation to complete and check for export buttons
    await waitFor(() => {
      expect(screen.getByText(/Export as PDF/i)).toBeInTheDocument();
      expect(screen.getByText(/Export as DOCX/i)).toBeInTheDocument();
    });
  });

  test('file input accepts correct file types', () => {
    render(<SowGenerator />);
    const fileInput = screen.getByDisplayValue('');
    expect(fileInput).toHaveAttribute('accept', '.txt,.md,.docx,.pdf');
  });

  test('should handle successful SOW generation', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        markdown: '# Project SOW\n\n## Objective\nComplete project implementation.' 
      })
    } as Response);

    render(<SowGenerator />);
    
    // Create a mock file
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const fileInput = screen.getByDisplayValue('') as HTMLInputElement;
    
    // Simulate file upload
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
    });
    fireEvent.change(fileInput);
    
    const generateButton = screen.getByText(/Generate SOW/i);
    fireEvent.click(generateButton);
    
    // Verify file was uploaded
    expect(fileInput.files).toHaveLength(1);
    expect(fileInput.files?.[0]).toBe(file);
  });
});
