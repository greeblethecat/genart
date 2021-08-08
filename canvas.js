/*
 * Build script for the project. Generates the docs dir from views
 *
 * Kinda like a janky gradle
 */

const fs = require('fs')
const fsPromises = require('fs/promises')
const ejs = require('ejs')

const VIEW_DIR = `${__dirname}/view`
const VIEW_JS_DIR = `${VIEW_DIR}/js`
const VIEW_VENDOR_DIR = `${VIEW_JS_DIR}/vendor`
const VIEW_PIECES_DIR = `${VIEW_JS_DIR}/pieces`

const OUTPUT_DIR = `${__dirname}/docs`
const OUTPUT_JS_DIR = `${OUTPUT_DIR}/js`
const OUTPUT_VENDOR_DIR = `${OUTPUT_JS_DIR}/vendor`
const OUTPUT_PIECES_DIR = `${OUTPUT_JS_DIR}/pieces`

function createDirIfNotExist(dir) {
    try {
      fs.accessSync(dir)
    } catch (err) {
      fs.mkdirSync(dir)
    }
}

async function clean() {
  //fs.rmdir(OUTPUT_DIR, { recursive: true }, (err) => {
  //})
  await fsPromises.rm(OUTPUT_DIR, { recursive: true, force: true })
  createDirIfNotExist(OUTPUT_DIR)
}

async function assembleBoilerplate() {
  createDirIfNotExist(OUTPUT_JS_DIR)
  createDirIfNotExist(OUTPUT_VENDOR_DIR)
  createDirIfNotExist(OUTPUT_PIECES_DIR)

  // Copy over the p5.js src
  createDirIfNotExist(`${OUTPUT_VENDOR_DIR}/p5`)
  await fsPromises.copyFile(`${VIEW_VENDOR_DIR}/p5/p5.js`, `${OUTPUT_VENDOR_DIR}/p5/p5.js`)

  // Assemble index.ejs page
  await new Promise((resolve, reject) => {
    ejs.renderFile(`${VIEW_DIR}/index.ejs`, {}, {}, (err, str) => {
      if (err) { reject(err) }
      fs.writeFile(`${OUTPUT_DIR}/index.html`, str, err => {
        if (err) { reject(err) }
        resolve()
      })
    })
  })

  console.log('assembled boilerplate')
}

async function assemblePieces() {
  // Load all of the pieces
  const allPieces = fs.readdirSync(VIEW_PIECES_DIR)
  allPieces.forEach(async pieceName => {
    await fsPromises.copyFile(`${VIEW_PIECES_DIR}/${pieceName}`, `${OUTPUT_PIECES_DIR}/${pieceName}`)
  })
  console.log(allPieces)
  console.log(`assembled ${allPieces.length} pieces`)
}

async function assemble() {
  await assembleBoilerplate()
  await assemblePieces()
  console.log('finished assemble')
}

async function build() {
  await clean()
  await assemble()
  console.log('finished build')
}

function defaultTask() {
  build()
}

// Interpret the command line argument(s), if any
const TASK_ARG_IDX = 2
const TASK_ARG = process.argv[TASK_ARG_IDX]
if (TASK_ARG) {
  switch(TASK_ARG) {
    case 'clean':
      clean()
      break
    case 'assemble':
      clean()
      assemble()
      break
    case 'build':
      build()
      break
    default:
      throw new Exception(`Don't know how to run task '${TASK_ARG}'`)
      break
  }
} else {
  defaultTask()
}