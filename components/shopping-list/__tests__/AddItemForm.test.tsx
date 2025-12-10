/**
 * Tests for AddItemForm component
 * Feature: 002-shopping-lists
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddItemForm from '../AddItemForm';

describe('AddItemForm Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form with all fields', () => {
    render(<AddItemForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByLabelText(/Item Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Quantity/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Notes/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Item/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    mockOnSubmit.mockResolvedValue(undefined);

    render(<AddItemForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const nameInput = screen.getByLabelText(/Item Name/);
    const quantityInput = screen.getByLabelText(/Quantity/);
    const notesInput = screen.getByLabelText(/Notes/);

    fireEvent.change(nameInput, { target: { value: 'Birthday Cake' } });
    fireEvent.change(quantityInput, { target: { value: '1' } });
    fireEvent.change(notesInput, { target: { value: 'For party' } });

    fireEvent.click(screen.getByRole('button', { name: /Add Item/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Birthday Cake',
        quantity: 1,
        notes: 'For party',
      });
    });
  });

  it('shows error when name is empty', async () => {
    render(<AddItemForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    fireEvent.click(screen.getByRole('button', { name: /Add Item/i }));

    await waitFor(() => {
      expect(screen.getByText('Item name is required')).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('handles null quantity correctly', async () => {
    mockOnSubmit.mockResolvedValue(undefined);

    render(<AddItemForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const nameInput = screen.getByLabelText(/Item Name/);
    fireEvent.change(nameInput, { target: { value: 'Milk' } });

    fireEvent.click(screen.getByRole('button', { name: /Add Item/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Milk',
        quantity: null,
        notes: null,
      });
    });
  });

  it('trims whitespace from inputs', async () => {
    mockOnSubmit.mockResolvedValue(undefined);

    render(<AddItemForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const nameInput = screen.getByLabelText(/Item Name/);
    const notesInput = screen.getByLabelText(/Notes/);

    fireEvent.change(nameInput, { target: { value: '  Milk  ' } });
    fireEvent.change(notesInput, { target: { value: '  Urgent  ' } });

    fireEvent.click(screen.getByRole('button', { name: /Add Item/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Milk',
        quantity: null,
        notes: 'Urgent',
      });
    });
  });

  it('resets form after successful submission', async () => {
    mockOnSubmit.mockResolvedValue(undefined);

    render(<AddItemForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const nameInput = screen.getByLabelText(/Item Name/) as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: 'Milk' } });

    fireEvent.click(screen.getByRole('button', { name: /Add Item/i }));

    await waitFor(() => {
      expect(nameInput.value).toBe('');
    });
  });

  it('displays error message from submission failure', async () => {
    mockOnSubmit.mockRejectedValue(new Error('Network error'));

    render(<AddItemForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const nameInput = screen.getByLabelText(/Item Name/);
    fireEvent.change(nameInput, { target: { value: 'Milk' } });

    fireEvent.click(screen.getByRole('button', { name: /Add Item/i }));

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('disables buttons while submitting', async () => {
    mockOnSubmit.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<AddItemForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const nameInput = screen.getByLabelText(/Item Name/);
    fireEvent.change(nameInput, { target: { value: 'Milk' } });

    const submitButton = screen.getByRole('button', { name: /Add Item/i });
    const cancelButton = screen.getByRole('button', { name: /Cancel/i });

    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
    expect(screen.getByText('Adding...')).toBeInTheDocument();

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<AddItemForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('enforces max length on name field', () => {
    render(<AddItemForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const nameInput = screen.getByLabelText(/Item Name/) as HTMLInputElement;
    expect(nameInput.maxLength).toBe(100);
  });

  it('enforces max length on notes field', () => {
    render(<AddItemForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const notesInput = screen.getByLabelText(/Notes/) as HTMLTextAreaElement;
    expect(notesInput.maxLength).toBe(500);
  });
});

