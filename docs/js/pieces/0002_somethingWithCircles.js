import {Helpers} from '../lib/helpers.js'

const w = window.innerWidth;
const h = window.innerHeight;

let minRings = 8;
let maxRings = 128;
let count = minRings;
let countPingPong = true;

export default new Helpers.Piece({
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
      circle(w / 2, h / 2, (count - i) * (w / count));
    }
  },
});
