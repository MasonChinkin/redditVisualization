import './app.scss';
import * as d3 from 'd3';
import {
  useSuggestion,
  visualize,
  dateRangeNeeded
} from './js/inputs';
import {
  drawBars
} from './js/bars';

document.addEventListener("DOMContentLoaded", () => {
  d3.selectAll('.suggestion-list-item')
    .on('click', useSuggestion);

  d3.select('.submit')
    .on('click', () => visualize(drawBars));

  d3.select('#sort-input')
    .on('change', dateRangeNeeded);
});