import { useState } from 'react';
import { ICON_BASE } from './utils';

export const TokenIcon = ({ symbol, size = 28 }: { symbol: string; size?: number }) => {
  const [failedSymbol, setFailedSymbol] = useState<string | null>(null);
  const failed = failedSymbol === symbol;

  if (failed) {
    return (
      <div
        className="rounded-full bg-purple-600 flex items-center justify-center text-white font-bold shrink-0 select-none"
        style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
      >
        {symbol.slice(0, 2)}
      </div>
    );
  }

  return (
    <img
      src={`${ICON_BASE}/${symbol}.svg`}
      alt={symbol}
      width={size}
      height={size}
      className="rounded-full shrink-0 object-contain"
      onError={() => setFailedSymbol(symbol)}
    />
  );
};
