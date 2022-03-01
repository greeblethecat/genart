export function polygonPoints(numSides, radius, center = createVector(0, 0)) {
  let points = [];
  for (let i = 0; i < numSides; i++) {
    let vertex = createVector(center.x + radius * Math.cos(2 * Math.PI * i / numSides),
      center.y + radius * Math.sin(2 * Math.PI * i / numSides));
    points.push(vertex);
  }
  return points;
}