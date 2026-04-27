// @ts-nocheck
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

type Blockchain = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo';

const getPriority = (blockchain: Blockchain | string): number => {
  switch (blockchain) {
    case 'Osmosis':  return 100;
    case 'Ethereum': return 50;
    case 'Arbitrum': return 30;
    case 'Zilliqa':  return 20;
    case 'Neo':      return 20;
    default:         return -99;
  }
};

type Props = BoxProps;

const WalletPage: React.FC<Props> = ({ children, ...rest }) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  const sortedBalances = useMemo(() => {
    return balances
      .map((balance: WalletBalance) => ({
        ...balance,
        priority: getPriority(balance.blockchain),
      }))
      .filter(({ priority, amount }) => priority > -99 && amount > 0)
      .sort((left, right) => right.priority - left.priority);
  }, [balances]);

  const formattedBalances: FormattedWalletBalance[] = useMemo(
    () =>
      sortedBalances.map((balance) => ({
        ...balance,
        formatted: balance.amount.toFixed(2),
      })),
    [sortedBalances]
  );

  const rows = formattedBalances.map((balance: FormattedWalletBalance) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow
        className={classes.row}
        key={balance.currency}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    );
  });

  return (
    <div {...rest}>
      {rows}
      {children}
    </div>
  );
};
