function toCircle(dataset) {
  var rScale = d3.scaleSqrt()
    .domain([0, d3.max(dataset, d => d.ups)])
    .range([0, 50])

  dataset.forEach(d => d.radius = rScale(d.ups))

  bars.attr("rx", d => d.radius / 2)
    .attr("ry", d => d.radius / 2)
}