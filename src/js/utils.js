import * as d3 from 'd3';

//function to only include urls that can be previewed (jpgs)
export function usableUrl(url, preview, thumbnail) {
  let unencoded;
  if (preview) {
    unencoded = preview.split('&amp;').join('&');
  }

  if (url.endsWith('.jpg') || url.endsWith('.png') || url.endsWith('.gif')) {
    return url;
  } else if (preview) {
    return unencoded;
  } else if (thumbnail) {
    return thumbnail;
  } else {
    return null;
  }
}

export function redraw(dataset, vizType) {
  d3.select('#visualization')
    .select('svg')
    .remove()

  //remove any previous viz
  vizType(dataset)
}

export function catchErrors(json) {
  let sort = document.getElementById('sort-input')

  // error catching
  if (json.error) {
    if (sort.value === "Sort") {
      sort.style.border = '1px solid red'
      setTimeout(() => alert('Select a sorting type!'), 0) // setTimeout so red border renders before alert
    } else {
      setTimeout(() => alert('Subreddit not found!'), 0) // setTimeout so red border renders before alert
    }
  }

  if (json.error) return;

  sort.style.border = '0';
}

export function subredditNotFound() {
  let subreddit = document.getElementById('subreddit-input');
  subreddit.style.border = '1px solid red';

  setTimeout(() => alert('Subreddit not found!'), 0) // setTimeout so red border renders before alert
}

export function useSuggestion() {
  let val = this.innerHTML;
  let input = document.getElementById('subreddit-input');

  input.value = val;
  sessionStorage.clear() // onchange isn't triggering consistenty in #subreddit-input
}

export function dateRangeNeeded() {
  let dateRangeInput = document.getElementById('date-range')
  let sortVal = document.getElementById('sort-input').value

  dateRangeInput.disabled = (sortVal === "top") ? false : true
}

export function interactionTips(tipText) {
  d3.select('#canvas')
    .append('text')
    .attr('x', visualization.offsetWidth * 0.5)
    .attr('y', visualization.offsetHeight * 0.04)
    .text(tipText)
    .attr('class', 'interaction-tips')
}