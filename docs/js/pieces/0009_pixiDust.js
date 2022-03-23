import PixiPiece from '../lib/pixi/pixi-piece.js';

if (typeof window !== 'undefined') {
  let app = new PIXI.Application({
    width: 100,
    height: 100,
  });
}

export default new PixiPiece()