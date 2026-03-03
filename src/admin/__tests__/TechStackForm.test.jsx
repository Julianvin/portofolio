import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import TechStackForm from '../pages/TechStackForm';

// ── Mock the service layer ──
vi.mock('../services/techStackService', () => ({
  fetchTechStackById: vi.fn(),
  createTechStack: vi.fn(),
  updateTechStack: vi.fn(),
}));

// ── Mock useCachedFetch (imported by service via clearCache) ──
vi.mock('../../hooks/useCachedFetch', () => ({
  default: vi.fn(),
  clearCache: vi.fn(),
}));

import { fetchTechStackById, createTechStack, updateTechStack } from '../services/techStackService';

// Helper to render the form in a router context
function renderForm(route = '/admin/tech-stacks/new') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/admin/tech-stacks/new" element={<TechStackForm />} />
        <Route path="/admin/tech-stacks/:id/edit" element={<TechStackForm />} />
        <Route path="/admin/tech-stacks" element={<div data-testid="list-page">List</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('TechStackForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the create form with empty fields', () => {
    renderForm();

    expect(screen.getByText('New Tech Stack')).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toHaveValue('');
    expect(screen.getByLabelText(/icon identifier/i)).toHaveValue('');
  });

  it('shows validation error when name is empty on submit', async () => {
    const user = userEvent.setup();
    renderForm();

    const submitBtn = screen.getByRole('button', { name: /create/i });
    await user.click(submitBtn);

    expect(screen.getByText('Name is required.')).toBeInTheDocument();
    expect(createTechStack).not.toHaveBeenCalled();
  });

  it('shows validation error when icon identifier is empty on submit', async () => {
    const user = userEvent.setup();
    renderForm();

    const nameInput = screen.getByLabelText(/name/i);
    await user.type(nameInput, 'React');

    const submitBtn = screen.getByRole('button', { name: /create/i });
    await user.click(submitBtn);

    expect(screen.getByText('Icon identifier is required.')).toBeInTheDocument();
    expect(createTechStack).not.toHaveBeenCalled();
  });

  it('calls createTechStack with correct data on valid submit', async () => {
    createTechStack.mockResolvedValue({ id: '123', name: 'React', icon_identifier: 'FaReact' });

    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/name/i), 'React');
    await user.type(screen.getByLabelText(/icon identifier/i), 'FaReact');

    const submitBtn = screen.getByRole('button', { name: /create/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(createTechStack).toHaveBeenCalledWith({
        name: 'React',
        icon_identifier: 'FaReact',
      });
    });
  });

  it('displays error message when createTechStack fails', async () => {
    createTechStack.mockRejectedValue(new Error('DB connection failed'));

    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/name/i), 'React');
    await user.type(screen.getByLabelText(/icon identifier/i), 'FaReact');

    await user.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(screen.getByText('DB connection failed')).toBeInTheDocument();
    });
  });

  it('pre-populates fields in edit mode', async () => {
    fetchTechStackById.mockResolvedValue({
      id: 'abc-123',
      name: 'Tailwind CSS',
      icon_identifier: 'SiTailwindcss',
    });

    renderForm('/admin/tech-stacks/abc-123/edit');

    await waitFor(() => {
      expect(screen.getByText('Edit Tech Stack')).toBeInTheDocument();
      expect(screen.getByLabelText(/name/i)).toHaveValue('Tailwind CSS');
      expect(screen.getByLabelText(/icon identifier/i)).toHaveValue('SiTailwindcss');
    });

    expect(fetchTechStackById).toHaveBeenCalledWith('abc-123');
  });

  it('calls updateTechStack in edit mode on valid submit', async () => {
    fetchTechStackById.mockResolvedValue({
      id: 'abc-123',
      name: 'Tailwind CSS',
      icon_identifier: 'SiTailwindcss',
    });
    updateTechStack.mockResolvedValue({
      id: 'abc-123',
      name: 'Tailwind CSS v4',
      icon_identifier: 'SiTailwindcss',
    });

    const user = userEvent.setup();
    renderForm('/admin/tech-stacks/abc-123/edit');

    // Wait for form to load
    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toHaveValue('Tailwind CSS');
    });

    // Clear and retype
    const nameInput = screen.getByLabelText(/name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Tailwind CSS v4');

    await user.click(screen.getByRole('button', { name: /update/i }));

    await waitFor(() => {
      expect(updateTechStack).toHaveBeenCalledWith('abc-123', {
        name: 'Tailwind CSS v4',
        icon_identifier: 'SiTailwindcss',
      });
    });
  });
});
