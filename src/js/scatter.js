import * as d3 from 'd3';
import {
  barMouseMove,
  barMouseOut
} from './tooltip';

export function drawScatter(dataset) {

  console.log(dataset);
  // quick fix for stickied posts destroying time scale
  dataset = dataset.filter(post => !post.title.includes('Reminder'))
  dataset = dataset.filter(post => !post.title.includes('Rule'))
  dataset = dataset.filter(post => !post.title.includes('rule'))

  //BOX
  const w = visualization.offsetWidth
  const h = visualization.offsetHeight
  const margin = 60

  const upsFormat = d3.format('.2s')

  //DEFINE SCALES
  const xScale = d3.scaleTime()
    .domain([d3.min(dataset, d => new Date(d.createdString)), new Date()])
    .range([margin, w - margin - 20])

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, d => d.numComments)])
    .range([h - margin, margin])

  const radiusScale = d3.scaleSqrt()
    .domain([0, d3.max(dataset, d => d.ups)])
    .range([5, 30])

  let color = d3.scaleOrdinal(['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928'])

  //DEFINE AXES
  const xaxis = d3.axisBottom()
    .scale(xScale)
    .ticks(6)

  const yaxis = d3.axisLeft()
    .scale(yScale)

  const svg = d3.select('#visualization')
    .append('svg')
    .attr('width', w)
    .attr('height', h)

  //CLIPPING PATH
  svg.append('clipPath')
    .attr('id', 'chart-area')
    .append('rect')
    .attr('x', margin)
    .attr('y', 0)
    .attr('width', w - margin)
    .attr('height', h - margin)

  //CIRCLES
  svg.append('g')
    .attr('clip-path', 'url(#chart-area)')
    .selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle')
    .attr('class', 'bubble')
    .attr('fill', d => color(d.id))
    .attr('cx', d => xScale(new Date(d.createdString)))
    .attr('cy', d => yScale(d.numComments))
    .attr('r', d => radiusScale(d.ups))
    .on('click', d => window.open(d.permalink))
    .on('mousemove', barMouseMove)
    .on('mouseout', barMouseOut)

  //GENERATE AXES
  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + (h - margin) + ')')
    .call(xaxis)

  svg.append('g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(' + margin + ', 0)')
    .call(yaxis)

  //y axis
  svg.append('text')
    .text('Number of comments')
    .attr('class', 'yAxis')
    .attr('transform', `translate(${margin * 0.35},${h * 0.6}) rotate(-90)`)

  //x axis
  svg.append('text')
    .text('Date posted')
    .attr('class', 'yAxis')
    .attr('transform', `translate(${w * 0.45},${h - margin * 0.25})`)

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

  highlightScatterButton();
}

function highlightScatterButton() {
  d3.select('#bar-button')
    .style('filter', 'none')

  d3.select('#bubble-button')
    .style('filter', 'none')

  d3.select('#scatter-button')
    .style('filter', 'brightness(85%)')
}