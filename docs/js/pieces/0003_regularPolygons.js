import { Helpers } from '../lib/utils.js';

const W = window.innerWidth;
const H = window.innerHeight;

window.setup = () => {
  createCanvas(W, H);
  background('white');
};

window.draw = () => {
  let levels = 32;
  for (let sides = 3; sides < levels; sides++) {
    let polygonPoints = Helpers.polygonPoints(sides,10*sides, { x: W/2, y: H/2});
    let prevPoint = polygonPoints.at(-1)
    polygonPoints.forEach(p => {
      strokeWeight(lerp(10, 0, sides/levels));
      line(prevPoint.x, prevPoint.y, p.x, p.y);
      prevPoint = p;
    });
  }
};