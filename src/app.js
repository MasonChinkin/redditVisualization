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
import {
  drawBubbles
} from './js/bubbles';
import {
  drawScatter
} from './js/scatter';

document.addEventListener("DOMContentLoaded", () => {
  d3.selectAll('.suggestion-list-item')
    .on('click', useSuggestion);

  d3.select('#sort-input')
    .on('change', dateRangeNeeded);

  d3.select('.submit')
    .on('click', () => visualize(drawBars));

  d3.select('#bar-button')
    .on('click', () => visualize(drawBars))

  d3.select('#bubble-button')
    .on('click', () => visualize(drawBubbles))

  d3.select('#scatter-button')
    .on('click', () => visualize(drawScatter))
});