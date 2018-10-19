import * as d3 from 'd3';
const svg = d3.select(document.body).append('svg').attr('width', 600).attr('height', 600);

const nCircles = 5;
const colorScale = ['yellow', 'green', 'blue', 'purple', 'red'];
const circles = Array.from(Array(nCircles), (_, index) => ({rate: (index + 1) / 2 / 10000, index, color: colorScale[index]}));

const {width, height} = (svg.node() as HTMLElement).getBoundingClientRect();

const circleWidth = Math.min(width, height) / (nCircles + 1);
const circlePadding = circleWidth / 10;
const radius = (circleWidth - circlePadding * 2) / 2;
const [r0, r1] = [circleWidth / 2, radius];
const circleStrokeWidth = radius / 10;

const controlData = [
  circles.map((circle, i) => ({circle, x: (i + 1) * circleWidth, y: 0})),
  circles.map((circle, i) => ({circle, x: 0, y: (i + 1) * circleWidth})),
];

let axis = svg.selectAll('g.axis').data(controlData);
const axisEnter = axis.enter()
  .append('g')
  .classed('axis', true);

axis = axisEnter.merge(axis);

let axisCircles = axis.selectAll('g.circle');
const axisCirclesEnter = axisCircles.data((d: any[]) => d, d => d.index)
  .enter()
  .append('g')
  .classed('circle', true)
  .attr('transform', d => `translate(${d.x},${d.y})`);

axisCirclesEnter
  .append('circle')
  .attr('stroke-width', circleStrokeWidth)
  .attr('stroke', d => d.circle.color)
  .attr('cx', circleWidth / 2)
  .attr('cy', circleWidth / 2)
  .attr('r', radius);

axisCirclesEnter
  .append('g')
  .classed('position', true)
  .attr('transform', d => `translate(${circleWidth / 2},${circleWidth / 2}) rotate(0) translate(${radius},0)`)
  .append('circle')
  .attr('r', radius / 6)
  .attr('stroke-width', circleStrokeWidth)
  .attr('stroke', 'black')
  .attr('fill', 'white');

axisCircles = axisCirclesEnter.merge(axisCircles);

function animate(sel) {
  const [r0, r1] = [circleWidth / 2, radius];

  function apply() {
    sel.attr('transform', `translate(${r0},${r0}) rotate(0) translate(${r1},0)`)
      .transition()
      .ease(d3.easeLinear)
      .duration(d => {
        const duration = 10000 * Math.PI * 2 / d.circle.rate;
        return duration;
      })
      .attrTween('transform', d => t => `translate(${r0},${r0}) rotate(${t * 360}) translate(${r1},0)`)
      .on('end', apply)
  }
  apply();
}

function circleTween (t) {
  return `translate(${r0},${r0}) rotate(${t * 360}) translate(${r1},0)`;
}

axis.selectAll('g.circle').select('.position').transition().ease(d3.easeLinear).on('start', function animate() {
  d3.active(this).transition()
    .duration((d: any) => 1 / d.circle.rate)
    .attrTween('transform', d => circleTween)
    .on('end', animate);
});
