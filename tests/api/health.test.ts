import { describe, it, expect } from 'vitest';

describe('Health Check Endpoint', () => {
  it('should return a 200 status and a healthy response', async () => {
    const response = await fetch('http://localhost:3000/api/health');
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ status: 'healthy' });
  });
}); 