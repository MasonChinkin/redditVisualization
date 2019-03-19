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
  let subreddit = document.getElementById('subreddit-input');
  let sort = document.getElementById('sort-input')

  // error catching
  if (json.error) {

    subreddit.style.border = '1px solid red';
    if (sort.value === "Sort") {
      sort.style.border = '1px solid red'
      setTimeout(() => alert('Select a sorting type!'), 0) // setTimeout so red border renders before alert
    } else {
      setTimeout(() => alert('Subreddit not found!'), 0) // setTimeout so red border renders before alert
    }
  }

  if (json.error) return;

  subreddit.style.border = '0';
  sort.style.border = '0';
}

export function useSuggestion() {
  let val = this.innerHTML;
  let input = document.getElementById('subreddit-input');

  input.value = val;
}

export function dateRangeNeeded() {
  let dateRangeInput = document.getElementById('date-range')
  let sortVal = document.getElementById('sort-input').value

  dateRangeInput.disabled = (sortVal === "top") ? false : true
}