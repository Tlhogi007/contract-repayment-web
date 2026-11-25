import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import {
  authApi,
  clearSession,
  getStoredEmail,
  getStoredToken,
  setSession,
} from '../api/client';
import { queryKeys } from '../api/query-keys';
import type { AuthResponse } from '../api/types';
import { isUnauthorized } from '../lib/api-error';

interface UseSessionOptions {
  onError: (err: unknown) => void;
  onMessage: (message: string) => void;
}

interface SignInInput {
  email: string;
  mode: 'login' | 'register';
  password: string;
}

export interface UseSessionResult {
  authBusy: boolean;
  booting: boolean;
  clearError: () => void;
  email: string | null;
  error: Error | null;
  handleApiError: (err: unknown) => void;
  hasToken: boolean;
  notice: string | null;
  signIn: (input: SignInInput) => Promise<AuthResponse>;
  signOut: (message?: string) => void;
}

export function useSession({
  onError,
  onMessage,
}: UseSessionOptions): UseSessionResult {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState<string | null>(getStoredEmail());
  const [hasToken, setHasToken] = useState(Boolean(getStoredToken()));

  const signOut = useCallback(
    (message = 'Signed out'): void => {
      clearSession();
      setHasToken(false);
      setEmail(null);
      queryClient.clear();
      onMessage(message);
    },
    [onMessage, queryClient],
  );

  const handleApiError = useCallback(
    (err: unknown): void => {
      if (isUnauthorized(err)) {
        signOut('Session expired — sign in again');
        return;
      }
      onError(err);
    },
    [onError, signOut],
  );

  const meQuery = useQuery({
    enabled: hasToken,
    queryFn: async () => {
      try {
        return await authApi.me();
      } catch (err) {
        if (isUnauthorized(err)) {
          clearSession();
        }
        throw err;
      }
    },
    queryKey: queryKeys.me,
  });

  // Adjust session when /auth/me says the token is dead (React render-time sync).
  if (hasToken && isUnauthorized(meQuery.error)) {
    setHasToken(false);
    setEmail(null);
    queryClient.clear();
  }

  const authMutation = useMutation({
    mutationFn: ({ email: nextEmail, mode, password }: SignInInput) =>
      mode === 'login'
        ? authApi.login(nextEmail, password)
        : authApi.register(nextEmail, password),
    // Login/register 401 is bad credentials — not an expired session.
    onError,
    onSuccess: async (res, variables) => {
      setSession(res.accessToken, res.user.email);
      setHasToken(true);
      setEmail(res.user.email);
      onMessage(variables.mode === 'login' ? 'Signed in' : 'Account created');
      await queryClient.invalidateQueries({ queryKey: queryKeys.me });
      await queryClient.invalidateQueries({ queryKey: queryKeys.contracts });
    },
  });

  let meError: Error | null = null;
  if (meQuery.isError && !isUnauthorized(meQuery.error)) {
    meError = meQuery.error;
  }

  return {
    authBusy: authMutation.isPending,
    booting: hasToken && meQuery.isPending,
    clearError: (): void => {
      queryClient
        .resetQueries({ queryKey: queryKeys.me })
        .catch(() => undefined);
    },
    email: meQuery.data?.email ?? email,
    error: meError,
    handleApiError,
    hasToken,
    notice: isUnauthorized(meQuery.error)
      ? 'Session expired — sign in again'
      : null,
    signIn: (input: SignInInput): Promise<AuthResponse> =>
      authMutation.mutateAsync(input),
    signOut,
  };
}
