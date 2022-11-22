# lavamoat-demo

Demo on how to use [lavamoat](https://github.com/LavaMoat/LavaMoat/) and [secure ecmascript](https://github.com/endojs/endo/tree/master/packages/ses)(SES) to isolate js modules, accompanying my [talk slides](https://tvcutsem.github.io/assets/HardenedJS_BlueLava2022.pdf) on hardened javascript.

Specifically, we demonstrate [lavamoat-node](https://github.com/LavaMoat/LavaMoat/tree/main/packages/node), a way to run JavaScript modules in an SES sandbox on nodejs.

# installation

Make sure you have nodejs v18+ installed and run:

```
npm install
```

# scenario

The `setup1.js` code loads two modules `alice` and `bob` and gives them access to a shared `log` object.

The guarantee we want to achieve is that `alice` can only write to the log, while `bob` can only read from the log.

See the example code in the [slides](https://tvcutsem.github.io/assets/HardenedJS_BlueLava2022.pdf) to follow along.

## without lavamoat/ses

We first show various ways Bob can circumvent the read-only restrictions on the log. See `attack1` through `attack4` in `bob.js`.

To observe the effect, uncomment one of the `attackX(log)` lines in `bob.js` and run `setup1.js` using vanilla node:

Run `node setup1.js` or `npm run node`

Without attacks, the output of the code should be:

```
lavamoat-demo % npm run node

> node
> node setup1.js

alice: writing to log
bob: reading the log:  [ 'alice' ]
done
```

If we uncomment `attack1` we see the effect of Bob poisoning `Array.prototype`, causing Alice's write to get lost:

```
AssertionError [ERR_ASSERTION]: Expected values to be loosely deep-equal:

[
  'alice'
]

should loosely deep-equal

[
  'alice',
  'host'
]
```

## with lavamoat/ses

Lavamoat will put the modules in an isolated SES sandbox with frozen 'primordial' objects where prototype poisoning attacks will fail.

The file `setup2.js` assumes it will run in an SES sandbox, where new functions like `harden()` are available.

To run the module using lavamoat, first let lavamoat generate a policy file:

```
npm run lavamoat-init
```

This will generate a `lavamoat/node/policy.json` file establishing the privileges of any package dependencies (none in this example).

Then run the code using the lavamoat cli tool:

```
npm run lavamoat
```

If Bob tries to run `attack1` the output will be:

```
% npm run lavamoat

> lavamoat
> npx rollup -c && npx lavamoat bundle.js


setup2.js → bundle.js...
created bundle.js in 18ms
Removing intrinsics.Object.hasOwn
Removing intrinsics.%ArrayPrototype%.findLast
Removing intrinsics.%ArrayPrototype%.findLastIndex
Removing intrinsics.%ArrayPrototype%.@@unscopables.findLast
Removing intrinsics.%ArrayPrototype%.@@unscopables.findLastIndex
Removing intrinsics.%TypedArrayPrototype%.findLast
Removing intrinsics.%TypedArrayPrototype%.findLastIndex
alice: writing to log
bob: reading the log:  [ 'alice' ]
TypeError: Cannot assign to read only property 'push' of 'root.%ArrayPrototype%.push'
  at Array.setter (LavaMoat/node/kernel:7953:17)
  at attack1 (eval at <anonymous> (eval at makeEvaluateFactory (LavaMoat/node/kernel)), <anonymous>:13:26)
  ...
```

In other words, the attack fails with a `TypeError` since `Array.prototype` is now immutable.

## misc notes

We use [rollup](https://rollupjs.org/guide/en/) to compile `setup2.js` into a standard commonjs bundle without JS module syntax.

Trying to run lavamoat directly on `setup2.js` fails, apparently because it cannot deal with import syntax?

```
% npx lavamoat setup2.js
Removing intrinsics.Object.hasOwn
Removing intrinsics.%ArrayPrototype%.findLast
Removing intrinsics.%ArrayPrototype%.findLastIndex
Removing intrinsics.%ArrayPrototype%.@@unscopables.findLast
Removing intrinsics.%ArrayPrototype%.@@unscopables.findLastIndex
Removing intrinsics.%TypedArrayPrototype%.findLast
Removing intrinsics.%TypedArrayPrototype%.findLastIndex
LavaMoat - Error evaluating module "/setup2.js" from package "$root$" 
SyntaxError: Cannot use import statement outside a module
  at Object.eval (eval at makeEvaluateFactory (LavaMoat/node/kernel), <anonymous>:8:30)
  at performEval (LavaMoat/node/kernel:4157:12)
  ...
```