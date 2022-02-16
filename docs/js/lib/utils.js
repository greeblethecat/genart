export const W = window.innerWidth;
export const H = window.innerHeight;

export class Helpers {
  static polygonPoints(numSides, radius, center = createVector(0, 0)) {
    let points = [];
    for (let i = 0; i < numSides; i++) {
      let vertex = createVector(center.x + radius * Math.cos(2 * Math.PI * i / numSides),
        center.y + radius * Math.sin(2 * Math.PI * i / numSides));
      points.push(vertex);
    }
    return points;
  }
}

export class Transform {
  /**
   * Handled By This Class:
   *    rotate(), scale(), translate()
   */
  /* Not (yet?) Handled By This Class
   *    fill(), noFill(), noStroke(), stroke(), tint(), noTint(), strokeWeight(), strokeCap(), strokeJoin(),
   *    imageMode(), rectMode(), ellipseMode(), colorMode(), textAlign(), textFont(), textSize(), textLeading(),
   *    applyMatrix(), resetMatrix(), shearX(), shearY(), noiseSeed() setCamera(), ambientLight(), directionalLight(),
   *    pointLight(), texture(), specularMaterial(), shininess(), normalMaterial(), shader()
   */
  constructor(position, rotation, scale) {
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
  }

  preDraw() {
    push();
    if (this.position) {
      translate(this.position.x, this.position.y);
    }
    if (this.rotation) {
      rotate(this.rotation);
    }
    if (this.scale) {
      scale(this.scale);
    }
  }

  draw() {
    throw new Error('Implement draw()!');
  }

  static draw(transform) {
    transform.preDraw();
    transform.draw();
    pop();
  }
}