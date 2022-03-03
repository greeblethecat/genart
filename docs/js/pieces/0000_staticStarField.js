import {Helpers} from '../lib/helpers.js';

const w = window.innerWidth;
const h = window.innerHeight;

function drawStar(posx, posy, size, color = 'white') {
  stroke(color);
  strokeWeight(size);
  point(posx, posy);
}

export default new Helpers.Piece({
  setup() {
    createCanvas(w, h);
    noLoop(); // causes draw to be called only once
  },
  draw() {
    background(0, 0, 0);
    for (let i = 0; i < (w * h) * 0.003125; i++) {
      drawStar(Math.random() * w, Math.random() * h, Math.random() * 2.5);
    }
  }
});