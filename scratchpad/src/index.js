import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import _ from 'underscore';

function libComparator(x, y) {
  if (x > y) return 1;
  if (x < y) return -1;
  return 0
}
console.log("Using library implementation of comparator:", [2, 3, -1, -6, 0, -108, 42, 10].sort(libComparator))
console.log("Checking libComparator(1, 1):" ,libComparator(1, 1))


function lessOrEqual(x, y) {
  return x <= y;
}
console.log("When we just check for less or equal:", [2, 3, -1, -6, 0, -108, 42, 10].sort(lessOrEqual));
console.log("Checking less or equal(1, 1):" ,lessOrEqual(1, 1))

function comparator(pred) {
  return function(x, y) {
    if (pred(x, y)) return -1;
    else if (pred(y, x)) return 1;
    return 0;
  }
}
console.log("Using the comparator function with lessOrEqual:", [2, 3, -1, -6, 0, -108, 42, 10].sort(comparator(lessOrEqual)));

console.log("passing _.isEqual to the comparator:", comparator(_.isEqual(1, 1)))

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
console.table(_.rest(peopleTable));

function existy(x) { return x !== null && x !== undefined };
console.log(existy(undefined));
function truthy(x) { return x !== false && existy(x) };
console.log(truthy());

const a = [null, undefined, 1, 2, false];
console.log(a.map(existy));
console.log(a.map(truthy));


function Title() {
  return (
    <div className="title"><h1>Scratch Pad for Functional JS</h1></div>
  );
}

ReactDOM.render(<Title />, document.getElementById('root'));