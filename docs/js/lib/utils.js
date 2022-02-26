export const W = window.innerWidth;
export const H = window.innerHeight;



export class Helpers {
  static polygonPoints(numSides, radius, center = createVector(0, 0)) {
    let points = [];
    for (let i = 0; i < numSides; i++) {
      let vertex = createVector(center.x + radius * Math.cos(2 * Math.PI * i / numSides),
        center.y + radius * Math.sin(2 * Math.PI * i / numSides));
      points.push(vertex);
    }
    return points;
  }

  static shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  static getQueryParms() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams;
  }

  static ToQueryParmsString(...args) {
    let str = '';
    for (let i = 0; i < args.length; i+=2) {
      if (i === 0) str += '?';
      else str += '&';
      str += `${args[i]}=${args[i+1]}`;
    }
    return str;
  }
}