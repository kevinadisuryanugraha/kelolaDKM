import { describe, it, expect } from 'vitest';
import { snakeToCamel } from '../lib/utils';

describe('snakeToCamel', () => {
  it('converts snake_case keys to camelCase', () => {
    const out = snakeToCamel({
      ref_number: 'INV/20260724/001',
      account_code: '101.1',
      is_published: true,
    });
    expect(out).toEqual({
      refNumber: 'INV/20260724/001',
      accountCode: '101.1',
      isPublished: true,
    });
  });

  it('converts arrays of objects', () => {
    const out = snakeToCamel([{ qr_code: 'QR-1' }, { qr_code: 'QR-2' }]);
    expect(out).toEqual([{ qrCode: 'QR-1' }, { qrCode: 'QR-2' }]);
  });

  it('converts nested objects', () => {
    const out = snakeToCamel({
      user: { full_name: 'H. Zamzami' },
      meta: { current_page: 1 },
    });
    expect(out).toEqual({
      user: { fullName: 'H. Zamzami' },
      meta: { currentPage: 1 },
    });
  });

  it('leaves primitives and already-camelCase keys intact', () => {
    expect(snakeToCamel(42)).toBe(42);
    expect(snakeToCamel('text')).toBe('text');
    expect(snakeToCamel({ alreadyCamel: 1 })).toEqual({ alreadyCamel: 1 });
  });
});
