export class Transform {
  constructor(pos, scale = 1, rotation = null) {
    this.name = name;
    this.pos = createVector(pos.x, pos.y);
    this.scale = scale;
    this.rotation = rotation;
  }

  deltaVectorToMe(other) {
    return createVector(other.pos.x - this.pos.x, other.pos.y - this.pos.y);
  }
};