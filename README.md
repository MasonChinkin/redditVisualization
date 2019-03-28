# Live Reddit Visualization

[Live Demo](https://masonchinkin.github.io/redditVisualization/)

This project is meant to highlight vanilla JavaScript skills without the help of React/Redux. I decided to have some fun visualizing the JSON data one can fetch by putting '.json' at the end of most reddit URLs ([example](https://www.reddit.com/hot.json))

## Technologies
* DOM manipulation with vanilla javascript and d3
* Dynamic d3 visualizations that resize with window resize
* sessionStorage used to persist data across visualizations
* Coming soon- animated loading icon and transitions between visualization type

## Highlights

### async data fetch
Making an async data fetch using a url constructed from use input.

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

  let url = `https://www.reddit.com/r/${subreddit}/${sort}.json`;
  if (sort === "top") {
    url += `?t=${dateRange}`;
  }

  return url;
}
```

### Keep tooltip onscreen with d3.event turnary
```javascript
// flips tooltip to other side of mouse at the middle of browser window
const xpos = (d3.event.clientX > d3.event.view.innerWidth / 2) ? d3.event.offsetX - tooltipWidth : d3.event.offsetX;
const ypos = (d3.event.clientY > d3.event.view.innerHeight / 2) ? d3.event.offsetY - tooltipHeight : d3.event.offsetY;

//Show the tooltip and update position
d3.select('#tooltip')
  .classed('hidden', false)
  .style('left', xpos + 'px')
  .style('top', ypos + 'px')
```

### Clean UI/UX
The form is designed to be extremely easy to use.

![](https://github.com/MasonChinkin/redditVisualization/blob/master/dist/ui.gif?raw=true)
