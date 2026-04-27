# Code Review: `problem3.ts`

## > Anti-patterns

### 1. DRY Violation

`FormattedWalletBalance` manually repeats `currency` and `amount` instead of extending `WalletBalance`.

### 2. Empty `Props` interface

An empty interface that only extends another adds no value and is needless indirection. Use a type alias instead.

### 3. `blockchain: any` parameter, no type inferred benefit

`getPriority` accepts `any`, defeating the type system. It should be typed as a string union of the known blockchain names or a dedicated type.

### 4. `rows` iterates `sortedBalances` typed as `FormattedWalletBalance`

`sortedBalances` contains plain `WalletBalance` objects with no `formatted` field, yet the iterator parameter is annotated `FormattedWalletBalance` and accesses `balance.formatted`.`balance.formatted` will be `undefined` at runtime. `rows` should iterate `formattedBalances` instead.

### 5. `children` destructured but never used

`children` is pulled from props and silently dropped. Either render it or remove the destructure.

### 6. `key={index}` on list items

Using array index as a React key causes incorrect reconciliation when items are reordered or removed. A stable unique key should be used instead.

## > Computational Inefficiencies

### 1. `blockchain` missing from `WalletBalance`

The interface only declares `currency` and `amount`. Accessing `balance.blockchain` in `getPriority` and the sort functionalities later is a TypeScript error; the field must be added to the interface.

### 2. `lhsPriority` will be undefined

Line 39 references `lhsPriority` but the variable declared on line 38 is `balancePriority`. This crashes at runtime.

### 3. Filter logic is wrong

The filter returns `true` (keep) when `balance.amount <= 0`, which keeps zero/negative balances and discards positive ones. The intended condition is `balance.amount > 0`.

### 4. `getPriority` re-created every render

Defined inside the component body without `useCallback`, so a new function reference is allocated on every render. It has no dependencies on component state or props and should be moved OUTSIDE the component entirely.

### 5. `prices` in `useMemo` deps is unused

`sortedBalances` never reads `prices`, but it is listed as a dependency. This causes the memo to recompute whenever prices change, doing wasted work.

```ts
// prices is unnecessary dependency
const sortedBalances = useMemo(() => {
  return balances.filter(...).sort(...);
}, [balances, prices]); // ← prices should be removed
```

### 6. `getPriority` called twice per sort pair

Inside `.sort()`, both `getPriority(lhs.blockchain)` and `getPriority(rhs.blockchain)` are called on every comparison. Priorities should be computed once per item before the sort and reused in the comparator.

### 7. `formattedBalances` computed but never used, this should be used and memoized

The `.map()` on line 56 runs on every render, allocates a new array, and the result is discarded. `rows` is built from `sortedBalances`, not `formattedBalances`. Wrap and use it with `useMemo`
