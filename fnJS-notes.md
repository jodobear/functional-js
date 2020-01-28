# Functional JS Notes

## Ch 01 Introducing Functional JS

- `apply`, `call`, `arguments` together make JS extremely flexible.
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

## CH02 First Class Functions & Applicative Programming

### First Class Functions

That's what makes a language functional to start with then you have static typing, pattern matching, immutability, purity and so on in varying degrees.

**Defn**: It is one that can go anywhere a value can go - there can be few or no restrictions. E.g.

- A number can be stored in a variable and so can a function:
`var fortytwo = function() { return 42 };`
- A number can be stored in an array slot and so can a function:
`var fortytwos = [42, function() { return 42 }];`
- A number can be stored in an object field and so can a function:
`var fortytwos = {number: 42, fun: function() { return 42 }};`
- A number can be created as needed and so can a function:
`42 + (function() { return 42 })(); //=> 84`
- A number can be passed to a function and so can a function:
```js
function weirdAdd(n, f) { return n + f() }

weirdAdd(42, function() { return 42 }); //=> 84
```
- A number can be returned from a function and so can a function:
```js
return 42;

return function() { return 42 };
```

The last two examples are of a _higher-order_ fn, they can do one or both of the following:

- Take a function as an arg.
- Return a fn. as a result.

### Multiple Paradigms of JS

- **Imperative programming**: Programming based around describing actions in detail
- **Prototype-based OOP**: Programming based around prototypical objects and instances of them
- **Metaprogramming**: Programming manipulating the basis of JavaScript’s execution model
- Other programming paradigms that could be used, **class orientation** and **evented programming**.

#### Imperative Programming

An imperative programming style is categorized by its exquisite (and often infuriating) attention to the details of algorithm implementation. Further, imperative programs are often built around the direct manipulation and inspection of program state; e.g.
```js
var lyrics = [];

for (var bottles = 99; bottles > 0; bottles--) {
  lyrics.push(bottles + " bottles of beer on the wall");
  lyrics.push(bottles + " bottles of beer");
  lyrics.push("Take one down, pass it around");

  if (bottles > 1) {
    lyrics.push((bottles - 1) + " bottles of beer on the wall.");
  }
  else {
    lyrics.push("No more bottles of beer on the wall!");
  }
}
```
Because imperative code operates at such a precise level of detail, they are often one-shot implementations or at best, difficult to reuse. Further, imperative languages are often restricted to a level of detail that is good for their compilers rather than for their programmers (Sokolowski 1991).

Compare a functional approach:
```js
function lyricSegment(n) {
  return _.chain([])
    .push(n + " bottles of beer on the wall")
    .push(n + " bottles of beer")
    .push("Take one down, pass it around")
    .tap(function(lyrics) {
      if (n > 1) lyrics.push((n - 1) + " bottles of beer on the wall.");
      else lyrics.push("No more bottles of beer on the wall!");
    })
    .value();
}

// this produces only 4 lines of the lyrics as
lyricSegment(9);

// the part that abstracts the assembly from the verse segments
function song(start, end, lyricGen) {
  return _.reduce(_.range(start, end, -1),
    function(acc, n) {
      return acc.concat(lyricGen(n));
  }, []);
}

//using it as:
song(99, 0, lyricSegment);
```

#### Prototype-based OOP

JavaScript is very similar to Java or C# in that its constructor functions are classes (at least at the level of implementation details), but the method of use is at a lower level. Every instance in a Java program is generated from a class serving as its template,JavaScript instances use existing objects to serve as prototypes for specialized instances.[27] Object specialization, together with a built-in dispatch logic that routes calls down what’s called a prototype chain, is far more low-level than class-oriented programming, but is extremely elegant and powerful.

Its self-reference semantics conflict with the notion of functional programming. Observe the following:
```js
var a = {name: "a", fun: function () { return this; }};

a.fun(); //=> {name: "a", fun: ...};
```
You’ll notice that the self-reference this returned from the embedded fun function returns the object a itself. This is probably what you would expect. However, observe the following:
```js
var bFunc = function () { return this };
var b = {name: "b", fun: bFunc};

b.fun(); //=> some global object, probably Window
```
This is surprising. When a function is created outside of the context of an object instance, its this reference points to the global object. Therefore, when I later bound bFunc to the field `b.fun`, its reference was never updated to `b` itself.


#### Fn vs Method

A fn exists on it's own while a method is a fn created in the context of an object.

#### Metaprogramming

Related to prototype-based OOP and orthogonal to FP, but you can take some advantage of it. JS provides powerful facilities for metaprogramming.

**Defn**: Programming occurs when you write code to do something and metaprogramming occurs when you write code that changes the way that something is interpreted, e.g.

