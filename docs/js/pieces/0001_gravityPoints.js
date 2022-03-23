import {Helpers, W, H} from '../lib/p5/helpers.js'

const AllPoints = [];
const AveragePointScale = 25;

class Point {

  constructor(pos, scale = 1, rotation = null) {
    this.pos = createVector(pos.x, pos.y);
    this.scale = scale;
    this.rotation = rotation;
  }

  static CreateNewRandomPoint(scale) {
    return new Point({x: Math.random() * W, y: Math.random() * H}, Math.random() * AveragePointScale);
  }

  static UpdateUniversalGravitation(points) {
    // F=G((m1*m2)/r^2)
    // F - force
    // G - gravitational constant
    // m1, m2 - masses of objects
    // r - distance between the two objects
  }

  draw() {
    stroke('white');
    strokeWeight(this.scale);
    point(this.pos.x, this.pos.y);
  }

}

export default new Helpers.P5Piece({
  setup() {
    const NumPieces = 64;
    for (let i = 0; i < NumPieces; i++) {
      AllPoints.push(Point.CreateNewRandomPoint());
    }
  },

  draw() {
    background(0, 0, 0);

    // Update the state for all points
    AllPoints.forEach((point, index) => {
      AllPoints.forEach(otherPoint => {
        if (point !== otherPoint) {
          let F = (point.scale * otherPoint.scale) / (dist(point.pos.x, point.pos.y, otherPoint.pos.x, otherPoint.pos.y));
          otherPoint.pos.lerp(point.pos, F * 0.00001 * deltaTime);
        }
      });
    });

    AllPoints.forEach(point => {
      point.draw(AllPoints);
    });
    console.log('AllPoints.length=', AllPoints.length);
  }
})

