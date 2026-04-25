import { useState, useEffect } from 'react';
import { ExclamationCircleIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import { AmountPanel, Skeleton } from 'components/currency-swap';
import type { PriceEntry } from 'types/PriceEntry';
import type { Token } from 'types/Token';
import { PRICES_URL } from 'components/currency-swap/utils';

export default function App() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState('');

  useEffect(() => {
    fetch(PRICES_URL)
      .then((r) => r.json())
      .then((data: PriceEntry[]) => {
        const map = new Map<string, number>();
        for (const entry of data) {
          if (entry.price > 0) map.set(entry.currency, entry.price);
        }
        const list: Token[] = Array.from(map.entries())
          .map(([symbol, price]) => ({ symbol, price }))
          .sort((a, b) => a.symbol.localeCompare(b.symbol));
        setTokens(list);
        setFromToken(list.find((t) => t.symbol === 'ETH') ?? list[0]);
        setToToken(list.find((t) => t.symbol === 'USDC') ?? list[1]);
      })
      .catch(() => setFetchError(true))
      .finally(() => setFetching(false));
  }, []);

  const handleFlip = () => {};

  const handleSubmit = () => {};

  return (
    <div className="w-full h-full max-w-md mx-auto my-20 px-2">
      <div className="rounded-3xl bg-gray-800 border border-gray-600/40 shadow-2xl shadow-black/30">
        <div className="px-6 pt-6 pb-4">
          <h5 className="text-white text-xl font-bold tracking-tight">
            Currency Swap
          </h5>
          <p className="text-gray-400 text-xs mt-0.5">
            Powered by 99 Technology
          </p>
        </div>

        <div className="h-px bg-gray-600/40 mx-6" />

        <div className="px-6 pb-6 pt-5">
          {fetching && (
            <div className="space-y-3">
              <Skeleton className="h-28" />
              <div className="flex justify-center">
                <Skeleton className="h-9 w-9 rounded-xl" />
              </div>
              <Skeleton className="h-28" />
              <Skeleton className="h-12 mt-2" />
            </div>
          )}

          {!fetching && fetchError && (
            <div className="rounded-2xl bg-red-500/8 border border-red-500/25 p-8 text-center">
              <ExclamationCircleIcon className="w-10 h-10 text-red-400 mx-auto mb-3" />
              <p className="text-red-300 font-semibold mb-1">
                Failed to load prices
              </p>
              <p className="text-gray-500 text-sm">
                Check your connection and refresh
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 text-sm font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {!fetching && !fetchError && (
            <form onSubmit={handleSubmit} noValidate>
              <AmountPanel
                label="Amount to send"
                amount={fromAmount}
                token={fromToken}
                tokens={tokens}
                onAmountChange={setFromAmount}
                onTokenChange={setFromToken}
                excludeToken={toToken?.symbol}
              />

              <div className="flex items-center justify-center my-2.5 relative z-10">
                <button
                  type="button"
                  onClick={handleFlip}
                  className="group p-2.5 rounded-xl bg-gray-700 hover:bg-purple-600/80 border border-gray-500/60 hover:border-purple-500/50 text-gray-300 hover:text-white transition-all duration-200 hover:scale-110 active:scale-95 shadow-md"
                  title="Flip tokens"
                >
                  <ArrowsUpDownIcon className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                </button>
              </div>

              <AmountPanel
                label="Amount to receive"
                amount=""
                token={toToken}
                tokens={tokens}
                onTokenChange={setToToken}
                excludeToken={fromToken?.symbol}
                readOnly
              />

              <button
                type="submit"
                disabled={!fromAmount}
                className="mt-4 w-full py-4 rounded-2xl font-bold text-sm tracking-widest uppercase transition-all duration-200
                  bg-purple-600 hover:bg-purple-500
                  active:scale-[0.98]
                  text-white
                  disabled:opacity-35 disabled:cursor-not-allowed disabled:active:scale-100
                  focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Confirm Swap
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