In the case of JS, the dynamic nature of the `this` reference can be exploited to perform a bit of metaprogramming. For example, observe the following constructor function:
```js
function Point2D(x, y) {
  this._x = x;
  this._y = y;
}
```
When used with `new`, the `Point2D` function gives a new object instance with the proper fields set as you might expect;
```js
new Point2D(0, 1); //=> {_x: 0, _y: 1}`
```
However, the `Function.call` method can be used to metaprogram a derivation of the Point2D constructor’s behavior for a new Point3D type:
```js
function Point3D(x, y, z) {
  Point2D.call(this, x, y);
  this._z = z;
}
```
And creating a new instance works like a champ:

```js
new Point3D(10, -1, 100); //=> {_x: 10, _y: -1, _z: 100}
```

### Applicative Programming

**Defn**: the calling by function B of a function A, supplied as an argument to function B originally. Canonical examples `map`, `reduce` & `filter`
```js
_.map(collection, fn(elem) {});
_.reduce(collection, fn(acc, val) {});
_.filter(collection, fun(elem) {});
```
Somewhere inside these a call to the fn that's passed in occurs. Semantics of these fns can be defined in terms of that very relationship:

- `_.map` calls a fn on every value in a collection in turn, returning a collection of the results.
- `_.reduce` collects a composite vale from the incremental results of a function supplied with an accumulation value and each value in a collection, returning the accumulated result.
- `_.filter` calls a predicate fn and grabs each vale where said predicate returned `true`, returning them in a new collection.

### Collection-Centric Programming

This is often coupled with FP. Fp is extremely useful for tasks requiring that some operation happen on many items in a collection, e.g.

```js
_.map({a: 1, b: 2}, _.identity); //=> [1, 2]
_.map({a: 1, b: 2}, function(v,k) {
  return [k,v];
}); //=> [['a', 1], ['b', 2]]

// _.map can also take a 3rd arg > the collection itself.
_.map({a: 1, b: 2}, function(k, v, coll) {
  return [k, v, _.keys(coll)];
}) //=> [['a', 1, ['a', 'b']], ['b', 2, ['a', 'b']]]
```
The point of a collection-centric view, is to establish a consistent processing idiom so that we can reuse a comprehensive set of functions. As the great luminary Alan Perlis once stated:
> It is better to have 100 functions operate on one data structure than 10 functions on 10 data structures.

#### Other eg. of Applicative Programming:

1. **`reduceRight`**: `_.reduce` evaluates from left to right while `_.reduceRight` evaluates from right to left. If the function supplied to the reduce siblings is associative, then they wind up returning the same values, but otherwise the difference in ordering can prove useful. Check e.g. for an illustration in `functions.js`.

    The `_.reduceRight` function has further advantages in languages providing lazy evaluation, but since JavaScript is not such a language, evaluation order is the key factor (Bird 1988).

2. **`find`**: it takes a collection and a predicate and returns the first element for which the predicate returns `true`; `_.find(['a', 'b', 3, 'd'], _.isNumber); //=> 3`.

    Underscore provides these built-in fns: `_.isEqual`, `_.isEmpty`, `_.isElement`, `_.isArray`, `_.isObject`, `_.isArguments`, `_.isFunction`, `_.isString`, `_.isNumber`, `_.isFinite`, `_.isBoolean`, `_.isDate`, `_.isRegExp`, `_.isNaN`, `_.isNull`, and `_.isUndefined`.

3. **`reject`**: opposite of `_.filter`; it takes a predicate and returns a collection of values that excludes values for which the predicate returned `true`.

    This can also be achieved with a `complement` fn, an example of a _higher-order_ fn:
```js
function complement(pred) {
  return function() {
    return !pred.apply(null, _.toArray(arguments))
  }
}
// usage
const a = ['a', 'b', 3, 'd'];
_.filter(a, complement(_.isNumber)); //=> ['a', 'b', 'd']
```

**NOTE:** Passing `null`<a name="apply-null"></a> as the first argument to `apply` is worth a mention. Recall that the first argument to `apply` is the “target” object setting the this reference inside the called function. Since we3 can’t know what the target object should be, or even if it’s needed at all, we use `null` to signal that this should just refer to the global object.

1. **`all`**: The `_.all` function takes a collection and a predicate, and returns true if all of the elements within return true on the predicate check.

2. **`any`**: The `_.any` function takes a collection and a predicate, and returns true if any of the elements within return true on the predicate check.

3. **`sortBy`, `groupBy` & `countBy`**: All perform some action based on the result of a given criteria fn.
```js
// sortBy: return sorted collection based on the criteria determined by the passed fn:
var people = [{name: "Rick", age: 30}, {name: "Jaka", age: 24}];

_.sortBy(people, function(p) { return p.age });
//=> [{name: "Jaka", age: 24}, {name: "Rick", age: 30}]

// groupBy: returns an object where the keys are the criteria points returned by the function, and their associated values are the elements that matched.
// extremely useful.
var albums = [{title: "Sabbath Bloody Sabbath", genre: "Metal"},
              {title: "Scientist", genre: "Dub"},
              {title: "Undertow", genre: "Metal"}];

_.groupBy(albums, function(a) { return a.genre });
//=> {Metal:[{title:"Sabbath Bloody Sabbath", genre:"Metal"},
//           {title:"Undertow", genre:"Metal"}],
//    Dub:  [{title:"Scientist", genre:"Dub"}]}

// countBy: returns an object with keys of the match criteria associated with its count:
_.countBy(albums, function(a) { return a.genre }); //=> {Metal: 2, Dub: 1}
```

