/*
 * Build script for the project. Generates the docs dir from views
 *
 * Kinda like a janky gradle
 */

const fs = require('fs')
const fsPromises = require('fs/promises')
const ejs = require('ejs')
const { start } = require('repl')

const VIEW_DIR = `${__dirname}/view`
const VIEW_JS_DIR = `${VIEW_DIR}/js`
const VIEW_PIECES_DIR = `${VIEW_JS_DIR}/pieces`

const OUTPUT_DIR = `${__dirname}/docs`
const OUTPUT_JS_DIR = `${OUTPUT_DIR}/js`
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
  createDirIfNotExist(OUTPUT_PIECES_DIR)

  // Copy over js libs
  createDirIfNotExist(`${OUTPUT_JS_DIR}/lib`)
  fs.readdirSync(`${VIEW_JS_DIR}/lib`).forEach(async jsFile => {
    await fsPromises.copyFile(`${VIEW_JS_DIR}/lib/${jsFile}`,
                              `${OUTPUT_JS_DIR}/lib/${jsFile}`)
  })

  // Copy over the p5.js library
  createDirIfNotExist(`${OUTPUT_JS_DIR}/vendor`)
  createDirIfNotExist(`${OUTPUT_JS_DIR}/vendor/p5`)
  await fsPromises.copyFile(`${VIEW_JS_DIR}/vendor/p5/p5.js`, `${OUTPUT_JS_DIR}/vendor/p5/p5.js`)

  // Copy over stylesheets
  createDirIfNotExist(`${OUTPUT_DIR}/styles`)
  fs.readdirSync(`${VIEW_DIR}/styles`).forEach(async styleSheet => {
    await fsPromises.copyFile(`${VIEW_DIR}/styles/${styleSheet}`,
                              `${OUTPUT_DIR}/styles/${styleSheet}`)
  })

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

const child_process = require('child_process')
function startDevServices() {
  let grep = false
  try {
    grep = child_process.execSync(`ps -e | grep http-server`)
  } catch (error) {}
  if (!grep) {
    child_process.spawn(`http-server`, ['-c0', 'docs'], {
      detached: true
    })
    console.log('started http-server', 'http://localhost:8080')
  } else {
    console.log('existing http-server', 'http://localhost:8080')
  }
  process.exit()
}
function stopDevServices() {
  let grep = false
  try {
    grep = child_process.execSync(`ps -e | grep http-server`)
  } catch (error) {}
  if (grep) {
    const command = `pkill http-server`
    let result = child_process.execSync(command)
    console.log(command, result.toString())
  } else {
    console.log('no http-server to pkill')
  }
}

const puppeteer = require('puppeteer')
async function screenshotPage(id=null) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('google.com', { waitUntil: 'networkidle2'})
  await page.screenshot({ path: `${VIEW_DIR}/assets/index.png` })
  await browser.close()
}

function defaultTask() {
  build()
  //startDevServices()
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
    case 'startDev':
      startDevServices()
      break
    case 'stopDev':
      stopDevServices()
      break
    default:
      throw new Exception(`Don't know how to run task '${TASK_ARG}'`)
      break
  }
} else {
  defaultTask()
}