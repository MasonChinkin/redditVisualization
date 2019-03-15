import * as d3 from 'd3';

//number/date formats
const upsFormat = d3.format('.2s')
const postTimeFormat = d3.timeFormat('%B %d %I:%M%p')

//properties of mousemove
export const barMouseMove = function (d) {

  d3.select('#Subreddit')
    .text(d.subreddit)

  d3.select('#Title')
    .text(d.title)

  d3.select('#Posted')
    .text(postTimeFormat(d.created_utc))

  d3.select('#Upvotes')
    .text(upsFormat(d.ups))

  if (d.url) {
    d3.select('#pic')
      .attr('src', d.url)
      .attr('class', '')
  } else {
    d3.select('#pic')
      .attr('src', 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg')
      .attr('class', 'no-image')
  }

  const tooltipHeight = document.getElementById('tooltip')
    .getBoundingClientRect().height;

  const xpos = d3.event.offsetX;
  const ypos = d3.event.offsetY - tooltipHeight;

  //Show the tooltip and update position
  d3.select('#tooltip')
    .classed('hidden', false)
    .style('left', xpos + 'px')
    .style('top', ypos + 'px')

  if (tooltipHeight === 0) {
    d3.select('#tooltip').style('visibility', 'hidden')
  } else {
    d3.select('#tooltip').style('visibility', 'visible')
  }
}

//properties of mouseout
export const barMouseOut = function (d) {
  d3.select('#pic')
    .attr('src', '')

  // Hide the tooltip
  d3.select('#tooltip').classed('hidden', true)
}