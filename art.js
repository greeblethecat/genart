const fs = require('fs')
const ejs = require('ejs')

// Load all of the Project instances from projects/
const projects = fs.readdirSync('projects').map(proj => {
  let project = require(`./projects/${proj}/${proj}.js`)
  project.name = proj
  return project
})

function buildIndex() {
  return new Promise((res, rej) => {
    let outputDir = `docs`
    // If outputDir doesn't exist, then create it
    try {
      fs.accessSync(outputDir)
    } catch (err) {
      fs.mkdirSync(outputDir)
    }
    ejs.renderFile(`${__dirname}/lib/views/index.ejs`, {}, {}, (err, str) => {
      if (err) { rej(err) }
      fs.writeFile(`${outputDir}/index.html`, str, err => {
        res()
        console.log('built index')
      })
    })
  })
}

async function buildAll() {
  await buildIndex()
  projects.forEach(proj => proj.build())
  console.log('ran buildAll')
}

function defaultTask() {
  buildAll()
}

// Interpret the command line argument(s), if any
const TASK_ARG_IDX = 2
const TASK_ARG = process.argv[TASK_ARG_IDX]
if (TASK_ARG) {
  switch(TASK_ARG) {
    case 'build':
      break
    default:
      throw new Exception(`Don't know how to run task '${TASK_ARG}'`)
      break
  }
} else {
  defaultTask()
}