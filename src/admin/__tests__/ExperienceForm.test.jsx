import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ExperienceForm from '../pages/ExperienceForm';
import * as experienceService from '../services/experienceService';

// Mock the router
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({}), // Empty params means 'new' form mode
  };
});

// Mock the service
vi.mock('../services/experienceService', () => ({
  createExperience: vi.fn(),
  updateExperience: vi.fn(),
  fetchExperienceById: vi.fn(),
}));

describe('ExperienceForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderForm = () => {
    return render(
      <BrowserRouter>
        <ExperienceForm />
      </BrowserRouter>
    );
  };

  it('renders standard form elements correctly', () => {
    renderForm();
    expect(screen.getByText('New Experience')).toBeInTheDocument();
    expect(screen.getByLabelText(/Role/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Company Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Start Date/)).toBeInTheDocument();
    expect(screen.getByLabelText(/End Date/)).toBeInTheDocument();
    expect(screen.getByText(/Save Experience/i)).toBeInTheDocument();
  });

  it('validates required fields on submit (Role, Company, Start Date)', async () => {
    renderForm();
    const saveButton = screen.getByText(/Save Experience/i);

    // Provide missing values
    // Don't fill anything and try to submit
    fireEvent.click(saveButton);

    // Service should not be called because HTML5 required attributes block it initially,
    // but React Testing Library might bypass native form validation without a specialized user-event setup.
    // If it triggers native validation, our manual catch block handles missing role/company if bypassed.
    
    // We fill company and start date but leave Role empty to trigger custom error or native
    fireEvent.change(screen.getByLabelText(/Company Name/), { target: { value: 'Google' } });
    fireEvent.change(screen.getByLabelText(/Start Date/), { target: { value: '2023-01-01' } });
    
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(experienceService.createExperience).not.toHaveBeenCalled();
    });
  });

  it('adds and removes dynamic responsibilities correctly', async () => {
    renderForm();

    const addButton = screen.getByText(/Add Item/i);
    
    // Initial state: 0 items
    expect(screen.queryByPlaceholderText('Responsibility #1')).not.toBeInTheDocument();

    // Add first item
    fireEvent.click(addButton);
    expect(screen.getByPlaceholderText('Responsibility #1')).toBeInTheDocument();

    // Add second item
    fireEvent.click(addButton);
    expect(screen.getByPlaceholderText('Responsibility #2')).toBeInTheDocument();

    // Type into first item
    const input1 = screen.getByPlaceholderText('Responsibility #1');
    fireEvent.change(input1, { target: { value: 'Developed new features' } });
    expect(input1.value).toBe('Developed new features');

    // Remove first item
    const removeButtons = screen.getAllByTitle('Remove item');
    expect(removeButtons).toHaveLength(2);
    fireEvent.click(removeButtons[0]);

    // First item is removed, the old second item becomes the new first item.
    // So "Responsibility #2" placeholder goes away, only "#1" remains but empty.
    expect(screen.getByPlaceholderText('Responsibility #1')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Responsibility #2')).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText('Responsibility #1').value).toBe('');
  });

  it('handles "Currently working here" checkbox carefully', async () => {
    renderForm();
    const endDateInput = screen.getByLabelText(/End Date/);
    const checkbox = screen.getByLabelText(/Currently working here/i);

    expect(endDateInput).not.toBeDisabled();

    // Check it
    fireEvent.click(checkbox);
    expect(endDateInput).toBeDisabled();
    expect(endDateInput.value).toBe(''); // Should have been cleared

    // Uncheck it
    fireEvent.click(checkbox);
    expect(endDateInput).not.toBeDisabled();
  });

  it('submits correctly formatted payload handling empty responsibilities to supabase', async () => {
    renderForm();

    // Fill valid data
    fireEvent.change(screen.getByLabelText(/Role/), { target: { value: 'Frontend Dev' } });
    fireEvent.change(screen.getByLabelText(/Company Name/), { target: { value: 'Vercel' } });
    fireEvent.change(screen.getByLabelText(/Start Date/), { target: { value: '2022-05-10' } });

    // Check "Currently working here"
    fireEvent.click(screen.getByLabelText(/Currently working here/i));

    // Add responsibilities
    fireEvent.click(screen.getByText(/Add Item/i));
    fireEvent.click(screen.getByText(/Add Item/i));
    fireEvent.click(screen.getByText(/Add Item/i));

    // Fill 1 valid, 1 with spaces, 1 empty
    const inputs = screen.getAllByRole('textbox').filter(i => i.placeholder?.startsWith('Responsibility'));
    fireEvent.change(inputs[0], { target: { value: '  Built cool stuff  ' } });
    fireEvent.change(inputs[1], { target: { value: '   ' } });
    // Keep inputs[2] empty

    const saveButton = screen.getByText(/Save Experience/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(experienceService.createExperience).toHaveBeenCalledWith({
        role: 'Frontend Dev',
        company_name: 'Vercel',
        start_date: '2022-05-10',
        end_date: null, // Due to present checkbox
        description: null,
        responsibilities: ['Built cool stuff'], // Empties are filtered, spaced are trimmed
      });
      expect(mockNavigate).toHaveBeenCalledWith('/admin/experiences');
    });
  });
});
