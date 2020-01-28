import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import _ from 'underscore';

function libComparator(x, y) {
  if (x > y) return 1;
  if (x < y) return -1;
  return 0
}
// console.log("Using library implementation of comparator:", [2, 3, -1, -6, 0, -108, 42, 10].sort(libComparator))
// console.log("Checking libComparator(1, 1):" ,libComparator(1, 1))


function lessOrEqual(x, y) {
  return x <= y;
}
// console.log("When we just check for less or equal:", [2, 3, -1, -6, 0, -108, 42, 10].sort(lessOrEqual));
// console.log("Checking less or equal(1, 1):" ,lessOrEqual(1, 1))

function comparator(pred) {
  return function(x, y) {
    if (pred(x, y)) return -1;
    else if (pred(y, x)) return 1;
    return 0;
  }
}
// console.log("Using the comparator function with lessOrEqual:", [2, 3, -1, -6, 0, -108, 42, 10].sort(comparator(lessOrEqual)));

// console.log("passing _.isEqual to the comparator:", comparator(_.isEqual(1, 1)))

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
// console.table(peopleTable);
// console.table(_.rest(peopleTable));

function existy(x) { return x !== null && x !== undefined };
// console.log(existy(undefined));
function truthy(x) { return x !== false && existy(x) };
// console.log(truthy());

const a = [null, undefined, 1, 2, false];
// console.log(a.map(existy));
// console.log(a.map(truthy));


// ch02
// 99 bottles of beer eg
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

// console.log(lyricSegment(9));

// the part that abstracts the assembly from the verse segments
function song(start, end, lyricGen) {
  return _.reduce(_.range(start, end, -1),
    function(acc, n) {
      return acc.concat(lyricGen(n));
  }, []);
}

//using it as:
// console.log(song(99, 0, lyricSegment));
// console.log(_.each);


function cat() {
  var head = _.first(arguments);
  if (existy(head)) return head.concat.apply(head, _.rest(arguments));
  return [];
}
// console.log(cat([1, 2], [3, 4], [5, 6]));
// console.log(cat([[1, 2], [3, 4], [5, 6]]));
// console.log(cat([[1, 2], [3, 4], [5, 6]], [8, 9]));

function construct(head, tail) {
  return cat([head], _.toArray(tail));
}


// ch02: Data Thinking
const books = [{title: "Chthon", author: "Anthony", ie: "01"},
                {title: "Grendel", author: "Gardner", id: "02"},
                {title: "After Dark"}]
// console.log(_.pluck(books, 'author')); //=> ["Anthony", "Gardner", undefined]
// console.log(_.pairs(books)); //=> [[index, {obj}], [i, {obj}], [i, {obj}]

// Table-like data
const library = [{title: "SICP", isbn: "0262010771", ed: 1},
                {title: "SICP", isbn: "0262510871", ed: 2},
                {title: "Joy of Clojure", isbn: "1935182641", ed: 1}];

function project(table, keys) {
  return _.map(table, function(obj) {
    return _.pick.apply(null, construct(obj, keys));
  });
}

function rename(obj, newNames) {
  return _.reduce(newNames, function (newObj, newN, oldN)  {
    if (_.has(obj, oldN)) {
      newObj[newN] = obj[oldN]
      return newObj;
    }
    return newObj;
  },
  _.omit.apply(null, construct(obj, _.keys(newNames))));
}
// usage
// console.log(rename({a: 1, b: 2}, {a: 'AAA'})); //=> {AAA: 1, b: 2}

function as(table, newNames) {
  return _.map(table, function(obj) {
    return rename(obj, newNames);
  });
}
// console.log(project(as(library, {ed: 'edition'}), ['edition']));

function restrict(table, pred) {
  return _.reduce(table, function(newTable, obj) {
    if(truthy(pred(obj))) return newTable;
    else return _.without(newTable, obj);
  }, table);
}

console.log(restrict(
  project(as(library, {ed: 'edition'}),
  ['title', 'isbn', 'edition']),
  function(book) {
    return book.edition > 1;
  }
));




function Title() {
  return (
    <div className="title"><h1>Scratch Pad for Functional JS</h1></div>
  );
}

ReactDOM.render(<Title />, document.getElementById('root'));