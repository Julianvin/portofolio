import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import DynamicIcon from '../components/DynamicIcon';

describe('DynamicIcon', () => {
  it('renders a known icon (FiBox fallback for Fi family) successfully', async () => {
    render(<DynamicIcon iconIdentifier="FiGithub" size={24} />);

    // Should show loading first, then resolve
    await waitFor(
      () => {
        expect(screen.getByTestId('icon-resolved')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });

  it('renders fallback for an unknown icon identifier', async () => {
    render(<DynamicIcon iconIdentifier="XxNonExistentIcon" size={24} />);

    await waitFor(
      () => {
        expect(screen.getByTestId('icon-fallback')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });

  it('renders fallback when iconIdentifier is empty string', () => {
    render(<DynamicIcon iconIdentifier="" size={24} />);
    expect(screen.getByTestId('icon-fallback')).toBeInTheDocument();
  });

  it('renders fallback when iconIdentifier is null', () => {
    render(<DynamicIcon iconIdentifier={null} size={24} />);
    expect(screen.getByTestId('icon-fallback')).toBeInTheDocument();
  });

  it('renders fallback when iconIdentifier is undefined', () => {
    render(<DynamicIcon size={24} />);
    expect(screen.getByTestId('icon-fallback')).toBeInTheDocument();
  });

  it('applies custom className to the resolved icon', async () => {
    render(<DynamicIcon iconIdentifier="FiGithub" className="text-red-500" size={20} />);

    await waitFor(
      () => {
        const icon = screen.getByTestId('icon-resolved');
        expect(icon).toHaveClass('text-red-500');
      },
      { timeout: 5000 }
    );
  });

  it('renders fallback for identifier with unknown prefix', async () => {
    render(<DynamicIcon iconIdentifier="ZzUnknown" size={24} />);

    await waitFor(
      () => {
        expect(screen.getByTestId('icon-fallback')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });
});
