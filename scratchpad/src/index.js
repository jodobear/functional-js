import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import _ from 'underscore';

function libComparator(x, y) {
  if (x > y) return 1;
  if (x < y) return -1;
  return 0
};
console.log("Using library implementation of comparator:", [2, 3, -1, -6, 0, -108, 42, 10].sort(libComparator))
console.log("Checking libComparator(1, 1):" ,libComparator(1, 1))


function lessOrEqual(x, y) {
  return x <= y;
};
console.log("When we just check for less or equal:", [2, 3, -1, -6, 0, -108, 42, 10].sort(lessOrEqual));
console.log("Checking less or equal(1, 1):" ,lessOrEqual(1, 1))

function comparator(pred) {
  return function(x, y) {
    if (pred(x, y)) return -1;
    else if (pred(y, x)) return 1;
    return 0;
  };
};
console.log("Using the comparator function with lessOrEqual:", [2, 3, -1, -6, 0, -108, 42, 10].sort(comparator(lessOrEqual)));

console.log("passing _.isEqual to the comparator:", comparator(_.isEqual(1, 1)))

function Title() {
  return (
    <div className="title"><h1>Scratch Pad for Functional JS</h1></div>
  )
}

ReactDOM.render(<Title />, document.getElementById('root'));