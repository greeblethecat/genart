export class Transform {
  static allTransforms = [];

  static defaultOpts = {
    x: 0, y: 0, z: 0,
    parent: undefined,
  };

  constructor(opts = Transform.defaultOpts) {
    this.x = 0;
    this.y = 0;
    this.z = 0; // Probably just sort before calling draw
    this.worldZ = 0;
    this.scaleX = undefined;
    this.scaleY = undefined;
    this.rotation = 0;
    this.localRotation = 0;
    this.updateFunc = undefined;
    this.drawFunc = undefined;
    this.parent = undefined;
    this.children = [];
    Object.entries(opts).forEach((entry) => {
      this[entry[0]] = entry[1];
    });
    Transform.allTransforms.push(this);
  }

  get parent() {
    return this._parent;
  }

  set parent(value) {
    if (this._parent) {
      this._parent.children.remove(this);
    }
    this._parent = value;
    if (this._parent) {
      this._parent.children.push(this);

      this.worldZ = this.z;
      let p = this._parent;
      while (p) {
        this.worldZ += p.z;
        p = p.parent;
      }
    }
  }

  static drawAll() {
    Transform.allTransforms.forEach(t => {
      if (t.updateFunc) {
        t.updateFunc.bind(t).call();
      }
    });

    // Draw in order of worldZ.
    Transform.allTransforms
      .sort((a, b) => b.worldZ - a.worldZ)
      .forEach(t => {
        t.draw.bind(t).call();
      });
  }

  doTranslations() {
    if (this.parent) {
      this.parent.doTranslations();
    }
    if (this.x || this.y) {
      translate(this.x, this.y);
    }
  }

  draw() {
    push();
    this.doTranslations();
    if (this.drawFunc) {
      this.drawFunc.bind(this).call();
    }
    pop();
  }
}