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
  console.log(url);
  const json = await fetch(url).then(res => res.json())

  const dataset = []

  for (var i = 0; i < 20; i++) {
    dataset.push({
      id: json.data.children[i].data.id,
      ups: json.data.children[i].data.ups,
      downs: json.data.children[i].data.downs,
      author: json.data.children[i].data.author,
      created_utc: new Date(json.data.children[i].data.created_utc * 1000),
      num_comments: json.data.children[i].data.num_comments,
      permalink: 'https://www.reddit.com' + json.data.children[i].data.permalink,
      score: json.data.children[i].data.score,
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

  vizType(dataset)
}

function getURL() {
  let subreddit = document.getElementById('subreddit-input').value;
  let sort = document.getElementById('sort-input').value;
  let dateRange = document.getElementById('date-range').value;

  let url = `https://www.reddit.com/r/${subreddit}/${sort}`;
  url += ".json";
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
  } else {
    return thumbnail;
  }
}