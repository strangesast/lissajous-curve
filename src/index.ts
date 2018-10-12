import * as d3 from 'd3';

const body = d3.select(document.body);

const canvas1 = body.append('canvas');
const canvas2 = body.append('canvas');

const width = 500, height = 500;
canvas1.attr('width', width).attr('height', height);
canvas2.attr('width', width).attr('height', height);

const ctx1 = (canvas1.node() as HTMLCanvasElement).getContext('2d');
const ctx2 = (canvas2.node() as HTMLCanvasElement).getContext('2d');

const nCircles = 5;

const pad = 5;
const [w, h] = [(width - 2 * pad) / (nCircles + 1), (height - 2 * pad) / (nCircles + 1)];
const circlePadding = 20;
const rBig = (width - nCircles * circlePadding - 2 * pad) / 2 / (nCircles + 1);
const rSmall = rBig / 5;
const rSmallWidth = 2;

ctx1.translate(pad, pad);
ctx2.translate(pad, pad);

const colorScale = ['yellow', 'green', 'blue', 'purple', 'red'];

function drawCircle(x: number, y: number, color = 'white', position = 0) {
  ctx1.beginPath();
  ctx1.strokeStyle = color;
  ctx1.lineWidth = 4;
  ctx1.arc(x, y, rBig, 0, Math.PI * 2);
  ctx1.stroke();
  ctx1.save();
  ctx1.beginPath();
  ctx1.translate(x, y);
  ctx1.rotate(position);
  ctx1.translate(rBig, 0);
  ctx1.arc(0, 0, rSmall, 0, Math.PI * 2);
  ctx1.fillStyle = 'black';
  ctx1.fill();
  ctx1.beginPath();
  ctx1.arc(0, 0, rSmall - rSmallWidth, 0, Math.PI * 2);
  ctx1.fillStyle = 'white';
  ctx1.fill();
  ctx1.restore();
}

function drawGrid(x: number, y: number, rot: number) {
  const [dx, dy] = [x + Math.cos(rot) * rBig, y + Math.sin(rot) * rBig];
  ctx1.save();
  ctx1.beginPath();
  ctx1.lineWidth = 1;
  ctx1.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx1.setLineDash([4, 4]);
  ctx1.moveTo(dx, 0);
  ctx1.lineTo(dx, height);
  ctx1.stroke();
  ctx1.beginPath();
  ctx1.moveTo(0, dy);
  ctx1.lineTo(width, dy);
  ctx1.stroke();
  ctx1.restore();
}

function drawCircles(percent: number) {
  ctx1.clearRect(0, 0, width, height);
  for (let i = 1; i < nCircles + 1; i++) {
    const x = i * w;
    const y = i * w;
    const rot = -percent * Math.PI * 2 * i;
    const color = colorScale[i - 1];
    drawCircle(rBig + x + circlePadding / 2, rBig + circlePadding / 2, color, rot);
    drawCircle(rBig + circlePadding / 2, rBig + y + circlePadding / 2, color, rot);
    drawGrid(rBig + x + circlePadding / 2, rBig + y + circlePadding / 2, rot);
  }
}

var lastPercent = 0;
function drawPatterns(percent: number) {
  if (percent < lastPercent) {
    ctx2.clearRect(0, 0, width, height);
  }
  for (let i = 1; i < nCircles + 1; i++) {
    for (let j = 1; j < nCircles + 1; j++) {
      const x = rBig + i * w + circlePadding / 2;
      const y = rBig + j * w + circlePadding / 2;
      const rot1 = -percent * Math.PI * 2 * i;
      const rot2 = -percent * Math.PI * 2 * j;
      const [dx, dy] = [x + Math.cos(rot1) * rBig, y + Math.sin(rot2) * rBig];
      ctx2.beginPath();
      ctx2.fillStyle = 'white';
      ctx2.arc(dx, dy, 1, 0, Math.PI * 2);
      ctx2.fill();
    }
  }
  lastPercent = percent;
}

var start: number;
const period = 10 * 1000; // ten seconds

function step(ts: number) {
  if (!start) start = ts;
  const progress = (ts - start) % period / period;
  drawCircles(progress);
  drawPatterns(progress);

  window.requestAnimationFrame(step);
}

window.requestAnimationFrame(step);
