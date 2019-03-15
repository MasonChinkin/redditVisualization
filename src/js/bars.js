const d3 = require('d3');

const test = () => {
  d3.select('#test')
    .attr('class', 'test')
    .text('hello');
};

module.exports = test;