import { describe, expect, it } from 'vitest';
import {
  type ContractsInfiniteData,
  flattenContracts,
  lastNextCursor,
  prependContract,
  removeContract,
  replaceContract,
} from '../src/api/contracts-cache';
import type { Contract } from '../src/api/types';

function contract(id: string, principalCents = 100_000): Contract {
  return {
    id,
    principalCents,
    annualRate: 0.065,
    options: [],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  };
}

describe('contracts-cache', () => {
  it('prepends onto an empty cache', () => {
    const created = contract('a');
    const next = prependContract(undefined, created);
    expect(flattenContracts(next)).toEqual([created]);
  });

  it('prepends onto the first page', () => {
    const existing = contract('b');
    const created = contract('a');
    const old: ContractsInfiniteData = {
      pages: [{ data: [existing], nextCursor: null }],
      pageParams: [undefined],
    };
    expect(flattenContracts(prependContract(old, created))).toEqual([
      created,
      existing,
    ]);
  });

  it('replaces a contract by id', () => {
    const old: ContractsInfiniteData = {
      pages: [{ data: [contract('a', 100_000)], nextCursor: null }],
      pageParams: [undefined],
    };
    const updated = contract('a', 200_000);
    expect(flattenContracts(replaceContract(old, updated))).toEqual([updated]);
  });

  it('leaves unrelated contracts alone when replacing', () => {
    const keep = contract('keep', 100_000);
    const old: ContractsInfiniteData = {
      pages: [{ data: [keep, contract('a', 100_000)], nextCursor: null }],
      pageParams: [undefined],
    };
    const updated = contract('a', 200_000);
    expect(flattenContracts(replaceContract(old, updated))).toEqual([
      keep,
      updated,
    ]);
  });

  it('no-ops replace/remove when cache is empty', () => {
    expect(replaceContract(undefined, contract('a'))).toBeUndefined();
    expect(removeContract(undefined, 'a')).toBeUndefined();
  });

  it('removes a contract by id', () => {
    const keep = contract('keep');
    const old: ContractsInfiniteData = {
      pages: [{ data: [keep, contract('gone')], nextCursor: null }],
      pageParams: [undefined],
    };
    expect(flattenContracts(removeContract(old, 'gone'))).toEqual([keep]);
  });

  it('returns next cursor only while hasNextPage is true', () => {
    const data: ContractsInfiniteData = {
      pages: [{ data: [], nextCursor: 'cursor-2' }],
      pageParams: [undefined],
    };
    expect(lastNextCursor(data, true)).toBe('cursor-2');
    expect(lastNextCursor(data, false)).toBeNull();
    expect(lastNextCursor(undefined, true)).toBeNull();
    expect(flattenContracts(undefined)).toEqual([]);
  });
});
