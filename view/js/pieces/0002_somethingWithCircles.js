const w = window.innerWidth;
const h = window.innerHeight;

const AllPoints = [];
let DrawnPoints = [];

function setup() {
  createCanvas(w, h);
}

function draw() {
  background(0, 0, 0);
  fill('red');
  circle(0,0, 100);
}
