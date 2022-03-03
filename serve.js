/**
 * Starts web server to serve the github pages app locally and then
 * watches source code files, rebuilding the project when they are changed.
 */
const build = require('./build'); // watch depends on build
const express = require('express');
const {exec} = require('child_process');

const DocsDir = __dirname + '/docs';
const Port = 3000;
const app = express();
app.use('/genart', express.static(DocsDir));
app.listen(Port);

console.log(`Now serving: http://localhost:${Port}/genart`);

const readline = require('readline');

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }))
}

(async () => {
  console.log('Press enter to rebuild all pages.');
  while (true) {
    let response = await askQuestion("");
    build.renderAllPieces(false);
    build.renderIndexPage(false);
    console.log(Date.now(), 'rebuilt all pages.');
  }
})();