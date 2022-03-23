/**
 * Starts web server to serve the github pages app locally and then
 * watches source code files, rebuilding the project when they are changed.
 */
import build from './build.js'; // watch depends on build
import express from 'express';
import {exec} from 'child_process';
import readline from 'readline';

const DocsDir = './docs';
const Port = 3000;
const app = express();
app.use('/genart', express.static(DocsDir));
app.listen(Port);

console.log(`Now serving: http://localhost:${Port}/genart`);


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