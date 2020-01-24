# Functional JS

Notes from the the book by Michael Fogus

## Book Conventions

- Assign variables only once.
- Do not use eval.
- Do not modify core objects like Array and Function.
- Favor fn over methods.
- A defined fn at the start, should work in subsequent stages.
- Fn of zero parameters are used to denote that the arguments don’t matter.
- In some examples, ... is used to denote that the surrounding code segments are being ignored.
- Text like inst#method denotes a reference to an instance method.
- Text like Object.method denotes a reference to a type method.
- Restricted if/else statements to a single line per branch, so avoided curly brackets, saves precious vertical space.
- I like to use semicolons.
- Italic: Indicates new terms, URLs, email addresses, filenames, and file extensions.
- Constant width(Mono) - program listings, and within paragraphs to refer to program elements such as variable or fn names, databases, data types, environment variables, statements, and keywords.
- Constant width(Mono) bold - commands or text to be typed.
- Constant width(Mono) italic - replaced with values by user or determined by context.

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
> _Make it run, then make it right, then make it fast_. - Kent Beck's mantra in TDD.

- Functions that always return a boolean value are called _predicates_




