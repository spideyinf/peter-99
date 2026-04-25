import { useState } from 'react';
import type { SwapStatus } from 'types/SwapStatus';

interface SwapParams {
  fromAmount: string;
  fromSymbol: string;
  toSymbol: string;
}

interface MutateOptions {
  onSuccess?: () => void;
  onError?: () => void;
}

interface UseSwapResult {
  status: SwapStatus;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  mutate: (params: SwapParams, options?: MutateOptions) => void;
  reset: () => void;
}

export const useSwap = (): UseSwapResult => {
  const [status, setStatus] = useState<SwapStatus>('idle');

  const mutate = (_params: SwapParams, options?: MutateOptions) => {
    setStatus('swapping');
    new Promise<boolean>((resolve) =>
      setTimeout(() => resolve(Math.random() > 0.15), 2200)
    ).then((success) => {
      setStatus(success ? 'success' : 'error');
      if (success) options?.onSuccess?.();
      else options?.onError?.();
      setTimeout(() => setStatus('idle'), 4000);
    });
  };

  const reset = () => setStatus('idle');

  return {
    status,
    isPending: status === 'swapping',
    isSuccess: status === 'success',
    isError: status === 'error',
    mutate,
    reset,
  };
};
