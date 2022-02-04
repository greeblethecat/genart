/**
 * Starts web server to serve the github pages app locally and then
 * watches source code files, rebuilding the project when they are changed.
 */
const Config = require('./config');


const express = require('express');
const server = express();
server.use('/genart', express.static(Config.outputDir));
const port = 3000;
server.listen(port);
console.log(`Now serving: http://localhost:${port}/genart`);

const watch = require('node-watch');
const { exec } = require('child_process');
watch(Config.viewDir, { recursive: true }, (event, fullPath) => {
  let shortPath = fullPath.split(Config.viewDir)[1];
  exec(`cp ${fullPath} ${Config.outputDir}/${shortPath}`);
  console.log(`${shortPath} updated, copied to ${Config.outputDir}`);
});

