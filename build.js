const Config = require('./config');
const fs = require('fs');
const { exec, execSync } = require('child_process');
const ejs = require('ejs');
const AllPiecesJS = fs.readdirSync(`${Config.viewDir}/js/pieces`);

console.log('AllPiecesJS', AllPiecesJS);

// Setup output directories
[ 'js',
  'js/pieces',
  'js/vendor',
  'js/lib',
  'styles',
  'assets'
].forEach(dir => {
  execSync(`mkdir -p ${Config.outputDir + '/' + dir}`);
});

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

//console.log(AllPiecesJS);

// Copy to output dir
exec(`cp -r ${Config.viewDir}/js/* ${Config.outputDir}/js`);
exec(`cp -r ${Config.viewDir}/assets/* ${Config.outputDir}/assets`);

//console.log("build.js", AllPiecesJS);