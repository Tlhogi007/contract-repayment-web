import type { InfiniteData } from '@tanstack/react-query';
import type { Contract, ContractListResponse } from './types';

export type ContractsInfiniteData = InfiniteData<
  ContractListResponse,
  string | undefined
>;

export function prependContract(
  old: ContractsInfiniteData | undefined,
  created: Contract,
): ContractsInfiniteData {
  if (!old?.pages.length) {
    return {
      pages: [{ data: [created], nextCursor: null }],
      pageParams: [undefined],
    };
  }
  const [first, ...rest] = old.pages;
  return {
    ...old,
    pages: [{ ...first, data: [created, ...first.data] }, ...rest],
  };
}

export function replaceContract(
  old: ContractsInfiniteData | undefined,
  updated: Contract,
): ContractsInfiniteData | undefined {
  if (!old) {
    return old;
  }
  return {
    ...old,
    pages: old.pages.map((page) => ({
      ...page,
      data: page.data.map((contract) =>
        contract.id === updated.id ? updated : contract,
      ),
    })),
  };
}

export function removeContract(
  old: ContractsInfiniteData | undefined,
  id: string,
): ContractsInfiniteData | undefined {
  if (!old) {
    return old;
  }
  return {
    ...old,
    pages: old.pages.map((page) => ({
      ...page,
      data: page.data.filter((contract) => contract.id !== id),
    })),
  };
}

export function flattenContracts(
  data: ContractsInfiniteData | undefined,
): Contract[] {
  return data?.pages.flatMap((page) => page.data) ?? [];
}

export function lastNextCursor(
  data: ContractsInfiniteData | undefined,
  hasNextPage: boolean,
): string | null {
  if (!hasNextPage) {
    return null;
  }
  return data?.pages.at(-1)?.nextCursor ?? null;
}
