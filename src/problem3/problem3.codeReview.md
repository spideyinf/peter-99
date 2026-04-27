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

## > Computational Inefficiencies

### 1. `blockchain` missing from `WalletBalance`

The interface only declares `currency` and `amount`. Accessing `balance.blockchain` in `getPriority` and the sort functionalities later is a TypeScript error; the field must be added to the interface.
