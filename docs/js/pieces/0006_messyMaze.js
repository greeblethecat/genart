import {W, H, Helpers} from '../lib/utils.js';
import * as colors from '../lib/colors.js';

const cellSize = Helpers.getQueryParms().get('size') || 16;
const cellWallStrokeWeight = cellSize / 5;
let grid;
let startNode;
let endNode;
let curNode;
let c;

class GridNode {
  constructor(x, y, grid) {
    this.x = x;
    this.y = y;
    this.grid = grid;
    this.connectedAdjacent = [];
    this.nodeSet = new Set();
    this.nodeSet.add(this);
    let worldXY = this.grid.getNodeWorldCoords(x, y);
    this.worldX = worldXY.x;
    this.worldY = worldXY.y;
    this._adjs = undefined;
    this.adjacentNodes = this.getAdjacentNodes();
    this.unconnectedAdjacent = this.getAdjacentNodes();
  }

  connectTo(otherNode) {
    let union = new Set([...this.nodeSet, ...otherNode.nodeSet]);
    union.forEach(node => {
      node.nodeSet = union;
    });
    this.connectedAdjacent.push(otherNode);
    otherNode.connectedAdjacent.push(this);
    this.unconnectedAdjacent = this.unconnectedAdjacent.filter(n => !n.nodeSet.has(this));
    otherNode.unconnectedAdjacent = otherNode.unconnectedAdjacent.filter(n => !n.nodeSet.has(otherNode));
  }

  getAdjacentNodes() {
    let adjacents = [];
    try {
      let left = {x: this.x - 1, y: this.y};
      adjacents.push(this.grid.nodes[left.x][left.y]);
    } catch {
    }
    try {
      let down = {x: this.x, y: this.y - 1};
      adjacents.push(this.grid.nodes[down.x][down.y]);
    } catch {
    }
    try {
      let right = {x: this.x + 1, y: this.y};
      adjacents.push(this.grid.nodes[right.x][right.y]);
    } catch {
    }
    try {
      let up = {x: this.x, y: this.y + 1};
      adjacents.push(this.grid.nodes[up.x][up.y]);
    } catch {
    }
    return adjacents.filter(n => !!n);
  }

  getAdjacentCoords() {
    if (this._adjs) {
      return this._adjs;
    } else {
      this._adjs = {};
      if (this.x > 0) {
        this._adjs.left = {x: this.x - 1, y: this.y};
        this._adjs.left.node = this.grid.nodes[this._adjs.left.x][this._adjs.left.y];
      }
      if (this.y > 0) {
        this._adjs.down = {x: this.x, y: this.y - 1};
        this._adjs.down.node = this.grid.nodes[this._adjs.down.x][this._adjs.down.y];
      }
      if (this.x < this.grid.nodes.length - 1) {
        this._adjs.right = {x: this.x + 1, y: this.y};
        this._adjs.right.node = this.grid.nodes[this._adjs.right.x][this._adjs.right.y];
      }
      if (this.y < this.grid.nodes[0].length - 1) {
        this._adjs.up = {x: this.x, y: this.y + 1};
        this._adjs.up.node = this.grid.nodes[this._adjs.up.x][this._adjs.up.y];
      }
      return this._adjs;
    }
  }

  drawWalls() {
    let coords = this.grid.getNodeWorldCoords(this.x, this.y);
    let adjacents = this.getAdjacentCoords();
    let extent = this.grid.cellSize / 2;
    if (!adjacents.left || !this.connectedAdjacent.includes(adjacents.left.node)) {
      line(coords.x - extent, coords.y - extent, coords.x - extent, coords.y + extent);
    }
    if (!adjacents.right || !this.connectedAdjacent.includes(adjacents.right.node)) {
      line(coords.x + extent, coords.y - extent, coords.x + extent, coords.y + extent);
    }
    if (!adjacents.down || !this.connectedAdjacent.includes(adjacents.down.node)) {
      line(coords.x + extent, coords.y - extent, coords.x - extent, coords.y - extent);
    }
    if (!adjacents.up || !this.connectedAdjacent.includes(adjacents.up.node)) {
      line(coords.x + extent, coords.y + extent, coords.x - extent, coords.y + extent);
    }
  }

}

