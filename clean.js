/**
 * Clears out the github pages folder.
 */
const Config = require('./config');
const fs = require('fs');
console.log(`Deleting ${Config.outputDir}`);
fs.rmSync(Config.outputDir, { recursive: true, force: true });
console.log(`Creating empty ${Config.outputDir}`);
fs.mkdirSync(Config.outputDir);