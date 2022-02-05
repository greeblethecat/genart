/**
 * Generates web pages and publishes them to the github pages folder.
 */
const docsDir = __dirname + '/docs';
const fs = require('fs');
const { exec, execSync } = require('child_process');
const ejs = require('ejs');
const AllPiecesJS = fs.readdirSync(`${docsDir}/js/pieces`);

function setupOutputDirs() {
  //console.log("Creating output directories");
  //[ 'js',
  //  'styles',
  //  //'assets'
  //].forEach(dir => {
  //  execSync(`mkdir -p ${Config.outputDir}/${dir}`);
  //  exec(`cp -r ${Config.viewDir}/${dir}/* ${Config.outputDir}/${dir}`);
  //});
  //execSync(`mkdir -p ${Config.outputDir}/genart`);
}

// Generate index page
function renderIndexPage() {
  console.log("Rendering index page");
  ejs.renderFile(`${docsDir}/index.ejs`, { AllPieces: AllPiecesJS.map(pieceJS => {
      return {
        id: pieceJS.split('_')[0],
        jsName: pieceJS
      };
    }) }, {}, (err, str) => {
    if (err) { throw err; }
    fs.writeFile(`${docsDir}/index.html`, str, err => {
      if (err) { throw err; }
    });
  });
}

function renderPiece(pieceJS) {
  console.log(`Rendering page for piece ${pieceJS}`);
  let piece = {
    id: pieceJS.split('_')[0],
    jsName: pieceJS,
  };
  ejs.renderFile(`${docsDir}/piece.ejs`, { piece: piece }, {}, (err, str) => {
    if (err) { throw err; }
    fs.writeFile(`${docsDir}/${piece.id}.html`, str, err => {
      if (err) { throw err; }
    });
  });
}
function renderAllPieces() {
  console.log('Rendering pages for all pieces');
  AllPiecesJS.forEach(renderPiece);
}

setupOutputDirs();
renderIndexPage();
renderAllPieces();

module.exports = {
  renderIndexPage: renderIndexPage,
  renderPiece: renderPiece,
  renderAllPieces: renderAllPieces,
}