# lavamoat-demo

Demo on how to use [lavamoat](https://lavamoat.github.io) and [hardened javascript](https://hardenedjs.org) (formerly known as [secure ecmascript](https://github.com/endojs/endo/tree/master/packages/ses) or SES) to isolate js modules, accompanying my [talk slides](https://tvcutsem.github.io/assets/VanCutsem_LeastAuthorityJS_SecAppDev24.pdf) on how to build "Least-authority" JavaScript apps.

Specifically, we demonstrate [lavamoat-node](https://lavamoat.github.io/guides/lavamoat-node/), a way to run JavaScript modules in an SES sandbox on nodejs.

# installation

Make sure you have nodejs >= v22.16.0 installed and run:

```
npm install
```

# scenario

The `setup-unsafe.js` code loads two modules `alice` and `bob` and gives them access to a shared `log` object. For simplicity, the log is implemented as an array of string messages.

The POLA access control policy we want to enforce is that `alice` can only **write** to the log, while `bob` can only **read** from the log.

![scenario setup](setup.png)

See the example code in the [slides](https://tvcutsem.github.io/assets/LeastAuthorityJS-SecAppDev2025.pdf) to follow along.

## running the scenario without lavamoat/ses

We first show various ways Bob can circumvent the read-only restrictions on the log. See the different attack vectors in the modules `bob/bob-*.js`.

To run through a happy-case scenario where Bob does not stage an attack:

Run `node setup-safe.js` or `npm run node-no-attack`

Without attacks, the output of the code should be:

```
lavamoat-demo % node setup-unsafe.js 
bob: no attack
alice: writing to log
bob: reading the log:  [ 'message from alice' ]
log contents:  [ 'message from alice' ]
```

Alice has written a message `'message from alice'` to the log, and Bob was able to read this message.

To run through a scenario where bob executes one of the attacks, pass a command-line arg specifying an attack vector as follows:

| arg | attack vector |
|----------|----------|
| proto-poisoning     | Bob poisons global built-ins like Array.prototype |
| api-poisoning       | Bob poisons the public API of the log object |
| leak-mutable-state  | Bob corrupts mutable state leaked by the log object's API |
| excess-authority    | Bob is given excess authority allowing him to perform actions he shouldn't be able to do |

For example, to let bob run a prototype poisoning attack:

```
lavamoat-demo % node setup-unsafe.js proto-poisoning
bob: staging prototype poisoning attack
alice: writing to log
called Bob's evil push() function
bob: reading the log:  []
log contents:  []
```

Here we can see the effect of Bob poisoning `Array.prototype.push`, causing Alice's message to get lost.

## running the scenario with lavamoat/ses

Lavamoat will run each module dependency in an isolated SES sandbox with shared but immutable (frozen) 'primordial' objects where prototype poisoning attacks will fail.

The file `setup-safe.js` assumes it will run in an SES sandbox, where functions like `harden()` are available globally. It also uses `harden()` to make the log object's API surface immutable.

To run the module using lavamoat, first let lavamoat generate a [policy file](https://lavamoat.github.io/guides/policy/):

```
npm run lavamoat-generate-policy
```

This will generate a `lavamoat/node/policy.json` file establishing the privileges of any package dependencies (none in this example).

Then run the code using the lavamoat cli tool:

```
lavamoat-demo % npx lavamoat setup-safe.js 
bob: no attack
alice: writing to log
bob: reading the log:  [ 'message from alice' ]
log contents:  [ 'message from alice' ]
```

If Bob now tries to run the `proto-poisoning` attack the output will be:

```
lavamoat-demo % npx lavamoat setup-safe.js proto-poisoning
bob: staging prototype poisoning attack
TypeError: Cannot assign to read only property 'push' of 'root.%ArrayPrototype%.push'
  at set push (LavaMoat/node/kernel:6656:21)
  at exports.setup (eval at <anonymous> (eval at makeEvaluate (LavaMoat/node/kernel)), <anonymous>:6:26)
  at Object.eval (eval at <anonymous> (eval at makeEvaluate (LavaMoat/node/kernel)), <anonymous>:29:20)
  at Object.internalRequire (LavaMoat/core/kernel:1355:27)
  ...
```

In other words, the attack fails with a `TypeError` since `Array.prototype` is now immutable.

All other attacks will also fail under the new setup (`setup-safe.js`) and when executed in lavamoat.

For a full list of commands to run each attack in an unsafe (vanilla nodejs) or safe  (lavamoat protected) environment, see the scripts section of `package.json`.

## note on module syntax

Lavamoat [cannot yet handle ESM module import syntax](https://lavamoat.github.io/guides/lavamoat-node/), so either you must use commonjs module syntax (as we did in this repo) or you can use tools like [rollup](https://rollupjs.org/guide/en/) to compile your ESM modules into a standard commonjs bundle before feeding it to lavamoat.

ESM module support is [on the lavamoat roadmap](https://github.com/LavaMoat/LavaMoat/issues/389#issuecomment-1325226403).

If you try to run lavamoat on an ESM module you'll get an error like:

```
% npx lavamoat setup-safe.js
LavaMoat - Error evaluating module ".../lavamoat-demo/setup-safe.js" from package "$root$" 
SyntaxError: Cannot use import statement outside a module
  at Object.eval (eval at makeEvaluate (LavaMoat/node/kernel), <anonymous>:12:36)
  at safeEvaluate (LavaMoat/node/kernel:6551:14)
  at compartmentEvaluate (LavaMoat/node/kernel:8787:10)
  ...
```
