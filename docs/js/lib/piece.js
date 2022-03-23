/*
    id: pieceJS.split('_')[0],
    jsName: pieceJS,
 */

const DEFAULT_RENDERER = 'p5';

export class Piece {
  constructor(...param) {
    this.renderer = DEFAULT_RENDERER;
  }
}