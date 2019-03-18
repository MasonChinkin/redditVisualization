import * as d3 from 'd3'
import {
  barMouseMove,
  barMouseOut
} from './tooltip'

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
    .force("center", d3.forceCenter().x(w * 0.4).y(h * 0.45))
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
    .attr("cx", (d, i) => {
      let offset;
      if (i === 0) offset = maxUps;
      if (i === 1) offset = (legendData[1] + legendData[0]) / 2
      if (i === 2) offset = (legendData[2] + legendData[0]) / 2
      return (w * 0.9) - (radiusScale(offset) * 2) * i
    })
    .attr("cy", d => h - radiusScale(d) - 1)
    .attr("r", d => radiusScale(d))

  // legend header
  svg.append('text')
    .attr('class', 'legend-header')
    .attr('transform', `translate(${w * 0.9},${h - (radiusScale(legendData[0]) * 2) - 20})`)
    .text('Upvotes')

  // legend labels
  legendData.forEach((label, i) => {
    let offset;
    if (i === 0) offset = maxUps;
    if (i === 1) offset = (legendData[1] + legendData[0]) / 2
    if (i === 2) offset = (legendData[2] + legendData[0]) / 2

    let labelY = h - radiusScale(label) + 3
    let labelX = (w * 0.9) - (radiusScale(offset) * 2) * i
    svg.append('text')
      .attr('class', 'legend-label')
      // .attr('transform', `translate(${w * 0.9},${(h * 0.6) - radiusScale(legendData[0])}`)
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
}

function highlightBubbleButton() {
  d3.select('#bar-button')
    .style('filter', 'none')

  d3.select('#bubble-button')
    .style('filter', 'brightness(85%)')

  d3.select('#scatter-button')
    .style('filter', 'none')
}