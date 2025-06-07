import { describe, it, expect } from 'vitest';

describe('Sales Trends Endpoint', () => {
  it('should return a 200 status and the expected sales trends data for a valid period', async () => {
    const response = await fetch('http://localhost:3000/api/analytics/sales-trends?period=7d');
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('data');
    expect(data).toHaveProperty('period', '7d');
  });
}); 