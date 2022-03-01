import {Colors} from '../lib/colors.js';
import {H, Helpers, W} from '../lib/utils.js';

const opts = Helpers.setupQueryParams({
  seed: 'foobar',
});
const random = new Math.seedrandom(opts.seed);

window.setup = () => {
  Colors.setup('pear36');
  createCanvas(W, H);
  background(Colors.orientPink);
};
window.draw = () => {
};