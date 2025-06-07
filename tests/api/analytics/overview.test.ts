import { describe, it, expect } from 'vitest';

describe('Analytics Overview Endpoint', () => {
  it('should return a 200 status and the expected metrics for a valid period', async () => {
    const response = await fetch('http://localhost:3000/api/analytics/overview?period=7d');
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('total_revenue');
    expect(data).toHaveProperty('total_orders');
    expect(data).toHaveProperty('average_order_value');
    expect(data).toHaveProperty('period', '7d');
  });
}); 