import {Helpers, W, H} from '../lib/p5/helpers.js'

let minRings = 8;
let maxRings = 128;
let count = minRings;
let countPingPong = true;

export default new Helpers.P5Piece({
  setup() {
  },

  draw() {
    background(0, 0, 0);
    let fromColor = color(0, 0, 255);
    let toColor = color(255, 0, 0); // center of orb
    if (countPingPong) {
      count++;
      if (count > maxRings) {
        countPingPong = false;
      }
    } else {
      count--;
      if (count <= minRings) {
        countPingPong = true;
      }
    }
    for (let i = 0; i < count; i++) {
      let color = lerpColor(fromColor, toColor, i / (count - 1));
      fill(color);
      stroke('black');
      circle(W / 2, H / 2, (count - i) * (W / count));
    }
  },
});
