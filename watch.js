/**
 * Starts web server to serve the github pages app locally and then
 * watches source code files, rebuilding the project when they are changed.
 */
const docsDir = __dirname + '/docs';
const express = require('express');
const server = express();
server.use('/genart', express.static(docsDir));
const port = 3000;
server.listen(port);
console.log(`Now serving: http://localhost:${port}/genart`);

const watch = require('node-watch');
const { exec } = require('child_process');
const build = require('./build')
watch(docsDir, { recursive: true }, (event, fullPath) => {
  let shortPath = fullPath.split(docsDir)[1];
  if (shortPath.includes('.ejs')) {
    if (shortPath.includes('index.ejs')) {
      build.renderIndexPage();
    } else {
      build.renderAllPieces();
    }
    console.log(`${shortPath} updated, rendered html to ${docsDir}`);
  } else {
    exec(`cp ${fullPath} ${docsDir}/${shortPath}`);
    console.log(`${shortPath} updated, copied to ${docsDir}`);
  }
});

