/**
 * Clears out html from github pages folder.
 */
const docsDir = __dirname + '/docs';
const fs = require('fs');
const { execSync } = require('child_process');
execSync(`rm ${docsDir}/*.html`)

//console.log(`Deleting ${Config.outputDir}`);
//fs.rmSync(Config.outputDir, { recursive: true, force: true });
//console.log(`Creating empty ${Config.outputDir}`);
//fs.mkdirSync(Config.outputDir);