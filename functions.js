// A collection of functions that we saw in the book

// ch01:

// Functions as units of abstractions:
// debug message functions
function fail(thing) {
  throw new Error(thing);
}
function warn(thing) {
  console.log(["WARNING:", thing].join(" "));
}
function note(thing) {
  console.log(["NOTE:", thing].join(" "));
}

// Functions as units of behavior:
// finding nth of some data
function nth(data, index) {
  if (!_.isNumber(index)) fail("Expected number a index.");
  if (!_.isIndexed(data)) fail("Expected an array or string");
  if (index < 0 || index > data.length - 1) fail("Index out of bounds.");
  else return data[index];
}

function isIndexed(data) {
  return _.isArray(data) || _.isString(data);
}

function second(data) {
  return nth(data, 1);
}

function last(data) {
  return nth(data, data.length - 1);
}

// comparator: this can then be used for a lot of predicates
function comparator(pred) {
  return function(x, y) {
    if (pred(x, y)) return -1;
    else if (pred(y, x)) return 1;
    else return 0;
  };
}

function lessOrEqual(x, y) {
  return x <= y;
}

// using lessOrEqual as predicate to sort a collection using the comparator.
const a = [2, 0, -1, 1];
a.sort(comparator(lessOrEqual));

// Data as abstraction
// function to illustrate constructing data

function lameCSV(str) {
  return _.reduce(
    str.split("\n"),
    function(table, row) {
      table.push(
        _.map(row.split(","), function(col) {
          return col.trim();
        })
      );
      return table;
    },
    []
  );
}

const peopleTable = lameCSV("name,age,hair\nMerble,35,red\nBob,64,blonde");
console.table(peopleTable);
// peopleTable without header subArray, sorted
_.rest(peopleTable).sort();

function selectNames(table) {
  return _.rest(_.map(table, _.first));
}

function selectAges(table) {
  return _.rest(_.map(table, second));
}

function selectHair(table) {
  return _.rest(_.map(table, last));
}
// OR
function selectHair(table) {
  return _.rest(
    _.map(table, function(row) {
      return nth(row, 2);
    })
  );
}

const mergeResults = _.zip;
console.table(mergeResults(selectNames(peopleTable), selectHair(peopleTable)));
//=> [["Merble", "35"], ["Bob", "64"]]

// extremely useful general functions
// existy: distinguishes between null and undefined, and everything else.
// function existy(x) { return x != null };  // as in book gives true for undefined. Had to add the following condition.
function existy(x) {
  return x != null || x !== undefined;
}
// usage
existy(null); //=> false

existy(undefined); //=> false

existy({}.notHere); //=> false

existy((function() {})()); //=> false

existy(0); //=> true

existy(false); //=> true

// truthy: if something should be considered a synonym for true.
function truthy(x) {
  return x != false && existy(x);
}
// usage
truthy(false); //=> false

truthy(undefined); //=> false

truthy(0); //=> true

truthy(""); //=> true // why??

truthy(); //=> true  // why??

// using these over an array
const a = [null, undefined, 1, 2, false];
a.map(existy);
a.map(truthy);


// ch02
// applicative programming
function allOf(/* funs */) {
  return _.reduceRight(arguments, function(truth, f) {
    return truth && f();
  }, true);
}

function anyOf(/* funs */) {
  return _.reduceRight(arguments, function(truth, f) {
    return truth || f();
  }, false);
}
// Example usages of allOf and anyOf are as follows:
function T() { return true }
function F() { return false }

allOf(); //=> true
allOf(T, T); //=> true
allOf(T, T, T , T , F); //=> false

anyOf(T, T, F); //=> true
anyOf(T, T, F); //=> false
anyOf(); //=> false
anyOf(); //=> false


// complement
_.reject(['a', 'b', 3, 'd'], _.isNumber); //=> ['a', 'b', 'd']

// same thing
function complement(pred) {
  return function() {
    return !pred.apply(null, _.toArray(arguments))
  }
}
// usage
const a = ['a', 'b', 3, 'd'];
_.filter(a, complement(_.isNumber)); //=> ['a', 'b', 'd']


function cat() {
  var head = _.first(arguments);
  if (existy(head)) return head.concat.apply(head, _.rest(arguments));
  else return [];
}
// console.log(cat([1, 2], [3, 4], [5, 6]));
// console.log(cat([[1, 2], [3, 4], [5, 6]]));
// console.log(cat([[1, 2], [3, 4], [5, 6]], [8, 9]));

function construct(head, tail) { // tail needs to be an array
  return cat([head], _.toArray(tail));
}

function mapcat(fun, coll) {
  return cat.apply(null, _.map(coll, fun));
}

//usage
mapcat(function(e) {
  return construct(e, [","]);
}, [1, 2, 3])
//=> [1, ",", 2, ",", 3, ","]

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


// ch02: Data Thinking
// Table-like Data
const library = [{title: "SICP", isbn: "0262010771", ed: 1},
                {title: "SICP", isbn: "0262510871", ed: 2},
                {title: "Joy of Clojure", isbn: "1935182641", ed: 1}];

// to preserve table-like structure
function project(table, keys) { // keys need to be an array
  return _.map(table, function(obj) {
    return _.pick.apply(null, construct(obj, keys));
  });
}
// usage
const editionResults = project(library, ['title', 'isbn']);
editionResults;
//=> [{isbn: "0262010771", title: "SICP"},
//    {isbn: "0262510871", title: "SICP"},
//    {isbn: "1935182641", title: "Joy of Clojure"}];

const isbnResults = project(editionResults, ['isbn']);

isbnResults;
//=> [{isbn: "0262010771"},{isbn: "0262510871"},{isbn: "1935182641"}]

// we can break that structure and pull out only the desired data:
_.pluck(editionResults, 'isbn');
//=> ["0262010771", "0262510871", "1935182641"]


// fns to work against(on) a table
function rename(obj, newNames) {
  return _.reduce(newNames, function (newObj, newN, oldN)  {
    if (_.has(obj, oldN)) {
      newObj[newN] = obj[oldN]
      return newObj;
    }
    else return newObj;
  },
  _omit.apply(null, construct(obj, _.keys(newNames))));
}
// usage 'a' & a both work
rename({a: 1, b: 2}, {'a': 'AAA'}); //=> {AAA: 1, b: 2}

// using rename to work against the table abstraction:
function as(table, newNames) {
  return _.map(table, function(obj) {
    return rename(obj, newNames);
  });
}
// usage
as(library, {ed: 'edition'});
//=> [{title: "SICP", isbn: "0262010771", edition: 1},
//    {title: "SICP", isbn: "0262510871", edition: 2},
//    {title: "Joy of Clojure", isbn: "1935182641", edition: 1}]

// chaining project & as
project(as(library, {ed: 'edition'}), ['edition']);

// implementing SQL's WHERE, naming restrict
function restrict(table, pred) {
  return _.reduce(table, function(newTable, obj) {
    if(truthy(pred(obj))) return newTable;
    else return _.without(newTable, obj);
  }, table);
}
// usage
restrict(library, function(book) {
  return book.ed > 1;
});
//=> [{title: "SICP", isbn: "0262510871", ed: 2}]

// chaining restrict
restrict(
  project(
    as(library, {ed: 'edition'}),
    ['title', 'isbn', 'edition']),
  function(book) {
    return book.edition > 1;
  }
);
//=> [{title: "SICP", isbn: "0262510871", edition: 2},]