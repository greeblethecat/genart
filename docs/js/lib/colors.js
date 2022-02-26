let c = {};
export const Colors = c;
Colors.setup = setup;

export function setup() {
  c = {
    setup: setup,
    pear36: {
      color1: color('#5e315b'),
      orientPink: color('#8c3f5d'),
      color3: color('#ba6156'),
      orange: color('#f2a65e'),
      yellow: color('#ffe478'),
      color6: color('#cfff70'),
      green: color('#8fde5d'),
      color8: color('#3ca370'),
      color9: color('#3d6e70'),
      color10: color('#323e4f'),
      darkPurple: color('#322947'),
      purple: color('#473b78'),
      color13: color('#4b5bab'),
      color14: color('#4da6ff'),
      color15: color('#66ffe3'),
      white: color('#ffffeb'),
      color17: color('#c2c2d1'),
      lightGrey: color('#7e7e8f'),
      grey: color('#606070'),
      darkGrey: color('#43434f'),
      black: color('#272736'),
      color22: color('#3e2347'),
      color23: color('#57294b'),
      color24: color('#964253'),
      color25: color('#e36956'),
      color26: color('#ffb570'),
      color27: color('#ff9166'),
      red: color('#eb564b'),
      color29: color('#b0305c'),
      color30: color('#73275c'),
      color31: color('#422445'),
      color32: color('#5a265e'),
      color33: color('#80366b'),
      color34: color('#bd4882'),
      color35: color('#ff6b97'),
      color36: color('#ffb5b5'),
    }
  };
  Object.assign(Colors, c);
  return c;
}