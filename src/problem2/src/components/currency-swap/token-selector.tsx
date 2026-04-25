import { useState, useEffect, useRef } from 'react';
import {
  MagnifyingGlassIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { PrimaryButton } from 'components/common';
import type { Token } from 'types/Token';
import { TokenIcon } from './token-icon';
import { formatNumber } from './utils';

export interface TokenSelectorProps {
  tokens: Token[];
  value: Token | null;
  onChange: (token: Token) => void;
  exclude?: string;
  disabled?: boolean;
}

export const TokenSelector = ({
  tokens,
  value,
  onChange,
  exclude,
  disabled
}: TokenSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = tokens.filter(
    (token) =>
      token.symbol !== exclude &&
      token.symbol.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (!open) return;
    const handleMouseDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 60);
  }, [open]);

  return (
    <div ref={ref} className="relative shrink-0">
      <PrimaryButton
        disabled={disabled}
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        {value ? (
          <>
            <TokenIcon symbol={value.symbol} size={20} />
            <span className="text-white font-semibold text-sm tracking-wide">
              {value.symbol}
            </span>
          </>
        ) : (
          <span className="text-gray-400 text-sm">Select</span>
        )}
        <ChevronDownIcon
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </PrimaryButton>

      {open && (
        <div className="animate-fade-in absolute right-0 top-full mt-2 w-64 rounded-2xl bg-gray-700 border border-gray-600/60 shadow-2xl shadow-black/30 z-50 overflow-hidden">
          <div className="p-3 border-b border-gray-600/40">
            <div className="flex items-center gap-2 rounded-lg bg-gray-600/60 px-3 py-2">
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                ref={inputRef}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search token…"
                className="bg-transparent text-sm text-white placeholder-gray-500 outline-none w-full"
              />
            </div>
          </div>

          <div className="max-h-56 overflow-y-auto py-1.5">
            {filtered.length === 0 ? (
              <p className="text-center text-gray-500 text-sm py-8">
                No results
              </p>
            ) : (
              filtered.map((token) => (
                <button
                  key={token.symbol}
                  type="button"
                  onClick={() => {
                    onChange(token);
                    setOpen(false);
                    setSearch('');
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-600/50 transition-colors ${
                    value?.symbol === token.symbol ? 'bg-purple-800/30' : ''
                  }`}
                >
                  <TokenIcon symbol={token.symbol} size={28} />
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm">
                      {token.symbol}
                    </p>
                    <p className="text-gray-400 text-xs">
                      ${formatNumber(token.price, 4)}
                    </p>
                  </div>
                  {value?.symbol === token.symbol && (
                    <CheckCircleIcon className="w-4 h-4 text-purple-400 shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
