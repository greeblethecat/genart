/**
 * Generates web pages and publishes them to the github pages folder.
 */
const Config = require('./config');
const fs = require('fs');
const { exec, execSync } = require('child_process');
const ejs = require('ejs');
const AllPiecesJS = fs.readdirSync(`${Config.viewDir}/js/pieces`);

// Setup output directories and copy from view
console.log("Creating output directories");
[ 'js',
  'styles',
  'assets'
].forEach(dir => {
  execSync(`mkdir -p ${Config.outputDir}/${dir}`);
  exec(`cp -r ${Config.viewDir}/${dir}/* ${Config.outputDir}/${dir}`);
});
execSync(`mkdir -p ${Config.outputDir}/genart`);

// Generate index page
ejs.renderFile(`${Config.viewDir}/index.ejs`, { AllPieces: AllPiecesJS.map(pieceJS => {
  return {
    id: pieceJS.split('_')[0],
    jsName: pieceJS
  };
  }) }, {}, (err, str) => {
  if (err) { throw err; }
  fs.writeFile(`${Config.outputDir}/index.html`, str, err => {
    if (err) { throw err; }
  });
});

// Generate piece pages
AllPiecesJS.forEach(pieceJS => {
  let piece = {
    id: pieceJS.split('_')[0],
    jsName: pieceJS,
  };
  ejs.renderFile(`${Config.viewDir}/piece.ejs`, { piece: piece }, {}, (err, str) => {
    if (err) { throw err; }
    fs.writeFile(`${Config.outputDir}/${piece.id}.html`, str, err => {
      if (err) { throw err; }
    });
  });
});
