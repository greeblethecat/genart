import { W, H} from '../lib/helpers.js';
import {polygonPoints} from '../lib/geometry';

window.setup = () => {
  createCanvas(W, H);
  background('white');
};

window.draw = () => {
  let levels = 32;
  for (let sides = 3; sides < levels; sides++) {
    let points = polygonPoints(sides,10*sides, { x: W/2, y: H/2});
    let prevPoint = points.at(-1)
    points.forEach(p => {
      strokeWeight(lerp(10, 0, sides/levels));
      line(prevPoint.x, prevPoint.y, p.x, p.y);
      prevPoint = p;
    });
  }
};