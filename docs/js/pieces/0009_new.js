import {Piece, Colors, W, H, Helpers} from '../lib/helpers.js';
import {Transform} from '../lib/transform.js';

export default new Piece(() => {
  Colors.setup('pear36');

  const PointSize = 100;

  function makePairGlob() {
    const pairGlob = new Transform({x: W / 2, y: H / 2});
    const a = new Transform({
      x: PointSize * -2, parent: pairGlob, size: PointSize, draw() {
        stroke(Colors.black);
        strokeWeight(this.size);
        point(0, 0, 0);
      }
    });
    const b = new Transform({
      x: PointSize * 2, parent: pairGlob, size: PointSize, draw() {
        stroke(Colors.black);
        strokeWeight(this.size);
        point(0, 0, 0);
      }
    });

    function makePointHighlight(pt) {
      new Transform({
        z: 1, parent: pt, draw() {
          let d = dist(a.x, a.y, b.x, b.y);
          d = (d === 0 ? 0.001 : d);
          stroke(Colors.red);
          strokeWeight(lerp(pt.size, pt.size*2, Helpers.clamp(0.5*pt.size/d,0,1)));
          point(0, 0, 0);
        }
      });
    }

    makePointHighlight(a);
    makePointHighlight(b);

    const link = new Transform({
      z: 10, parent: pairGlob,
      draw() {
        let d = dist(a.x, a.y, b.x, b.y);
        d = (d === 0 ? 0.001 : d);
        stroke(Colors.red);
        strokeWeight(Helpers.clamp(a.size * a.size/d, 0, a.size*1.5));
        line(a.x, a.y, b.x, b.y);

        fill(Colors.red);
        //strokeWeight(10);
        strokeWeight(0);
        beginShape(TESS);
        vertex(a.x, a.y-a.size/2);
        vertex(a.x, a.y+a.size/2);

        vertex((a.x+b.x)/2, (a.y+b.y)/2);
        //vertex((a.x+b.x)/2, (a.y+b.y)/2 + a.size/2);

        vertex(b.x, b.y+b.size/2);
        vertex(b.x, b.y-b.size/2);
        vertex((a.x+b.x)/2, (a.y+b.y)/2);
        endShape();
      },
    });

    pairGlob.a = a;
    pairGlob.b = b;

    return pairGlob;
  }

  let pairGlob = makePairGlob();
  let flip = false;
  pairGlob.updateFunc = function() {
    //this.x += deltaTime;
    this.rotation += deltaTime/1000 * 360 * 0.15;
    let xDelta = 0.2;
    if (!flip) {
      if (pairGlob.a.x > -W/2) {
        pairGlob.a.x -= deltaTime * xDelta;
      } else {
        flip = true;
      }
      if (pairGlob.b.x < W/2) {
        pairGlob.b.x += deltaTime * xDelta;
      } else {
        flip = true;
      }
    } else {
      if (pairGlob.a.x < W/2) {
        pairGlob.a.x += deltaTime * xDelta;
      } else {
        flip = false;
      }
      if (pairGlob.b.x > -W/2) {
        pairGlob.b.x -= deltaTime * xDelta;
      } else {
        flip = false;
      }
    }
  };

  window.draw = () => {
    background(Colors.purple);
    Transform.drawAll();
  };
});