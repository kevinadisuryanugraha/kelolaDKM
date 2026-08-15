import { describe, it, expect } from 'vitest';
import { generateMidtransOrderId } from '../components/common/MidtransButton';

describe('Midtrans Order ID', () => {
  it('generates order ID with correct format', () => {
    const id = generateMidtransOrderId();
    expect(id).toMatch(/^DON-\d{8}-\d{4}$/);
  });

  it('generates unique order IDs', () => {
    const ids = new Set(Array.from({ length: 50 }, () => generateMidtransOrderId()));
    expect(ids.size).toBe(50);
  });
});