class Grid {
  constructor(w, h, cellSize, nodeInitializerFunc) {
    this.w = w;
    this.h = h;
    this.cellSize = cellSize;
    this.nodes = new Array(w);
    for (let i = 0; i < w; i++) {
      this.nodes[i] = new Array(h);
    }
    if (nodeInitializerFunc) {
      for (let i = 0; i < this.nodes.length; i++) {
        for (let j = 0; j < this.nodes[0].length; j++) {
          this.nodes[i][j] = nodeInitializerFunc(i, j, this);
          this.nodes[i][j].grid = this;
        }
      }
    }
    console.log(`new Grid: w=${this.nodes.length}, h=${this.nodes[0].length}, cellSize=${this.cellSize}, initialized=${!!nodeInitializerFunc}`);
  }

  getNodeWorldCoords(x, y) {
    return {
      x: x * this.cellSize + this.cellSize / 2,
      y: y * this.cellSize + this.cellSize / 2
    };
  }

}

function allSets() {
  return Array.from(AllNodes.reduce((prev, node) => {
    prev.add(node.nodeSet);
    return prev;
  }, new Set()));
}

function numSetsContaining(node1, node2) {
  if (node1.nodeSet === node2.nodeSet) {
    return 1;
  } else {
    return 2;
  }
}

const palette = {};

const AllNodes = [];
window.setup = () => {
  if (!Helpers.getQueryParms().get('size')) window.location.replace(window.location + Helpers.ToQueryParmsString('size', cellSize));
  c = colors.setup();
  palette.wall = 'black';
  palette.background = c.pear36.darkPurple;
  palette.path1 = c.pear36.purple;
  palette.path2 = c.pear36.yellow;
  palette.path3 = c.pear36.red;
  createCanvas(W, H);
  angleMode(DEGREES);
  grid = new Grid(Math.floor(W / cellSize), Math.floor(H / cellSize), cellSize, (i, j, grid) => new GridNode(i, j, grid));
  startNode = grid.nodes[0][0];
  endNode = grid.nodes[grid.w - 1][grid.h - 1];
  for (let i = 0; i < grid.w; i++) {
    for (let j = 0; j < grid.h; j++) {
      AllNodes.push(grid.nodes[i][j]);
    }
  }

  // Setup grid
  while (numSetsContaining(startNode, endNode) > 1) {
    let AllSets = Helpers.shuffle(allSets());
    let connected = false;
    for (let i = 0; i < AllSets.length; i++) {
      if (connected) break;
      let set = AllSets[i];
      let nodes = Helpers.shuffle(Array.from(set));
      for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        if (node.unconnectedAdjacent.length > 0) {
          let randomAdj = node.unconnectedAdjacent[Math.floor(Math.random() * node.unconnectedAdjacent.length)];
          node.connectTo(randomAdj);
          connected = true;
          break;
        }
      }
    }
  }

  console.log('allSets', allSets().length, 'numSetsContaining', numSetsContaining(startNode, endNode));

  path = [];
  let cur;
  let unvisited = [startNode];
  let visited = [];
  while (!visited.includes(endNode)) {
    cur = unvisited.pop();
    visited.push(cur);
    let possible = cur.connectedAdjacent.filter(n => n.nodeSet.has(endNode) && !visited.includes(n));
    if (possible && possible.length > 0) {
      path.push(cur);
    }
    unvisited = unvisited.concat(possible);
  }
  path.push(endNode);
  console.log('Path has ', path.length, ' nodes.');

  console.log('Optimizing path.');

  function removeCycles() {
    path2 = [];
    for (let i = 0; i < path.length; i++) {
      let cycled = false;
      let skipIndex = 0;
      for (let j = i + 2; j < path.length; j++) {
        if (path[i].connectedAdjacent.includes(path[j])) {
          cycled = true;
          skipIndex = j;
        }
      }
      path2.push(path[i]);
      if (cycled) {
        path2.push(path[skipIndex]);
        i = skipIndex;
      }
    }

    //console.log('Path2 has ', path2.length, ' nodes.');
    background(palette.background);
  }

  removeCycles();
  console.log('Path2 has ', path2.length, ' nodes.');

  debugPoints = path2.filter((n, i) => {
    if (i === 0) return false;
    return !path2[i].connectedAdjacent.includes(path2[i - 1]);
  });
  console.log('debugPoints has', debugPoints.length, ' debug points.');

  //path2.forEach((node, index) => {
  //  if (debugPoints.includes(node)) {
  //    let start = path2[index - 1];
  //    let end = node;
  //  } else {
  //    path3.push(node);
  //  }
  //});
  path3 = debugPoints;
  console.log('Path3 has ', path3.length, ' nodes.');

  translate(cellWallStrokeWeight / 2, cellWallStrokeWeight / 2);
  path.forEach((node, i) => {
    if (i !== 0) drawPath(path, i, palette.path1);
  });
  path2.forEach((node, i) => {
    if (i !== 0) drawPath(path2, i, palette.path2);
  });
  path3.forEach((node, i) => {
    if (i !== 0) drawPath(path3, i, palette.path3);
  });
  strokeWeight(cellSize - cellWallStrokeWeight * 2);
  stroke(palette.path2);
  point(endNode.worldX, endNode.worldY);

  stroke(palette.wall);
  strokeWeight(cellWallStrokeWeight);
  fill(0, 0, 0, 0);
  for (let i = 0; i < grid.w; i++) {
    for (let j = 0; j < grid.h; j++) {
      let node = grid.nodes[i][j];
      node.drawWalls();
    }
  }

  debugPoints.forEach(p => {
    strokeWeight(cellSize / 4);
    stroke(palette.path3);
    point(p.worldX, p.worldY);
  });

};

