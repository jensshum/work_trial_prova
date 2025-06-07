import { describe, it, expect } from 'vitest';

describe('Top Products Endpoint', () => {
  it('should return a 200 status and the expected top products data for valid parameters', async () => {
    const response = await fetch('http://localhost:3000/api/analytics/top-products?limit=10&period=7d');
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('products');
    expect(data).toHaveProperty('period', '7d');
  });
}); 