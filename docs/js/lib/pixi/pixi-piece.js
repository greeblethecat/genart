import {Piece} from '../piece.js';

export default class PixiPiece extends Piece {

  constructor(func) {
    super();
    this.renderer = 'pixi';
    this.func = func;
    if (typeof window !== 'undefined') {
      this.func();
    }
  }

}