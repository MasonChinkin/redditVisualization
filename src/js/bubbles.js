import * as d3 from 'd3'
import {
  barMouseMove,
  barMouseOut
} from './tooltip'
import {
  interactionTips
} from './utils';

export function drawBubbles(dataset) {
  let w = visualization.offsetWidth - 10,
    h = visualization.offsetHeight - 10,
    margin = {
      right: 5,
      left: 5,
      top: 5,
      bottom: 5
    },
    nodePadding = 1.5;

  const upsFormat = d3.format('.2s')

  // force
  let force = 0.1

  let svg = d3.select("#visualization")
    .append("svg")
    .attr('id', 'canvas')
    .attr("width", w)
    .attr("height", h);

  let color = d3.scaleOrdinal(['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd', '#ccebc5', '#ffed6f']);

  // range/scale
  let radiusScale = d3.scaleSqrt()
    .domain([0, d3.max(dataset, d => d.ups)])
    .range([6, h / 9]) // 6 for minimum size

  let simulation = d3.forceSimulation()
    .force("forceX", d3.forceX().strength(force).x(w * 0.5))
    .force("forceY", d3.forceY().strength(force).y(h * 0.5))
    .force("center", d3.forceCenter().x(w * 0.4).y(h * 0.5))
    .force("charge", d3.forceManyBody().strength(-30));

  // sort the nodes so that the bigger ones are at the back
  dataset = dataset.sort((a, b) => b.ups - a.ups);

  let node = svg.append("g")
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("class", "bubble")
    .attr("r", d => radiusScale(d.ups))
    .attr("fill", d => color(d.id))
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .on('click', d => window.open(d.permalink))
    .on('mousemove', barMouseMove)
    .on('mouseout', barMouseOut)
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

  //update the simulation based on the data
  simulation
    .nodes(dataset)
    .force("collide", d3.forceCollide().strength(.5).radius(d => radiusScale(d.ups) + nodePadding).iterations(1))
    .on("tick", d => {
      node.attr("cx", d => d.x)
        .attr("cy", d => d.y)
    })

  // radius
  let maxUps = d3.max(dataset, d => d.ups)
  let minUps = d3.min(dataset, d => d.ups)
  let legendData = [maxUps, (maxUps + minUps) / 2, minUps]


  let legendCircle = svg.selectAll(".legend-circle")
    .data(legendData)
    .enter()
    .append("circle")
    .attr("class", "legend-circle")
    .attr("cy", (d, i) => {
      let offset;
      if (i === 0) offset = maxUps;
      if (i === 1) offset = (legendData[1] + legendData[0]) / 2
      if (i === 2) offset = (legendData[2] + legendData[0]) / 2
      return (h * 0.85) - ((radiusScale(offset) * 2) * i)
    })
    .attr("cx", d => w - radiusScale(legendData[0]) - 10)
    .attr("r", d => radiusScale(d))

  // legend header
  svg.append('text')
    .attr('class', 'legend-header')
    .attr('transform', `translate(
      ${w - radiusScale(legendData[0]) - 10},
      ${(h * 0.85) - (radiusScale(legendData[0]) + radiusScale(legendData[1]) + radiusScale(legendData[2])) * 2 + 20}
      )`) //Im not proud of myself for this one
    .text('Upvotes')

  // legend labels
  legendData.forEach((label, i) => {
    let offset;
    if (i === 0) offset = maxUps;
    if (i === 1) offset = (legendData[1] + legendData[0]) / 2
    if (i === 2) offset = (legendData[2] + legendData[0]) / 2

    let labelY = (h * 0.85) - ((radiusScale(offset) * 2) * i) + 3
    let labelX = w - radiusScale(legendData[0]) - 10
    svg.append('text')
      .attr('class', 'legend-label')
      .attr('transform', `translate(${labelX},${labelY})`)
      .text((label < 10) ? label : upsFormat(label))
  })

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(.03).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(.03);
    d.fx = null;
    d.fy = null;
  }

  highlightBubbleButton();
  interactionTips('Drag, hover, and click!')
}

function highlightBubbleButton() {
  d3.select('#bar-button')
    .style('filter', 'none')

  d3.select('#bubble-button')
    .style('filter', 'brightness(85%)')

  d3.select('#scatter-button')
    .style('filter', 'none')
}