import { describe, it, expect } from 'vitest';

describe('Order Simulation Endpoint', () => {
  it('should return a 201 status and the expected order simulation response for valid data', async () => {
    const response = await fetch('http://localhost:3000/api/orders/simulate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: 1,
        quantity: 2,
        total_amount: 399.98,
      }),
    });
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('status');
    expect(data).toHaveProperty('order_date');
  });
}); 