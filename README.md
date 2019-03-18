# Live Reddit Visualization

This project is meant to highlight vanilla JavaScript skills without the help of React/Redux. I decided to have some fun visualizing the json data one can fetch by putting '.json' at the end of most reddit URLs ([example](https://www.reddit.com/hot.json))

## Features
* Visualize subreddit posts as bars, bubbles, or a scatterplot
* Preview posts on hover and go to them on click
* Coming soon- animated transitions between visualization type

## Highlights

### async data fetch
Making an async data fetch using a url constructed from the form data.

```javascript
export async function visualize(vizType) {
  let url = getURL();
  const json = await fetch(url).then(res => res.json());

  // error catching
  ...

  const dataset = [];

  for (var i = 0; i < 20; i++) {
    dataset.push({
    ...
    })
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
```

### Clean UI/UX
The form is designed to be extremely easy to use.

![](https://github.com/MasonChinkin/redditVisualization/blob/master/dist/ui.gif?raw=true)
