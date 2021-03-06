let c = {};
export const colors = c;
export default c;
colors.setup = setup;

export function setup(defaultPalette = null, loadAll = true) {
  const AllPalettes = {
    /**
     * Manually add palettes here...
     */
    pear36: {
      color1: color('#5e315b'),
      orientPink: color('#8c3f5d'),
      color3: color('#ba6156'),
      orange: color('#f2a65e'),
      yellow: color('#ffe478'),
      color6: color('#cfff70'),
      brightGreen: color('#8fde5d'),
      green: color('#3ca370'),
      teal: color('#3d6e70'),
      color10: color('#323e4f'),
      darkPurple: color('#322947'),
      purple: color('#473b78'),
      darkBlue: color('#4b5bab'),
      blue: color('#4da6ff'),
      skyBlue: color('#66ffe3'),
      white: color('#ffffeb'),
      lighterGrey: color('#c2c2d1'),
      lightGrey: color('#7e7e8f'),
      grey: color('#606070'),
      darkGrey: color('#43434f'),
      black: color('#272736'),
      color22: color('#3e2347'),
      color23: color('#57294b'),
      color24: color('#964253'),
      darkOrange: color('#e36956'),
      color26: color('#ffb570'),
      lightOrange: color('#ff9166'),
      red: color('#eb564b'),
      redPink: color('#b0305c'),
      color30: color('#73275c'),
      color31: color('#422445'),
      color32: color('#5a265e'),
      darkPink: color('#80366b'),
      pink: color('#bd4882'),
      lightPink: color('#ff6b97'),
      color36: color('#ffb5b5'),
    }
  }
  c = { setup: setup };
  Object.keys(AllPalettes).forEach(k => {
    c[k] = AllPalettes[k]
    // TODO: If a value in AllPalettes is a function, then run it and replace the value of the key on c with the return.
  })


  if (defaultPalette != null) {
    Object.keys(c[defaultPalette]).forEach(key => {
      c[key] = c[defaultPalette][key];
    });
  }
  Object.assign(colors, c);
  return c;
}