import { useState, useMemo } from 'react';
import {
  ExclamationCircleIcon,
  ArrowPathIcon,
  ArrowsUpDownIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { AmountPanel, Skeleton, formatNumber } from 'components/currency-swap';
import type { Token } from 'types/Token';
import { usePrices } from 'hooks/use-prices';
import { useSwap } from 'hooks/use-swap';

export default function App() {
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState('');

  const {
    tokens,
    isLoading,
    isError: fetchError
  } = usePrices({
    onSuccess: (list) => {
      setFromToken(list.find((token) => token.symbol === 'ETH') ?? list[0]);
      setToToken(list.find((token) => token.symbol === 'USDC') ?? list[1]);
    }
  });

  const swap = useSwap();

  const toAmount = useMemo(() => {
    if (!fromToken || !toToken || !fromAmount) return '';
    const amount = parseFloat(fromAmount);
    if (isNaN(amount) || amount <= 0) return '';
    return String((amount * fromToken.price) / toToken.price);
  }, [fromAmount, fromToken, toToken]);

  const validationError = useMemo((): string | null => {
    if (!fromAmount) return null;
    if (!fromToken || !toToken) return 'Select both tokens';
    const amount = parseFloat(fromAmount);
    if (isNaN(amount) || amount <= 0) return 'Invalid amount';
    if (fromToken.symbol === toToken.symbol)
      return 'Cannot swap the same token';
    return null;
  }, [fromAmount, fromToken, toToken]);

  const handleFlip = () => {
    const capturedTo = toAmount;
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(capturedTo);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validationError || !fromAmount || !fromToken || !toToken) return;
    swap.mutate(
      { fromAmount, fromSymbol: fromToken.symbol, toSymbol: toToken.symbol },
      { onSuccess: () => setFromAmount('') }
    );
  };

  const exchangeRate =
    fromToken && toToken ? fromToken.price / toToken.price : null;

  const fromUsd =
    fromToken && fromAmount && parseFloat(fromAmount) > 0
      ? parseFloat(fromAmount) * fromToken.price
      : undefined;

  const toUsd =
    toToken && toAmount && parseFloat(toAmount) > 0
      ? parseFloat(toAmount) * toToken.price
      : undefined;

  const ctaLabel = swap.isPending
    ? null
    : validationError && fromAmount
      ? validationError
      : !fromAmount
        ? 'Enter an amount'
        : 'Confirm Swap';

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
          {isLoading && (
            <div className="space-y-3">
              <Skeleton className="h-28" />
              <div className="flex justify-center">
                <Skeleton className="h-9 w-9 rounded-xl" />
              </div>
              <Skeleton className="h-28" />
              <Skeleton className="h-12 mt-2" />
            </div>
          )}

          {!isLoading && fetchError && (
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

          {!isLoading && !fetchError && (
            <form onSubmit={handleSubmit} noValidate>
              {swap.isSuccess && (
                <div className="animate-fade-in mb-4 flex items-center gap-3 rounded-2xl bg-green-500/10 border border-green-500/25 px-4 py-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-400 shrink-0" />
                  <div>
                    <p className="text-green-300 text-sm font-semibold">
                      Conversion complete!
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      Your swap rate has been applied
                    </p>
                  </div>
                </div>
              )}

              {swap.isError && (
                <div className="animate-fade-in mb-4 flex items-center gap-3 rounded-2xl bg-red-500/10 border border-red-500/25 px-4 py-3">
                  <ExclamationCircleIcon className="w-5 h-5 text-red-400 shrink-0" />
                  <div>
                    <p className="text-red-300 text-sm font-semibold">
                      Conversion failed
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      Something went wrong — please try again
                    </p>
                  </div>
                </div>
              )}

              <AmountPanel
                label="Amount to send"
                amount={fromAmount}
                token={fromToken}
                tokens={tokens}
                onAmountChange={setFromAmount}
                onTokenChange={setFromToken}
                excludeToken={toToken?.symbol}
                usdValue={fromUsd}
                hasError={!!validationError && !!fromAmount}
                disabled={swap.isPending}
              />

              <div className="flex items-center justify-center my-2.5 relative z-10">
                <button
                  type="button"
                  onClick={handleFlip}
                  disabled={swap.isPending}
                  className="group p-2.5 rounded-xl bg-gray-700 hover:bg-purple-600/80 border border-gray-500/60 hover:border-purple-500/50 text-gray-300 hover:text-white transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
                  title="Flip tokens"
                >
                  <ArrowsUpDownIcon className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                </button>
              </div>

              <AmountPanel
                label="Amount to receive"
                amount={toAmount}
                token={toToken}
                tokens={tokens}
                onTokenChange={setToToken}
                excludeToken={fromToken?.symbol}
                readOnly
                usdValue={toUsd}
                disabled={swap.isPending}
              />

              {validationError && fromAmount && (
                <div className="animate-fade-in mt-3 flex items-center gap-2 text-red-400">
                  <ExclamationCircleIcon className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-medium">{validationError}</span>
                </div>
              )}

              {exchangeRate && fromToken && toToken && (
                <div className="mt-4 rounded-xl bg-gray-700/40 border border-gray-600/40 px-4 py-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-200 flex items-center gap-1">
                      <InformationCircleIcon className="w-4 h-4" />
                      Rate
                    </span>
                    <span className="text-gray-200 font-medium">
                      1 {fromToken.symbol} ={' '}
                      {formatNumber(exchangeRate, exchangeRate < 0.001 ? 8 : 4)}{' '}
                      {toToken.symbol}
                    </span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={swap.isPending || !!validationError || !fromAmount}
                className="mt-4 w-full py-4 rounded-2xl font-bold text-sm tracking-widest uppercase transition-all duration-200
                  bg-purple-600 hover:bg-purple-500
                  active:scale-[0.98]
                  text-white
                  disabled:opacity-35 disabled:cursor-not-allowed disabled:active:scale-100
                  focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                {swap.isPending ? (
                  <span className="flex items-center justify-center gap-2.5">
                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                    Swapping&hellip;
                  </span>
                ) : (
                  ctaLabel
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
