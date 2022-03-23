import {colors} from '../lib/p5/colors.js';
import {Helpers, W} from '../lib/p5/helpers.js';
import {Transform} from '../lib/p5/transform.js';

const opts = Helpers.setupQueryParams({seed: 'foobar'});

export default new Helpers.P5Piece(function () {
  colors.setup('pear36');
  const random = new Math.seedrandom(opts.seed);
  rectMode(CORNER);
  let time = 0;

  const NUM_STARS = 512;
  const BG_COLOR = colors.redPink;
  const BIG_STAR_COLOR = colors.darkOrange;
  const SMALL_STAR_COLOR = colors.pear36.color26;
  const SMALLEST_STAR_COLOR = colors.white;
  const MAX_STAR_SIZE = W / 4;
  const MIN_STAR_SIZE = 10;

  const scene = new Transform({
    x: width / 2,
    y: height / 2,
  });

  function createStar(size, diagonal) {
    let sizeColor = SMALL_STAR_COLOR;
    if (size <= MIN_STAR_SIZE) {
      sizeColor = SMALLEST_STAR_COLOR;
    }
    sizeColor = lerpColor(SMALL_STAR_COLOR, BIG_STAR_COLOR, size / MAX_STAR_SIZE);
    let star = new Transform({
      x: random() * width - width / 2,
      y: random() * height - height / 2 - diagonal / 2,
      z: random(),
      parent: scene,
      magnitude: size / (size + size * sqrt(size)),
      vector: createVector(random() * (random() > 0.5 ? -1 : 1), random() * (random() > 0.5 ? -1 : 1)).normalize(),
      updateFunc: function () {
        const magnitudeDeflator = 1;
        let mag = this.magnitude * magnitudeDeflator;
        let deltaX = this.vector.x * deltaTime * mag * (random() > 0.5 ? -1.5 : 1.5);
        let deltaY = this.vector.y * deltaTime * mag;
        if (size <= MIN_STAR_SIZE) {
          deltaY += -1.5 * random() * mag * deltaTime;
          deltaX /= 1.5;
        } else {
          deltaY += size / MAX_STAR_SIZE * mag * deltaTime;
        }

        this.x += deltaX;
        this.y += deltaY;

        // Wrap along the Y
        if (deltaY > 0 && this.y >= height / 2 + diagonal / 2) {
          this.y = -height / 2 - diagonal / 2;
        } else if (deltaY < 0 && this.y <= -height / 2 - diagonal / 2) {
          this.y = height / 2 + diagonal / 2;
        }

        // Wrap along the X
        if (deltaX > 0 && this.x >= width / 2 + diagonal / 2) {
          this.x = -width / 2 - diagonal / 2;
        } else if (deltaX < 0 && this.x <= -width / 2 - diagonal / 2) {
          this.x = width / 2 + diagonal / 2;
        }

      },
    });
    let view = new Transform({
      size: size,
      parent: star,
      rotation: random() * 360,
      drawFunc: function () {
        this.rotation += deltaTime / this.parent.magnitude / (size * 2);
        rotate(this.rotation);
        strokeWeight(0);
        fill(lerpColor(sizeColor, BG_COLOR, this.worldZ));
        rectMode(CENTER);
        circle(this.x, this.y, this.size);
      }
    });
  }

  for (let i = 0; i < NUM_STARS; i++) {
    let size = random();
    let pct = i / NUM_STARS;
    if (pct < 0.1) {
      size *= MAX_STAR_SIZE;
    } else if (pct < 0.35) {
      size *= W / 8;
    } else {
      size = MIN_STAR_SIZE;
    }
    const diagonal = sqrt(2) * size;
    createStar(size, diagonal);
  }

  let frameNum = 0;
  background(BG_COLOR);
  window.draw = function () {
    let c = color(BG_COLOR);
    c.setAlpha(0.5 * 255);
    fill(c);
    rect(0, 0, width, height);
    time += deltaTime;
    Transform.drawAll();
  };

});
