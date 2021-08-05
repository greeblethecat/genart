const OUTPUT_DIR = `${__dirname}/output`

const Project = require("../../lib/project")
const ejs = require('ejs')
const fs = require('fs')

module.exports = class Procgen extends Project {

  // Build the procgen project pages
  static build() {
    let indexPage = ejs.renderFile(`${__dirname}/index.ejs`, {}, {}, (err,str) => {
      if (err) { throw err }
      fs.writeFile(`${OUTPUT_DIR}/index.html`, str, err => {
        if (err) { throw err }
      })
      console.log('built Procgen project')
    })

  }
}