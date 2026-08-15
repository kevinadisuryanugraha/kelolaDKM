import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Recursively convert snake_case object keys to camelCase.
 * The Laravel API returns snake_case while the frontend types use camelCase.
 */
export function snakeToCamel<T = unknown>(value: T): any {
  if (Array.isArray(value)) return value.map((v) => snakeToCamel(v));
  if (value !== null && typeof value === 'object' && !(value instanceof Date)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      const key = k.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase());
      out[key] = snakeToCamel(v);
    }
    return out;
  }
  return value;
}

/**
 * Recursively convert camelCase object keys to snake_case.
 * Used when sending payloads to the Laravel API (which expects snake_case).
 */
export function camelToSnake(value: unknown): any {
  if (Array.isArray(value)) return value.map(camelToSnake);
  if (value !== null && typeof value === 'object' && !(value instanceof Date)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      const key = k.replace(/([A-Z])/g, (m) => `_${m.toLowerCase()}`);
      out[key] = camelToSnake(v);
    }
    return out;
  }
  return value;
}
