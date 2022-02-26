import {Colors} from '../lib/colors.js';
import {H, Helpers, W} from '../lib/utils.js';

if (!Helpers.getQueryParms().get('count')) {
  window.location.replace(window.location + Helpers.ToQueryParmsString('count', 10))
}
const count = Helpers.getQueryParms().get('count');

window.setup = () => {
  Colors.setup();
  createCanvas(W, H);
  background(Colors.pear36.black);
};
window.draw = () => {
};