### Defining Own Applicative Fns

Simple, define a fn that takes a fn and calls it. Following is NOT an applicative fn:
```js
function cat() {
  let head = _.first(arguments); // arguments in JS is a keyword
  if (existy(head)) return head.concat.apply(head, _.rest(arguments));
  return [];
}
cat([1, 2], [3, 4], [5, 6]); //=> [1, 2, 3, 4, 5, 6]  // notice this is just 1 element, a list of lists.
cat([[1, 2], [3, 4], [5, 6]]); //=> [[1, 2], [3, 4], [5, 6]]
cat([[1, 2], [3, 4], [5, 6]], [8, 9]); //=> [[1, 2], [3, 4], [5, 6], 8, 9]

```
Very useful but, `cat` doesn't expect to receive a fn as arg. Likewise, following isn't as well:
```js
function construct(head, tail) {
  return cat([head], _.toArray(tail));
}
construct(42, [1,2,3]); //=> [42, 1, 2, 3]
```
While `construct` uses `cat` within it's body, it doesn't receive it as an argument, so it fails the applicative test. While following is:
```js
function mapcat(fn, coll) {
  return cat.apply(null, _.map(coll, fn));
}
// usage
mapcat(function(e) {
  return construct(e, [","]);
}, [1,2,3]);
//=> [1, ",", 2, ",", 3, ","]
```
We can flatten it a level(take out the last entry?) creating `butLast` & `interpose` fns:
```js
function bytLast(coll) {
  return _.toArray(coll).slice(0, -1);
}

function interpose (delimiter, coll) {
  return butLast(mapcat(function (e) {
    return construct(e, [delimiter]);
  }, coll));
}
// usage
interpose(",", [1, 2, 3]); //=> [1, ",", 2, ",", 3]
```
**NOTE:** `arguments` in JS is a keyword. Every JavaScript function can access a local value named `arguments` that is an array-like structure holding the values that the function was called with. Having access to `arguments` is surprisingly powerful, and is used to amazing effect in JavaScript in the wild.

This is a key facet of FP: the gradual definition and use of discrete functionality built from lower-level functions. A chain of functions called one after the other, each gradually transforming the result from the last to reach a final solution.

### Data Thinking

`_.keys`,`_.values` & `_.pluck`: (returns array of values at given key from the object). All these fns deconstruct given objects into arrays.

```js
const books = [{title: "Chthon", author: "Anthony", ie: "01"},
                {title: "Grendel", author: "Gardner", id: "02"},
                {title: "After Dark"}]
console.log(_.pluck(books, 'author')); //=> ["Anthony", "Gardner", undefined]
console.log(_.pairs(books)); //=> [[index, {obj}], [i, {obj}], [i, {obj}]
```
Another way of viewing a JS object is an an array of arrays, each holding key and value pairs and `_.pairs` turns it into a nested array

Other fns: `_.object`, `_.invert`, `_.defaults`, `_.omit`, `_pick`..

e.g. of chaining fns:
```js
_.keys(_.invert({a: 138, b: 9})); //=> ['9', '138']

_.pluck(_.map(books, function(obj) {
  return _.defauts(obj, {author: "Unknown"})
  }),
'author');
//=> ["Anthony", "Gardner", "Unknown"]

var person = {name: "Romy", token: "j3983ij", password: "tigress"};

var info = _.omit(person, 'token', 'password');
info; //=> {name: "Romy"}

var creds = _.pick(person, 'token', 'password');
creds; //=> {password: "tigress", token: "j3983ij"};
```
`_.findWhere`: returns 1st match, `_.where`: returns all matches;
```js
var library = [{title: "SICP", isbn: "0262010771", ed: 1},
               {title: "SICP", isbn: "0262510871", ed: 2},
               {title: "Joy of Clojure", isbn: "1935182641", ed: 1}];

_.findWhere(library, {title: "SICP", ed: 2});
//=> {title: "SICP", isbn: "0262510871", ed: 2}

_.where(library, {title: "SICP"});
//=> [{title: "SICP", isbn: "0262010771", ed: 1},
//    {title: "SICP", isbn: "0262510871", ed: 2}]
```

- This way of using data points to a very important data abstraction: **the table**.
- Using _Underscore_, gives similar experience as to using SQL.
- The functions created in this section implement a subset of the relational algebra on which all SQL engines are built (Date 2003) - not deep but, pseudo-SQL level.

#### "Table-like" Data

- I understand the `null` argument that's paased in fns, it's the host/target where the output of the fn call should return it's value to.
- `reduce` mechanics are a bit more clear.