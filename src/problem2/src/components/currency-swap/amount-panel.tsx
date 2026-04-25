import type { Token } from 'types/Token';
import { TokenSelector } from './token-selector';
import { formatNumber } from './utils';

export interface AmountPanelProps {
  label: string;
  secondaryLabel?: string;
  amount: string;
  token: Token | null;
  tokens: Token[];
  onAmountChange?: (value: string) => void;
  onTokenChange: (token: Token) => void;
  excludeToken?: string;
  readOnly?: boolean;
  usdValue?: number;
  hasError?: boolean;
  disabled?: boolean;
}

export const AmountPanel = ({
  label,
  amount,
  token,
  tokens,
  onAmountChange,
  onTokenChange,
  excludeToken,
  readOnly,
  usdValue,
  hasError,
  disabled
}: AmountPanelProps) => (
  <div
    className={`rounded-2xl border transition-all duration-200 p-4 ${
      hasError
        ? 'border-red-500/50 bg-red-500/5'
        : readOnly
          ? 'border-gray-600/40 bg-gray-700/30'
          : 'border-gray-600/50 bg-gray-700/60 focus-within:border-purple-500/50 focus-within:bg-gray-700/80'
    }`}
  >
    <div className="flex items-baseline gap-1.5 mb-2.5">
      <label className="text-gray-200 text-xs font-medium">{label}</label>
    </div>

    <div className="flex items-center gap-3">
      <input
        id={readOnly ? 'output-amount' : 'input-amount'}
        type={readOnly ? 'text' : 'number'}
        value={
          readOnly && amount ? formatNumber(parseFloat(amount), 6) : amount
        }
        readOnly={readOnly}
        disabled={disabled}
        onChange={(event) => onAmountChange?.(event.target.value)}
        placeholder="0.00"
        min="0"
        step="any"
        className={`flex-1 bg-transparent text-2xl font-bold outline-none placeholder-gray-500 min-w-0 border-none p-0 focus:ring-0 ${
          readOnly ? 'text-gray-200 cursor-default' : 'text-white'
        } disabled:opacity-50`}
      />
      <TokenSelector
        tokens={tokens}
        value={token}
        onChange={onTokenChange}
        exclude={excludeToken}
        disabled={disabled}
      />
    </div>

    <p className="mt-2 text-xs min-h-4">
      {!readOnly && usdValue !== undefined && usdValue > 0 ? (
        <span className="text-gray-400">
          {'≈ $'}
          {formatNumber(usdValue, 2)}
        </span>
      ) : null}
    </p>
  </div>
);
