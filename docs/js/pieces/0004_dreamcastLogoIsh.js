import {W, H, Helpers} from '../lib/helpers.js';

let shapeSpiral = [];
export default new Helpers.Piece({
  setup() {
    background(0);
    let c1 = color('red');
    let c2 = color('black');
    let count = 970;
    shapeSpiral = [...Array(count).keys()].map(i => {
      return () => {
        push();
        let R = i / 4;
        fill(c1);
        stroke(c1);
        scale(1);
        translate(R * cos(i), R * sin(i));
        circle(0, 0, 20);
        point(0, 0);
        pop();
      };
    });
  },

  draw() {
    clear();
    background('black');
    translate(W / 2, H / 2);
    rotate(90)
    shapeSpiral.slice(50).forEach(shape => shape());
  }
})