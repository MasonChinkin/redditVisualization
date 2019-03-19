import {
  usableUrl,
  catchErrors,
  redraw
} from "./utils";

export async function visualize(vizType) {
  let dataset;
  if (!sessionStorage.getItem('dataset')) {
    let url = getURL();
    const json = await fetch(url).then(res => res.json())
    catchErrors(json)
    dataset = []

    for (var i = 0; i < 20; i++) {
      dataset.push({
        id: json.data.children[i].data.id,
        ups: json.data.children[i].data.ups,
        author: json.data.children[i].data.author,
        createdString: new Date(json.data.children[i].data.created_utc * 1000).toString(),
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
  } else {
    dataset = JSON.parse(sessionStorage.getItem('dataset'))
  }


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