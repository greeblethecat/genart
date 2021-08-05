// Load all of the Project instances from projects/
const fs = require('fs')
const projects = fs.readdirSync('projects').map(proj => {
  let project = require(`./projects/${proj}/${proj}.js`)
  project.name = proj
  return project
})

function buildAll() {
  console.log(projects)
  projects.forEach(proj => proj.build())

  console.log('ran buildAll')
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
  buildAll()
}