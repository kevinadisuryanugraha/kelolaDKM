import { describe, it, expect, beforeEach } from 'vitest';
import { getPendingMutations, clearPendingMutations, flushPendingMutations } from '../api/dataService';

describe('offline mutation queue', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts empty', () => {
    expect(getPendingMutations()).toEqual([]);
  });

  it('reads queued mutations from localStorage', () => {
    localStorage.setItem(
      'dkm_pending_mutations',
      JSON.stringify([{ type: 'transaction', payload: { amount: 1 }, queuedAt: 1 }]),
    );
    const queue = getPendingMutations();
    expect(queue).toHaveLength(1);
    expect(queue[0].type).toBe('transaction');
  });

  it('clearPendingMutations removes the queue', () => {
    localStorage.setItem('dkm_pending_mutations', JSON.stringify([{ type: 'x', payload: {}, queuedAt: 1 }]));
    clearPendingMutations();
    expect(getPendingMutations()).toEqual([]);
  });

  it('flushPendingMutations with an empty queue resolves cleanly', async () => {
    await expect(flushPendingMutations()).resolves.toBeUndefined();
  });
});
