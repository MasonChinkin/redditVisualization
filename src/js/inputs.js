import * as d3 from 'd3';

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

export async function visualize(vizType) {
  let url = getURL();
  const json = await fetch(url).then(res => res.json())

  catchErrors(json)

  const dataset = []

  for (var i = 0; i < 20; i++) {
    dataset.push({
      id: json.data.children[i].data.id,
      ups: json.data.children[i].data.ups,
      author: json.data.children[i].data.author,
      created: new Date(json.data.children[i].data.created_utc * 1000),
      numComments: json.data.children[i].data.num_comments,
      permalink: 'https://www.reddit.com' + json.data.children[i].data.permalink,
      subreddit: json.data.children[i].data.subreddit_name_prefixed,
      title: json.data.children[i].data.title,
      url: usableUrl(
        json.data.children[i].data.url,
        (json.data.children[i].data.preview) ? json.data.children[i].data.preview.images[0].source.url : null,
        json.data.children[i].data.thumbnail
      ),
    })
  }

  dataset.sort((a, b) => b.ups - a.ups)

  sessionStorage.setItem('dataset', JSON.stringify(dataset))

  redraw(dataset, vizType)
  window.addEventListener('resize', () => redraw(dataset, vizType))
}

function getURL() {
  let subreddit = document.getElementById('subreddit-input').value;
  let sort = document.getElementById('sort-input').value;
  let dateRange = document.getElementById('date-range').value;

  let url = `https://www.reddit.com/r/${subreddit}/${sort}.json`;
  if (sort === "top") {
    url += `?t=${dateRange}`;
  }

  return url;
}

//function to only include urls that can be previewed (jpgs)
function usableUrl(url, preview, thumbnail) {
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

function redraw(dataset, vizType) {
  d3.select('#visualization')
    .select('svg')
    .remove()

  //remove any previous viz
  vizType(dataset)
}

//clear local storage on input change
export function clearSessionStorage() {
  sessionStorage.removeItem('data')
}

function catchErrors(json) {
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