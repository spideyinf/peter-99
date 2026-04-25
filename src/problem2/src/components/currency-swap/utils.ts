export const ICON_BASE =
  'https://raw.githubusercontent.com/Switcheo/token-icons/refs/heads/main/tokens';

export const PRICES_URL = 'https://interview.switcheo.com/prices.json';

export const formatNumber = (value: number, digits = 6): string =>
  value.toLocaleString(undefined, { maximumFractionDigits: digits });
