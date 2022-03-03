export class Transform {
  static allTransforms = [];

  constructor(opts = {}) {
    this.x = opts.x || 0;
    this.y = opts.y || 0;
    this.z = opts.z || 0;
    this.worldZ = this.z;
    this.rotation = opts.rotation || 0;
    this.children = [];
    this.ancestors = [];
    this.parent = opts.parent || undefined;

    Object.entries(opts).forEach((entry) => {
      let [key, value] = entry;
      if (!this[key]) {
        this[key] = value;
      }
    });

    Transform.allTransforms.push(this);
  }

  get parent() {
    return this._parent;
  }

  set parent(value) {
    this.setParent(value);
  }

  setParent(value) {
    // Remove this as child from any existing parent.
    if (this._parent) {
      this._parent.children = this._parent.children.filter(child => child !== this);
    }
    this._parent = value;
    if (this._parent) {
      this._parent.children.push(this);
      this.ancestors = this._parent.ancestors.concat([this._parent]);

      this.worldZ = this.z;
      let p = this._parent;
      while (p) {
        this.worldZ += p.z;
        p = p.parent;
      }
    }
  }

  static drawAll() {
    // Call all updates before drawing
    Transform.allTransforms.forEach(t => {
      if (t.updateFunc) {
        t.updateFunc.bind(t).call();
      }
    });

    // Draw all transforms in order of worldZ.
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
      translate(this.x || 0, this.y || 0);
    }
    if (this.rotation) {
      rotate(this.rotation);
    }
    //let rotation = this.ancestors.map(ancestor => ancestor.rotation || 0)
    //  .reduce((prev, rot) => prev += rot, this.rotation);
    //rotate(rotation);
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