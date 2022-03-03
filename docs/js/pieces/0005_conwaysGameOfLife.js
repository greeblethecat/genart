import {W, H, Helpers} from '../lib/helpers.js';
import * as colors from '../lib/colors.js';

let c;
const cellSize = 2;
const gridW = Math.floor(W/cellSize)+1;
const gridH = Math.floor(H/cellSize)+1;
const grid1 = Helpers.createArray(gridW, gridH);
const grid2 = Helpers.createArray(gridW, gridH);
let tick = true;

export default new Helpers.Piece({
  setup() {
    background(0);
    c = colors.setup();
    console.log(gridH, gridW);
    for (let x = Math.floor(gridW*0.1); x < Math.floor(gridW*0.9); x++) {
      for (let y = Math.floor(gridH*0.1); y < Math.floor(gridH*0.9); y++) {
        if (random() < 0.08) {
          grid1[x][y] = true;
          grid2[x][y] = true;
        } else {
          grid1[x][y] = false;
          grid2[x][y] = false;
        }
      }
    }
  },

  draw() {
    background(c.pear36.black);
    noStroke();
    fill(c.pear36.green);
    let grid = grid1;
    let gridNext = grid2;
    if (!tick) {
      grid = grid2;
      gridNext = grid1;
    }
    tick = !tick;
    for (let x = 0; x < grid.length; x++) {
      for (let y = 0; y < grid[0].length; y++) {
        let livingNeighborCount = 0;
        try { if (grid[x+1][y]) livingNeighborCount++; } catch (e) {}
        try { if (grid[x-1][y]) livingNeighborCount++; } catch (e) {}
        try { if (grid[x][y+1]) livingNeighborCount++; } catch (e) {}
        try { if (grid[x][y-1]) livingNeighborCount++; } catch (e) {}
        try { if (grid[x+1][y+1]) livingNeighborCount++; } catch (e) {}
        try { if (grid[x+1][y-1]) livingNeighborCount++; } catch (e) {}
        try { if (grid[x-1][y+1]) livingNeighborCount++; } catch (e) {}
        try { if (grid[x-1][y-1]) livingNeighborCount++; } catch (e) {}
        if (grid[x][y]) {
          square(x * cellSize, y * cellSize, cellSize);
          if (livingNeighborCount < 2 || livingNeighborCount > 3) {
            gridNext[x][y] = false;
          } else {
            gridNext[x][y] = true;
          }
        } else {
          if (livingNeighborCount === 3) {
            gridNext[x][y] = true;
          } else {
            gridNext[x][y] = false;
          }
        }
      }
    }
  }
});