import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { ApiError, contractsApi } from '../api/client';
import {
  type ContractsInfiniteData,
  flattenContracts,
  lastNextCursor,
  prependContract,
  removeContract,
  replaceContract,
} from '../api/contracts-cache';
import { queryKeys } from '../api/query-keys';
import type {
  Contract,
  ContractListResponse,
  UpdateContractInput,
} from '../api/types';
import { isUnauthorized } from '../lib/api-error';
import { HTTP_CONFLICT } from '../lib/http';

interface UseContractsOptions {
  enabled: boolean;
  onError: (err: unknown) => void;
  onMessage: (message: string) => void;
}

export interface UseContractsResult {
  busy: boolean;
  clearError: () => void;
  contracts: Contract[];
  create: (principalCents: number) => void;
  createBusy: boolean;
  editing: Contract | null;
  error: Error | null;
  loading: boolean;
  loadMore: () => void;
  nextCursor: string | null;
  refresh: () => void;
  remove: (contract: Contract) => void;
  setEditing: Dispatch<SetStateAction<Contract | null>>;
  update: (input: UpdateContractInput) => Promise<Contract>;
  updateBusy: boolean;
}

export function useContracts({
  enabled,
  onError,
  onMessage,
}: UseContractsOptions): UseContractsResult {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Contract | null>(null);

  const listQuery = useInfiniteQuery<
    ContractListResponse,
    Error,
    ContractsInfiniteData,
    typeof queryKeys.contracts,
    string | undefined
  >({
    enabled,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined,
    queryFn: ({ pageParam }) =>
      contractsApi.list({
        cursor: pageParam,
        limit: 20,
      }),
    queryKey: queryKeys.contracts,
  });

  const contracts = useMemo(
    () => flattenContracts(listQuery.data),
    [listQuery.data],
  );
  const nextCursor = lastNextCursor(listQuery.data, listQuery.hasNextPage);

  const createMutation = useMutation({
    mutationFn: (principalCents: number) => contractsApi.create(principalCents),
    onError,
    onSuccess: (created) => {
      queryClient.setQueryData<ContractsInfiniteData>(
        queryKeys.contracts,
        (old) => prependContract(old, created),
      );
      onMessage('Contract created');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      expectedUpdatedAt,
      id,
      principalCents,
    }: UpdateContractInput) =>
      contractsApi.update(id, principalCents, expectedUpdatedAt),
    onError: (err) => {
      if (err instanceof ApiError && err.status === HTTP_CONFLICT) {
        setEditing(null);
        onMessage('Stale update (409) — refreshed list');
        queryClient
          .invalidateQueries({ queryKey: queryKeys.contracts })
          .catch(() => undefined);
        return;
      }
      onError(err);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<ContractsInfiniteData>(
        queryKeys.contracts,
        (old) => replaceContract(old, updated),
      );
      setEditing(null);
      onMessage('Contract updated');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => contractsApi.remove(id),
    onError,
    onSuccess: (_result, id) => {
      queryClient.setQueryData<ContractsInfiniteData>(
        queryKeys.contracts,
        (old) => removeContract(old, id),
      );
      onMessage('Contract deleted');
    },
  });

  let listError: Error | null = null;
  if (listQuery.isError && !isUnauthorized(listQuery.error)) {
    listError = listQuery.error;
  }

  return {
    busy:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending ||
      listQuery.isFetching,
    clearError: (): void => {
      queryClient
        .resetQueries({ queryKey: queryKeys.contracts })
        .catch(() => undefined);
    },
    contracts,
    create: (principalCents: number): void => {
      createMutation.mutate(principalCents);
    },
    createBusy: createMutation.isPending,
    editing,
    error: listError,
    loading:
      listQuery.isPending || (listQuery.isFetching && contracts.length === 0),
    loadMore: (): void => {
      listQuery.fetchNextPage().catch(() => undefined);
    },
    nextCursor,
    refresh: (): void => {
      listQuery.refetch().catch(() => undefined);
    },
    remove: (contract: Contract): void => {
      if (!window.confirm('Delete this contract?')) {
        return;
      }
      deleteMutation.mutate(contract.id);
    },
    setEditing,
    update: (input: UpdateContractInput): Promise<Contract> =>
      updateMutation.mutateAsync(input),
    updateBusy: updateMutation.isPending,
  };
}
