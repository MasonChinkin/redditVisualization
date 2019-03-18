import * as d3 from 'd3';
import {
  barMouseMove,
  barMouseOut
} from './tooltip';

export function drawScatter(dataset) {
  //BOX
  const w = visualization.offsetWidth
  const h = visualization.offsetHeight
  const margin = 40

  //DEFINE SCALES
  const xScale = d3.scaleTime()
    .domain([d3.min(dataset, d => d.created), new Date()])
    .range([margin, w - margin])

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, d => d.numComments)])
    .range([h - margin, margin])

  const radiusScale = d3.scaleSqrt()
    .domain([0, d3.max(dataset, d => d.ups)])
    .range([2, 25])

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
    .attr('cx', d => {
      console.log(d.created);
      return xScale(d.created)
    })
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