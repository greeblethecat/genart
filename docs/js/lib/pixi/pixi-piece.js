import {Piece} from '../piece.js';

const DefaultOpts = {
};

export default class PixiPiece extends Piece {

  constructor(opts = DefaultOpts) {
    super();
    this.renderer = 'pixi';
    //this.opts = Object.assign(DefaultOpts, opts);
  }

}