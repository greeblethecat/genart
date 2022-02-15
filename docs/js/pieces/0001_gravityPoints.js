const w = window.innerWidth;
const h = window.innerHeight;

const AllPoints = [];
let DrawnPoints = [];

import { Transform } from '../lib/utils.js';

window.setup = function() {
  createCanvas(w, h);
  //noLoop() // causes draw to be called only once

  const NumPieces = 64;
  for (let i = 0; i < NumPieces; i++) {
    AllPoints.push(Point.CreateNewRandomPoint());
  }
}

const AveragePointScale = 25;

class Point extends Transform {

  static CreateNewRandomPoint(scale) {
    return new Point({x: Math.random() * w, y: Math.random() * h}, Math.random() * AveragePointScale);
  }

  static UpdateUniversalGravitation(points) {
    // F=G((m1*m2)/r^2)
    // F - force
    // G - gravitational constant
    // m1, m2 - masses of objects
    // r - distance between the two objects
  }

  constructor(pos, scale = 1, initialVelocity = 0) {
    super(pos, scale);
    this.initialVelocity = initialVelocity;
  }

  draw() {
    stroke('white');
    strokeWeight(this.scale);
    point(this.pos.x, this.pos.y);
  }

}

window.draw = function() {
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