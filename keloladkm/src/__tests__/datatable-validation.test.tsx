import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DataTable, DataTableColumn } from '../components/common/DataTable';

interface TestRow {
  id: string;
  name: string;
  amount: number;
}

const columns: DataTableColumn<TestRow>[] = [
  { key: 'id', header: 'ID', className: 'font-mono' },
  { key: 'name', header: 'Nama' },
  {
    key: 'amount',
    header: 'Jumlah',
    render: (row) => `Rp ${row.amount.toLocaleString('id-ID')}`,
  },
];

const sampleData: TestRow[] = [
  { id: '001', name: 'Ahmad', amount: 500000 },
  { id: '002', name: 'Budi', amount: 1200000 },
  { id: '003', name: 'Citra', amount: 850000 },
  { id: '004', name: 'Dewi', amount: 2000000 },
  { id: '005', name: 'Eko', amount: 350000 },
  { id: '006', name: 'Fajar', amount: 1500000 },
];

describe('DataTable', () => {
  it('renders all rows', () => {
    render(<DataTable columns={columns} data={sampleData} keyField="id" />);
    expect(screen.getByText('Ahmad')).toBeDefined();
    expect(screen.getByText('Budi')).toBeDefined();
    expect(screen.getByText('Citra')).toBeDefined();
  });

  it('renders column headers', () => {
    render(<DataTable columns={columns} data={sampleData} keyField="id" />);
    expect(screen.getByText('ID')).toBeDefined();
    expect(screen.getByText('Nama')).toBeDefined();
    expect(screen.getByText('Jumlah')).toBeDefined();
  });

  it('renders formatted amount via render function', () => {
    render(<DataTable columns={columns} data={sampleData} keyField="id" />);
    expect(screen.getByText('Rp 500.000')).toBeDefined();
    expect(screen.getByText('Rp 1.200.000')).toBeDefined();
  });

  it('shows empty message when no data', () => {
    render(<DataTable columns={columns} data={[]} keyField="id" emptyMessage="Kosong" />);
    expect(screen.getByText('Kosong')).toBeDefined();
  });

  it('paginates data (default 5 per page)', () => {
    render(<DataTable columns={columns} data={sampleData} keyField="id" />);
    // With 6 items, page 1 shows 5, page 2 shows 1
    expect(screen.getByText('Ahmad')).toBeDefined();
    expect(screen.getByText('Eko')).toBeDefined();
    // Fajar should be on page 2
    expect(screen.queryByText('Fajar')).toBeNull();
  });
});

// ── Form validation helpers ──

function validateEmail(email: string): string | null {
  if (!email) return 'Email wajib diisi';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Format email tidak valid';
  return null;
}

function validateAmount(amount: number | string): string | null {
  const num = Number(amount);
  if (isNaN(num)) return 'Jumlah harus berupa angka';
  if (num < 1000) return 'Minimal donasi Rp 1.000';
  if (num > 1_000_000_000) return 'Maksimal Rp 1.000.000.000';
  return null;
}

function validateRequired(value: string, field: string): string | null {
  if (!value || !value.trim()) return `${field} wajib diisi`;
  return null;
}

describe('Form Validation', () => {
  describe('validateEmail', () => {
    it('accepts valid email', () => expect(validateEmail('test@example.com')).toBeNull());
    it('rejects empty email', () => expect(validateEmail('')).toBe('Email wajib diisi'));
    it('rejects invalid format', () => expect(validateEmail('notanemail')).toBe('Format email tidak valid'));
    it('rejects missing @', () => expect(validateEmail('testexample.com')).toBe('Format email tidak valid'));
  });

  describe('validateAmount', () => {
    it('accepts valid amount', () => expect(validateAmount(50000)).toBeNull());
    it('rejects below minimum', () => expect(validateAmount(500)).toBe('Minimal donasi Rp 1.000'));
    it('rejects negative', () => expect(validateAmount(-1000)).toBe('Minimal donasi Rp 1.000'));
    it('rejects NaN', () => expect(validateAmount('abc')).toBe('Jumlah harus berupa angka'));
    it('accepts exactly 1000', () => expect(validateAmount(1000)).toBeNull());
    it('rejects above maximum', () => expect(validateAmount(2_000_000_000)).toBe('Maksimal Rp 1.000.000.000'));
  });

  describe('validateRequired', () => {
    it('accepts non-empty value', () => expect(validateRequired('Hello', 'Nama')).toBeNull());
    it('rejects empty string', () => expect(validateRequired('', 'Nama')).toBe('Nama wajib diisi'));
    it('rejects whitespace only', () => expect(validateRequired('   ', 'Nama')).toBe('Nama wajib diisi'));
  });
});
