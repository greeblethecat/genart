import {colors} from './colors.js'

export const W = window.innerWidth;
export const H = window.innerHeight;

export const Colors = colors;

export class Helpers {

  static W = W;
  static H = H;

  static Setup(setupFunc) {
    return new this.Piece(setupFunc);
  }

  static Piece = class {

    constructor(opts = {}) {
      if (typeof(opts) === 'function') {
        opts = { setup: opts };
      }
      this.setup = () => {
        Helpers.setupP5();
        opts.setup();
      }

      // draw is optional and can be set within setup, so don't set draw if one is not present.
      this.draw = opts.draw ? () => {
        opts.draw();
      } : undefined;
      this.foobar = 'foobar';

      this.setupPiece();
    }

    setupPiece() {
      console.log('setting up piece', this);
      if (this.setup) {
        window.setup = this.setup;
      }
      if (this.draw) {
        window.draw = this.draw;
      }
    }

  }

  static setupP5() {
    createCanvas(W, H);
    rectMode(CENTER);
    angleMode(DEGREES)
    colors.setup();
  }

  static shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  static getQueryParams() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams;
  }

  static argsPairsToQueryParamsString(...args) {
    let str = '';
    for (let i = 0; i < args.length; i += 2) {
      if (i === 0) str += '?';
      else str += '&';
      str += `${args[i]}=${args[i + 1]}`;
    }
    return str;
  }

  static setupQueryParams(defaults) {
    let queryParamsObject = {};
    for (const [key, value] of this.getQueryParams().entries()) {
      queryParamsObject[key] = value;
    }
    let opts = Object.assign(defaults, queryParamsObject);
    let replaceLocation = Object.keys(defaults).filter(k => !queryParamsObject[k]).length > 0;
    if (replaceLocation) {
      let location = window.location.toString().split('?')[0];
      window.location.replace(location + this.argsPairsToQueryParamsString(
        ...Object.entries(opts).flat()
      ));
    }
    return opts;
  }

  static createArray(length) {
    let arr = new Array(length || 0),
      i = length;

    if (arguments.length > 1) {
      let args = Array.prototype.slice.call(arguments, 1);
      while (i--) {
        let idx = length - 1 - i;
        arr[idx] = Helpers.createArray.apply(this, args);
      }
    }

    return arr;
  }
}