/**
 * Generates web pages and publishes them to the github pages folder.
 */
const docsDir = './docs';
import fs from 'fs';
import ejs from 'ejs';

const AllPiecesJS = fs.readdirSync(`${docsDir}/js/pieces`);

// Generate index page
function renderIndexPage(verbose = true) {
  if (verbose) console.log('Rendering index page');
  ejs.renderFile(`${docsDir}/index.ejs`, {
    AllPieces: AllPiecesJS.map(pieceJS => {
      return {
        id: pieceJS.split('_')[0],
        jsName: pieceJS
      };
    })
  }, {}, (err, str) => {
    if (err) {
      throw err;
    }
    fs.writeFile(`${docsDir}/index.html`, str, err => {
      if (err) {
        throw err;
      }
    });
  });
}

async function renderPiece(pieceJS, verbose = true) {
  if (verbose) console.log(`Rendering page for piece ${pieceJS}`);
  const pieceObj = await import('./docs/js/pieces/' + pieceJS);
  const piece = {
    pieceNum: pieceJS.split('_')[0],
    jsName: pieceJS,
    pieceObj: pieceObj,
  };
  ejs.renderFile(`${docsDir}/piece.ejs`, {piece: piece}, {}, (err, str) => {
    if (err) {
      throw err;
    }
    fs.writeFile(`${docsDir}/${piece.pieceNum}.html`, str, err => {
      if (err) {
        throw err;
      }
    });
  });
}

function renderAllPieces(verbose = true) {
  if (verbose) console.log('Rendering pages for all pieces');
  AllPiecesJS.forEach((piece) => renderPiece(piece, verbose));
}

renderIndexPage();
renderAllPieces();

export default {
  renderIndexPage: renderIndexPage,
  renderPiece: renderPiece,
  renderAllPieces: renderAllPieces,
};