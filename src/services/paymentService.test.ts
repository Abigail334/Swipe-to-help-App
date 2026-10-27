import { describe, it, expect, vi } from 'vitest';
import { paymentService } from './paymentService';

describe('paymentService', () => {
  it('should process payment successfully and return payment intent', async () => {
    // Mock fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    const result = await paymentService.processPayment({
      billId: 'bill_123',
      amount: 50,
      paymentType: 'part',
      billerName: 'City Power & Light',
      recipientFirstName: 'Sarah',
      donorName: 'Test Donor',
      message: 'Keep going!',
    });

    expect(result).toBeDefined();
    expect(result.amount).toBe(50);
    expect(result.status).toBe('succeeded');
    expect(result.billerName).toBe('City Power & Light');
  });

  it('should throw error when payment API fails', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
    });

    await expect(
      paymentService.processPayment({
        billId: 'bill_123',
        amount: 50,
        paymentType: 'part',
        billerName: 'City Power & Light',
        recipientFirstName: 'Sarah',
      })
    ).rejects.toThrow('Payment processing failed');
  });
});
