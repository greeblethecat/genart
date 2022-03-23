/**
 * Clears out html from github pages folder.
 */
const docsDir = './docs';
import fs from 'fs';
import { execSync } from 'child_process';
execSync(`rm ${docsDir}/*.html`)

//console.log(`Deleting ${Config.outputDir}`);
//fs.rmSync(Config.outputDir, { recursive: true, force: true });
//console.log(`Creating empty ${Config.outputDir}`);
//fs.mkdirSync(Config.outputDir);