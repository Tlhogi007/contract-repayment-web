import { describe, expect, it } from 'vitest';
import { centsToZar, zarToCents } from '../src/lib/money';

describe('zarToCents', () => {
  it('converts decimal ZAR to cents', () => {
    expect(zarToCents('1000.00')).toBe(100_000);
    expect(zarToCents(12.34)).toBe(1234);
  });

  it('rounds half-up', () => {
    expect(zarToCents('10.005')).toBe(1001);
  });

  it('rejects non-positive amounts', () => {
    expect(() => zarToCents(0)).toThrow('Principal must be a positive amount');
    expect(() => zarToCents(-1)).toThrow('Principal must be a positive amount');
    expect(() => zarToCents('nope')).toThrow(
      'Principal must be a positive amount',
    );
  });
});

describe('centsToZar', () => {
  it('formats cents as ZAR currency', () => {
    expect(centsToZar(100_000)).toMatch(/1[\s\u00a0]?000,00/);
  });
});
