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

const AllPieces = fs.readdirSync(VIEW_PIECES_DIR).map(jsName => {
  let pieceId = undefined
  let pieceName = undefined
  try {
    pieceId = jsName.split('_')[0]
    pieceName = jsName.split('_')[1].split('.')[0]
    if (!pieceId && !pieceName) {
      throw new Error('undefined piece name or id')
    }
  } catch (err) {
    console.log(`error parsing piece js from fileName '${jsName}'.`)
    console.log(`name should be in format XXXX_pieceNameGoesHere.js`)
    throw err
  }
  return {
    name: pieceName,
    id: pieceId,
    jsName: jsName,
  }
})

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
  console.log('finished clean')
}

async function assembleBoilerplate() {
  createDirIfNotExist(OUTPUT_JS_DIR)
  createDirIfNotExist(OUTPUT_VENDOR_DIR)
  createDirIfNotExist(OUTPUT_PIECES_DIR)

  // Copy over the p5.js library
  createDirIfNotExist(`${OUTPUT_VENDOR_DIR}/p5`)
  await fsPromises.copyFile(`${VIEW_VENDOR_DIR}/p5/p5.js`, `${OUTPUT_VENDOR_DIR}/p5/p5.js`)

  await assembleIndexPage()

  console.log('assembled boilerplate')
}

async function assembleIndexPage() {
  // Assemble index.ejs page
  await new Promise((resolve, reject) => {
    ejs.renderFile(`${VIEW_DIR}/index.ejs`, {
      AllPieces: AllPieces,
    }, {}, (err, str) => {
      if (err) { reject(err) }
      fs.writeFile(`${OUTPUT_DIR}/index.html`, str, err => {
        if (err) { reject(err) }
        resolve()
      })
    })
  })
}

async function assemblePieces() {

  // Copy the js for each piece to the docs dir
  AllPieces.forEach(async piece => {
    await fsPromises.copyFile(`${VIEW_PIECES_DIR}/${piece.jsName}`, `${OUTPUT_PIECES_DIR}/${piece.jsName}`)
  })

  // Compile piece.ejs for each piece and place html output to the docs dir
  AllPieces.forEach(piece => {
    ejs.renderFile(`${VIEW_DIR}/piece.ejs`, {
      piece: piece
    }, {}, (err, str) => {
      if (err) { throw err }
      fs.writeFile(`${OUTPUT_DIR}/${piece.id}.html`, str, err => {
        if (err) { throw err }
      })
    })
  })
  console.log('allPieces=', AllPieces)
  console.log(`assembled ${AllPieces.length} pieces`)
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

function startDevServices() {
  // TODO: configure and start express server
}

function defaultTask() {
  build()
  startDevServices()
}

// Interpret the command line argument(s), if any
const TASK_ARG_IDX = 2
const TASK_ARG = process.argv[TASK_ARG_IDX]
if (TASK_ARG) {
  switch (TASK_ARG) {
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