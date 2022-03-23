import {colors} from './colors.js';
import {Piece} from '../piece.js';

const IN_BROWSER = typeof window !== 'undefined';

export let W = 0;
export let H = 0;
if (IN_BROWSER) {
  W = window.innerWidth;
  H = window.innerHeight;
} else {
}

export const Colors = colors;

export class Helpers {

  static W = W;
  static H = H;

  static P5Piece = class extends Piece {

    initialize(opts) {
      this.setup = function () {
        Helpers.setupP5();
        opts.setup();
      };

      // draw is optional and can be set within setup, so don't set draw if one is not present.
      this.draw = opts.draw ? opts.draw : undefined;

      this.setupPiece();
    }

    constructor(...args) {
      super(...args);
      let opts = args[0];
      if (typeof (args[0]) === 'function') {
        opts = {};
        opts.setup = args[0];
        if (typeof (args[1]) === 'function') {
          opts.draw = args[1];
        }
      }
      this.initialize(opts);
    }

    setupPiece() {
      if (this.setup) {
        if (IN_BROWSER) window.setup = this.setup;
      }
      if (this.draw) {
        if (IN_BROWSER) window.draw = this.draw;
      }
      console.log(this);
    }

  };

  static setupP5(renderer = P2D) {
    createCanvas(W, H, renderer);
    rectMode(CENTER);
    angleMode(DEGREES);
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
    if (IN_BROWSER) {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      return urlParams;
    }
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
    if (IN_BROWSER) {
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

  static clamp = (num, min, max) => Math.min(Math.max(num, min), max);
}

export const P5Piece = Helpers.P5Piece;