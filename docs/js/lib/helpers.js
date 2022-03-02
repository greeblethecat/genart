export const W = window.innerWidth;
export const H = window.innerHeight;

export class Helpers {

  static setupP5() {
    createCanvas(W,H);
    rectMode(CENTER);
    angleMode(DEGREES)
  }

  static shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  static getQueryParams() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams;
  }

  static argsPairsToQueryParamsString(...args) {
    let str = '';
    for (let i = 0; i < args.length; i += 2) {
      if (i === 0) str += '?';
      else str += '&';
      str += `${args[i]}=${args[i + 1]}`;
    }
    return str;
  }

  static setupQueryParams(defaults) {
    let queryParamsObject = {};
    for (const [key, value] of this.getQueryParams().entries()) {
      queryParamsObject[key] = value;
    }
    let opts = Object.assign(defaults, queryParamsObject);
    let replaceLocation = Object.keys(defaults).filter(k => !queryParamsObject[k]).length > 0;
    if (replaceLocation) {
      let location = window.location.toString().split('?')[0];
      window.location.replace(location + this.argsPairsToQueryParamsString(
        ...Object.entries(opts).flat()
      ));
    }
    return opts;
  }
}