let debugPoints = [];
let path3 = [];
let path2 = [];
let path = [];
let i = 1;
let i2 = 1;
let i3 = 1;

function drawPath(p, index, color) {
  let i = index;
  strokeWeight(lerp(1, grid.cellSize / 4, i / p.length));
  stroke(color);
  line(p[i - 1].worldX, p[i - 1].worldY, p[i].worldX, p[i].worldY);
  //strokeWeight(0);
  //fill(color);
  //square(startNode.worldX - cellSize / 2, startNode.worldY - cellSize / 2, cellSize);
  strokeWeight(cellSize - cellWallStrokeWeight * 2);
  if (p != path3) {
    point(startNode.worldX, startNode.worldY);
  }
  if (p === path2) {
    stroke(palette.path1);
  } else if (p === path3) {
    stroke(palette.path2);
  } else if (p === path) {
    stroke(palette.wall);
  }
  point(endNode.worldX, endNode.worldY);
  //square(endNode.worldX - cellSize / 2, endNode.worldY - cellSize / 2, cellSize);
  return index + 1;
}

window.drawOld = () => {
  translate(cellWallStrokeWeight / 2, cellWallStrokeWeight / 2);
  if (i < path.length) {
    i = drawPath(path, i, palette.path1);
  }
  if (i >= path.length && i2 < path2.length) {
    i2 = drawPath(path2, i2, palette.path2);
  }
  if (i2 >= path2.length && i3 < path3.length) {
    i3 = drawPath(path3, i3, palette.path3);
  }
  if (i3 >= path3.length) {
    //strokeWeight(0);
    //fill(palette.path3);
    //square(startNode.worldX - cellSize / 2, startNode.worldY - cellSize / 2, cellSize);
    //square(endNode.worldX - cellSize / 2, endNode.worldY - cellSize / 2, cellSize);
    //stroke(palette.path3);
    strokeWeight(cellSize - cellWallStrokeWeight * 2);
    //point(startNode.worldX, startNode.worldY);
    stroke(palette.path2);
    point(endNode.worldX, endNode.worldY);
  }


  stroke(palette.wall);
  strokeWeight(cellWallStrokeWeight);
  fill(0, 0, 0, 0);
  for (let i = 0; i < grid.w; i++) {
    for (let j = 0; j < grid.h; j++) {
      let node = grid.nodes[i][j];
      node.drawWalls();
    }
  }

  debugPoints.forEach(p => {
    strokeWeight(cellSize / 4);
    stroke(palette.path3);
    point(p.worldX, p.worldY);
  });
};
