import { useState, useEffect, useRef } from 'react';
import type { PriceEntry } from 'types/PriceEntry';
import type { Token } from 'types/Token';
import { PRICES_URL } from 'components/currency-swap/utils';

interface UsePricesOptions {
  onSuccess?: (tokens: Token[]) => void;
}

interface UsePricesResult {
  tokens: Token[];
  isLoading: boolean;
  isError: boolean;
}

export const usePrices = (options?: UsePricesOptions): UsePricesResult => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const onSuccessRef = useRef(options?.onSuccess);
  onSuccessRef.current = options?.onSuccess;

  useEffect(() => {
    fetch(PRICES_URL)
      .then((response) => response.json())
      .then((data: PriceEntry[]) => {
        const map = new Map<string, number>();
        for (const entry of data) {
          if (entry.price > 0) map.set(entry.currency, entry.price);
        }
        const list: Token[] = Array.from(map.entries())
          .map(([symbol, price]) => ({ symbol, price }))
          .sort((a, b) => a.symbol.localeCompare(b.symbol));
        setTokens(list);
        onSuccessRef.current?.(list);
      })
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));
  }, []);

  return { tokens, isLoading, isError };
};
