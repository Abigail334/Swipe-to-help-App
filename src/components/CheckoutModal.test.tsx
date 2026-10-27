import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { CheckoutModal } from './CheckoutModal';
import { describe, it, vi, expect } from 'vitest';

describe('CheckoutModal Component', () => {
  const mockBill = {
    id: 'bill_1',
    firstName: 'Sarah',
    billerName: 'Metro Health Clinic',
    amount: 100,
    raised: 25,
    category: 'medical' as const,
  };

  it('renders checkout options and remaining balance correctly', () => {
    render(<CheckoutModal bill={mockBill} onClose={vi.fn()} onSuccess={vi.fn()} />);
    
    expect(screen.getByText('Secure Direct Bill Pay')).toBeInTheDocument();
    expect(screen.getByText('Pay Full Balance')).toBeInTheDocument();
    expect(screen.getByText('Pay Part')).toBeInTheDocument();
  });
});
