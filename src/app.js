import './app.scss';
import "@babel/polyfill";
import * as d3 from 'd3';
import {
  visualize
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
import {
  useSuggestion,
  dateRangeNeeded
} from './js/utils';

sessionStorage.clear();
document.addEventListener("DOMContentLoaded", () => {
  d3.selectAll('.suggestion-list-item')
    .on('click', useSuggestion)

  document.querySelectorAll('.clear-local').forEach(function (el) {
    el.addEventListener('change', () => sessionStorage.clear())
  })

  d3.select('#subreddit-input')
    .on('change', () => sessionStorage.clear())
    .on('blur', () => sessionStorage.clear()) // change isn't triggering consistently for some reason

  d3.select('#sort-input')
    .on('change', dateRangeNeeded);

  d3.select('.submit')
    .on('click', () => visualize(drawBars));

  d3.select('#bar-button')
    .on('click', () => visualize(drawBars));

  d3.select('#bubble-button')
    .on('click', () => visualize(drawBubbles));

  d3.select('#scatter-button')
    .on('click', () => visualize(drawScatter));
});