import PixiPiece from '../lib/pixi/pixi-piece.js';
import {Helpers} from '../lib/p5/helpers.js'

const opts = Helpers.setupQueryParams({seed: 'foobar'});
const random = new Math.seedrandom(opts.seed);

export default new PixiPiece(function () {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const S = W > H ? H : W;
    const app = new PIXI.Application({
      backgroundColor: 0x0,
      autoResize: true,
      resolution: devicePixelRatio,
      width: W,
      height: H
    });
    document.body.appendChild(app.view);

    const NUM_DROPS = 3;
    const NUM_LAYERS = 1;
    const DROPS_PER_LAYER = NUM_DROPS / NUM_LAYERS;
    const drops = []
    for (let layer = 0; layer < NUM_LAYERS; layer++) {
      for (let i = 0; i < NUM_DROPS; i++) {
        const g = new PIXI.Graphics();

        function drawDrop(size) {
          g.drawRect(W / 2 - size / 2, H / 2 - size / 2, size, size);
        }

        const MAX_SIZE = S / 1;
        const size = Math.max(1, Math.min(random() * MAX_SIZE, MAX_SIZE));
        g.beginFill(0xffffff)
        drawDrop(size)
        g.endFill();
        g.x = random() * W - W / 2;
        g.y = random() * H - H / 2;
        //g.x = 0;
        //g.y = 0;
        g.size = size;
        g.velocity = [1 * (random() * 2 - 1), 1 * (random() * 2 - 1)];
        app.stage.addChild(g);
        drops.push(g);
      }
    }

    app.ticker.add(function (deltaTime) {
      drops.forEach((g) => {
        g.x += deltaTime * g.velocity[0];
        g.y += deltaTime * g.velocity[1];
        if (g.x + 0.5 * g.size < -0.5 * W) {
          g.x = 0.5 * W + 0.5 * g.size;
        } else if (g.x - 0.5 * g.size > 0.5 * W) {
          g.x = -0.5 * W - 0.5 * g.size;
          console.log(g.x, g.y)
        }
        if (g.y + 0.5 * g.size < -0.5 * H) {
          g.y = 0.5 * H + 0.5 * g.size;
        } else if (g.y - 0.5 * g.size > 0.5 * H) {
          g.y = -0.5 * H - 0.5 * g.size;
        }
        //drops.forEach((d2) => {
        //  //console.log(g.x, g.y)
        //})
      });
    });
  }
);