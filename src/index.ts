import * as d3 from 'd3';
const svg = d3.select(document.body).append('svg');

const nCircles = 5;
const colorScale = ['yellow', 'green', 'blue', 'purple', 'red'];
const circles = Array.from(Array(nCircles), (_, index) => ({index, color: colorScale[index]}));

const controlData = [
  circles.map((circle, i) => ({circle, x: i, y: 0})),
  circles.map((circle, i) => ({circle, x: 0, y: i})),
];

let axis = svg.selectAll('g.axis');
const axisEnter = axis.data(controlData).enter()
  .append('g')
  .classed('axis', true)

axis = axisEnter.merge(axis);

let axisCircles = axis.selectAll('g.circle');
const axisCirclesEnter = axisCircles.data((d: any[]) => d)
  .enter()
  .append('g')
  .classed('circle', true)

axisCirclesEnter
  .append('circle')

axisCircles = axisCirclesEnter.merge(axisCircles);
