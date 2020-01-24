// A collection of functions that we saw in the book

// ch01:

// Functions as units of abstractions:
// debug message functions
function fail(thing) {
  throw new Error(thing);
}
function warn(thing) {
  console.log(["WARNING:", thing].join(' '));
}
function note(thing) {
  console.log(["NOTE:", thing].join(' '));
}

// Functions as units of behavior:
// finding nth of some data
function nth(data, index) {
  if (!_.isNumber(index)) fail("Expected number a index.");
  if (!_.isIndexed(data)) fail("Expected an array or string");
  if (index < 0 || index > data.length - 1) fail("Index out of bounds.");
  return data[index];
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
    return 0;
  }
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
  return _.reduce(str.split('\n'),
                  function(table, row) {
                    table.push(_.map(row.split(','),
                  function(col) {
                    return col.trim()
                  }));
    return table;
  }, [])
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
  return _.rest(_.map(table, function(row) {
    return nth(row, 2);
  }));
}

const mergeResults = _.zip;
console.table(mergeResults(selectNames(peopleTable),
                          selectHair(peopleTable)));
//=> [["Merble", "35"], ["Bob", "64"]]

// extremely useful general functions
// existy: distinguishes between null and undefined, and everything else.
// function existy(x) { return x != null };  // as in book gives true for undefined. Had to add the following condition.
function existy(x) { return x != null || x !== undefined };
// usage
existy(null); //=> false

existy(undefined); //=> false

existy({}.notHere); //=> false

existy((function(){})()); //=> false

existy(0); //=> true

existy(false); //=> true

// truthy: if something should be considered a synonym for true.
function truthy(x) { return x != false && existy(x) };
// usage
truthy(false); //=> false

truthy(undefined); //=> false

truthy(0); //=> true

truthy(''); //=> true // why??

truthy(); //=> true  // why??

// using these over an array
const a = [null, undefined, 1, 2, false];
a.map(existy);
a.map(truthy);