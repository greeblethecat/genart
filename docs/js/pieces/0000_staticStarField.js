import {Helpers, W, H} from '../lib/p5/helpers.js';

function drawStar(posx, posy, size, color = 'white') {
  stroke(color);
  strokeWeight(size);
  point(posx, posy);
}

export default new Helpers.P5Piece({
  setup() {
    createCanvas(W, H);
    noLoop(); // causes draw to be called only once
  },
  draw() {
    background(0, 0, 0);
    for (let i = 0; i < (W * H) * 0.003125; i++) {
      drawStar(Math.random() * W, Math.random() * H, Math.random() * 2.5);
    }
  }
});