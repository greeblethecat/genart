/**
 * Clears out html from github pages folder.
 */
const docsDir = './docs';
import { execSync } from 'child_process';
try {
  execSync(`rm ${docsDir}/*.html`)
} catch (e) {}