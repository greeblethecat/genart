import {W, H, Helpers} from '../lib/helpers.js';
import {polygonPoints} from '../lib/geometry.js';

export default new Helpers.Piece({
  setup() {
    background('white');
  },

  draw() {
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
  },
});