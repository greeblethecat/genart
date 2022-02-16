import {W, H} from '../lib/utils.js';

let shapeSpiral = [];
window.setup = () => {
  createCanvas(W, H);
  angleMode(DEGREES);
  background(0);
  let c1 = color('red');
  let c2 = color('black');
  let count = 970;
  shapeSpiral = [...Array(count).keys()].map(i => {
    return () => {
      push();
      let R = i/4;
      //let c = lerpColor(c1, c2, i / count);
      fill(c1);
      stroke(c1);
      scale(1);
      translate(R * cos(i), R * sin(i));
      circle(0, 0, 20);
      point(0, 0);
      pop();
    };
  });
};

window.draw = () => {
  clear();
  background('black');
  translate(W / 2, H / 2);
  rotate(90)
  shapeSpiral.slice(50).forEach(shape => shape());
};