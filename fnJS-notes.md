# Functional JS Notes

## Ch 01 Introducing Functional JS

- `apply`, `call`, arguments together make JS extremely flexible.
- `splat` a fn that takes a function and returns another function that takes an array and calls the og fn with apply, so it's elements serve as its arguments:

```js
function splat(fun) {
  return function(array) {
    return fun.apply(null, array);
  };
};

const addArrayElems = splat(function(x, y) { return x + y });

addArrayElems([1, 2]); //=> 3
```
Functions-as-abstraction allow you to fulfil the following:
> _Make it run, make it right, make it fast_. - Butler Lampson's maxim in the UNIX community.
>
> _Make it run, then make it right, then make it fast_. - Kent Beck's mantra in TDD.

- Functions that always return a boolean value are called _predicates_

### Two very important functions: `existy` & `truthy`

```js
function existy(x) { return x !== null && x !== undefined };
console.log(existy(undefined)); //=> false
function truthy(x) { return x !== false && existy(x) };
console.log(truthy()); //=> true // why??

const a = [null, undefined, 1, 2, false];
console.log(a.map(existy)); //=> [false, false, true, true, true]
console.log(a.map(truthy)); //=> [false, false, true, true, false]
```

This, ladies and gentlemen, is FP:
- The definition of an abstraction for "existence" in the guise of a fn.
- The definition of an abstraction for "truthiness" built from existing fn.
- The use of said fns by other fns via parameter passing to achieve some behavior.

**NOTE:** In `executeIfHasField(target, name)` I use `existy(target[name])` rather than Underscore’s `has(target, name)` because the latter will only check self-keys.

### On Speed

There’s no way to deny that the use of the array index form array[0] will execute faster than either of nth(array, 0) or _.first(array). Likewise, an imperative loop of the following form will be very fast:
```js
for (var i=0, len=array.length; i < len; i++) {
  doSomething(array[i]);
}
```
An analogous use of Underscore’s _.each function will, all factors being equal, be slower:
```js
_.each(array, function(elem) {
  doSomething(array[i]);
});
```
There are various ways of optimizing code, Google's V8 JS engine introduced runtime speed enhancements such as native-code execution, just-in-time compilation, faster garbage collection, call-site caching, and in-lining into their own JavaScript engines.

The subject of in-lining is particularly interesting, because many in-lining optimizations can be performed statically, or before code is ever run. Code in-lining is the act of taking a piece of code contained in, say, a function, and “pasting” it in place of a call to that very function.

But, with optimizations you'd really be hard pressed to hit the speed bottleneck. (there are static optimizers, sophisticated optimizers & really amazing static analyzers)

And to top off this amazing set of optimizing transformations, you can imagine that if these calls have no effects or are never called, then the optimal transformation is:
```js
// ... some time later
```
That is, if a piece of code can be determined to be “dead” (i.e., not called), then it can safely be eliminated via a process known as code elision. There are already program optimizers available for JavaScript that perform these types of optimizations—the primary being Google’s Closure compiler. The Closure compiler is an amazing piece of engineering that compiles JavaScript into highly optimized JavaScript.

## Summary

FP is:

- Identifying an abstraction and building a fn for it.
- Using existing fns and building more complex abstractions.
- Passing existing fns to other fns to build even more complex abstractions.