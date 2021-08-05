const OUTPUT_DIR = `docs`

const Project = require("../../lib/project")
const ejs = require('ejs')
const fs = require('fs')

module.exports = class Procgen extends Project {

  // Build the procgen project pages
  static build() {
    let outputDir = `${OUTPUT_DIR}/procgen`
    // If outputDir doesn't exist, then create it
    try {
      fs.accessSync(outputDir)
    } catch (err) {
      fs.mkdirSync(outputDir)
    }

    let indexPage = ejs.renderFile(`${__dirname}/lib/views/index.ejs`, {}, {}, (err,str) => {
      if (err) { throw err }
      fs.writeFile(`${outputDir}/index.html`, str, err => {
        if (err) { throw err }
      })
      console.log('built Procgen project')
    })

  }
}