const Utils = {
  foobar() {},


}

const Transform = class Transform {
  constructor(name, pos, scale=1, rotation=null) {
    this.name = name
    this.pos = createVector(pos.x, pos.y)
    this.scale = scale
    this.rotation = rotation

    if (this.name == undefined || this.name == null || this.name == '') {
      throw new Error('Transform name must be set')
    }
  }

  deltaVectorToMe(other) {
    return createVector(other.pos.x - this.pos.x, other.pos.y - this.pos.y)
  }
}