import {H, W, Helpers} from '../lib/helpers.js';
import {colors} from '../lib/colors.js';
import {Transform} from '../lib/transform.js';
import {polygonPoints} from '../lib/geometry.js';

export default new Helpers.Piece(() => {
  Helpers.setupP5();

  colors.setup('pear36');
  colors.Background = colors.purple;
  background(colors.Background);

  function createClock(x, y, size=200) {
    const clock = new Transform({x: x, y: y});
    const hoursLength = size;
    const handWidth = 15/200 * size;
    const pivotOffset = handWidth*3;
    const hours = new Transform({
      parent: clock,
      length: hoursLength,
      rotation: random() * 360,
      rotationSpeed: 360/60/12,
      updateFunc() {
        this.rotation += this.rotationSpeed * deltaTime/1000;
      },
      drawFunc() {
        strokeWeight(0);
        fill(colors.black);
        rect(0,this.length/2-pivotOffset,handWidth,this.length);
      },
    });
    const minutes = new Transform({
      parent: clock,
      length: hoursLength * 1.333,
      rotation: random() * 360,
      rotationSpeed: 360/60,
      updateFunc() {
        this.rotation += this.rotationSpeed * deltaTime/1000;
      },
      drawFunc() {
        strokeWeight(0);
        fill(colors.black)
        rect(0,this.length/2-pivotOffset,handWidth/2,this.length);
      },
    });
    const seconds = new Transform({
      parent: clock,
      length: hoursLength * 1.333 + handWidth,
      rotation: random() * 360,
      rotationSpeed: 360,
      updateFunc() {
        this.rotation += this.rotationSpeed * deltaTime/1000;
      },
      drawFunc() {
        strokeWeight(0);
        fill(colors.red)
        rect(0,this.length/2-pivotOffset,handWidth/4,this.length);
      },
    });
    const faceBG = new Transform({
      z: 1,
      parent: clock,
      drawFunc() {
        strokeWeight(0);
        fill(colors.black);
        circle(0,0,hoursLength*2.667*1.05);
        fill(colors.white);
        circle(0,0,hoursLength*2.667);
      }
    });

    let hourMarks = polygonPoints(12, hoursLength*2.667*0.9/2);
    hourMarks.forEach(hm => {
      new Transform({
        x: hm.x, y: hm.y,
        parent: faceBG,
        drawFunc() {
          strokeWeight(handWidth);
          stroke(colors.black);
          point(0,0);
        },
      });
    });
    let minuteMarks = polygonPoints(60, hoursLength*2.667*0.9/2);
    minuteMarks.forEach(hm => {
      new Transform({
        x: hm.x, y: hm.y,
        parent: faceBG,
        drawFunc() {
          strokeWeight(handWidth/4);
          stroke(colors.black);
          point(0,0);
        },
      });
    });
    return clock;
  }

  const clockSpacing = 75;
  const clockSize = clockSpacing * 2.667*1.05;
  const clocksW = W/clockSize + 1;
  const clocksH = H/clockSize + 1;
  const foobar = PI/(Math.E/2);
  for (let i = 0; i < clocksW; i++) {
    for (let j = 0; j < clocksH; j++) {
      if (i % 2 === 0) {
        if (j % 2 === 0) {
          createClock(i*clockSize, j*clockSize, clockSpacing+clockSpacing/foobar);
        } else {
          createClock(i*clockSize, j*clockSize, clockSpacing-clockSpacing/foobar);
        }
      } else {
        if (j%2===0) {
          createClock(i*clockSize, j*clockSize, clockSpacing-clockSpacing/foobar);
        } else {
          createClock(i*clockSize, j*clockSize, clockSpacing+clockSpacing/foobar);
        }
      }
    }
  }

  window.draw = () => {
    background(colors.Background);
    Transform.drawAll();
  };
});