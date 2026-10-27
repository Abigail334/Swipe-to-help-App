/**
 * Payment Service Module
 * Structured for mock payments now, with hooks and adapter pattern for Stripe Connect integration.
 */

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  billerName: string;
  recipientFirstName: string;
  status: 'succeeded' | 'pending' | 'failed';
  timestamp: string;
}

export const paymentService = {
  /**
   * Process a direct bill payment. In production, this interfaces with Stripe Connect
   * to route funds directly to the verified biller account.
   */
  async processPayment(params: {
    billId: string;
    amount: number;
    paymentType: 'full' | 'part';
    billerName: string;
    recipientFirstName: string;
    donorName?: string;
    message?: string;
  }): Promise<PaymentIntent> {
    // Simulate network latency for payment gateway
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Call backend API to record the payment and update bill funding
    const res = await fetch(`/api/bills/${params.billId}/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: params.amount,
        donorName: params.donorName || 'Anonymous Donor',
        message: params.message,
      }),
    });

    if (!res.ok) {
      throw new Error('Payment processing failed');
    }

    const data = await res.json();

    return {
      id: `pi_${Math.random().toString(36).substring(2, 9)}`,
      amount: params.amount,
      currency: 'USD',
      billerName: params.billerName,
      recipientFirstName: params.recipientFirstName,
      status: 'succeeded',
      timestamp: new Date().toISOString(),
    };
  },
};
