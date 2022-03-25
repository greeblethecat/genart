import PixiPiece from '../lib/pixi/pixi-piece.js';

export default new PixiPiece(function () {
    const app = new PIXI.Application({backgroundColor: 0x1099bb});
    document.body.appendChild(app.view);

    const basicText = new PIXI.Text('🙂');
    basicText.x = 50;
    basicText.y = 100;

    app.stage.addChild(basicText);
  }
);