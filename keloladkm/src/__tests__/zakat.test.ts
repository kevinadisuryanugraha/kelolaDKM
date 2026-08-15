import { describe, it, expect } from 'vitest';

// ── Zakat calculation helpers (extracted from ZakatCalculatorPage logic) ──

const RICE_KG = 2.5;
const NISAB_GOLD_GRAMS = 85;

function calcFitrah(peopleCount: number, ricePricePerKg: number): number {
  return peopleCount * (RICE_KG * ricePricePerKg);
}

function calcZakatMal(
  goldGrams: number,
  goldPrice: number,
  savings: number,
  tradeProfit: number
): { totalWealth: number; nisab: number; isNisabReached: boolean; zakat: number } {
  const nisab = NISAB_GOLD_GRAMS * goldPrice;
  const total = (goldGrams * goldPrice) + savings + tradeProfit;
  return {
    totalWealth: total,
    nisab,
    isNisabReached: total >= nisab,
    zakat: total >= nisab ? total * 0.025 : 0,
  };
}

function calcFidyah(days: number, ratePerDay: number): number {
  return days * ratePerDay;
}

// ── Tests ──

describe('Zakat Fitrah', () => {
  it('4 orang, beras Rp 15.000/kg → Rp 150.000', () => {
    expect(calcFitrah(4, 15000)).toBe(150000);
  });

  it('1 orang, beras Rp 18.000/kg → Rp 45.000', () => {
    expect(calcFitrah(1, 18000)).toBe(45000);
  });

  it('0 orang → Rp 0', () => {
    expect(calcFitrah(0, 15000)).toBe(0);
  });
});

describe('Zakat Mal', () => {
  it('Harta di bawah nisab → tidak wajib zakat', () => {
    const goldPrice = 1_350_000; // Rp 1.35jt/gram
    const result = calcZakatMal(0, goldPrice, 50_000_000, 0);
    expect(result.isNisabReached).toBe(false);
    expect(result.zakat).toBe(0);
    expect(result.nisab).toBe(85 * goldPrice); // Rp 114.750.000
  });

  it('Harta di atas nisab → zakat 2.5%', () => {
    const goldPrice = 1_350_000;
    // 10g gold + 120jt savings = 133.5jt > nisab 114.75jt
    const result = calcZakatMal(10, goldPrice, 120_000_000, 0);
    expect(result.isNisabReached).toBe(true);
    expect(result.zakat).toBe((10 * goldPrice + 120_000_000) * 0.025);
  });

  it('Persis di nisab → wajib zakat (>=)', () => {
    const goldPrice = 1_350_000;
    const exactlyNisab = 85 * goldPrice;
    const result = calcZakatMal(0, goldPrice, exactlyNisab, 0);
    expect(result.isNisabReached).toBe(true);
    expect(result.zakat).toBe(exactlyNisab * 0.025);
  });
});

describe('Fidyah', () => {
  it('7 hari × Rp 45.000 → Rp 315.000', () => {
    expect(calcFidyah(7, 45000)).toBe(315000);
  });

  it('30 hari × Rp 40.000 → Rp 1.200.000', () => {
    expect(calcFidyah(30, 40000)).toBe(1200000);
  });
});
