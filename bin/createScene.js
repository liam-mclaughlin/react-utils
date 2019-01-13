const getArgs = require('./getArgs.js')
const fs = require('fs')

const args = getArgs()
const name = args['name'] || null
const cType = args['type'] || 'functional'

if (name === null) {
  console.log("You must specify a name for your scene\n\t eg. node createScene.js name=Foo")
  process.exit()
}

const UCName = name.charAt(0).toUpperCase() + name.slice(1)
const LCName = name.charAt(0).toLowerCase() + name.slice(1)

if (['functional', 'class'].indexOf(cType) === -1) {
  console.log('You must specify a type for your component (\'class\',\'functional\')\n\t eg. node createScene.js name=Foo type=functional')
  process.exit()
}

let index = ''
if (cType === 'class') {
  index = `import React, { Component } from 'react'
import propTypes from 'prop-types'
import { prefix } from 'helpers/component'

import './${LCName}.scss'

const getClass = prefix('${LCName}')
class ${UCName} extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }
  componentDidMount() {

  }
  render() {
    return (<div className={getClass('container')}>
        ${UCName}
      </div>)
  }
}

${UCName}.propTypes = {
  
}

${UCName}.defaultProps = {
  
}

export default ${UCName}`
} else {
  index = `import React from 'react'
import propTypes from 'prop-types'
import { prefix } from 'helpers/component'

import './${LCName}.scss'

const getClass = prefix('${LCName}-')
const ${UCName} = (props) => {
  return (<div className={getClass('container')}>

  </div>)
}

${UCName}.propTypes = {
  
}

${UCName}.defaultProps = {
  
}

export default ${UCName}`
}

const scss = `@import '_global.scss';

$prefix: ${LCName}-;

.#{$prefix} {
  
}`

//mk the directory
const dir = `./src/scenes/${LCName}`
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir)
}

const indexFile = dir + '/index.js'

if (fs.existsSync(indexFile)) {
  console.log(`${UCName} index.js already exists! Remove before running this script.`)
  process.exit()
}

fs.writeFile(indexFile, index, function (err) {
  if (err) {
    return console.log(err)
  } else {
    console.log(dir + '/index.js created')
    fs.writeFile(dir + `/${LCName}.scss`, scss, function (err) {
      if (err) {
        return console.log(err)
      } else {
        console.log(dir + `/${LCName}.scss created`)
      }
      process.exit()
    })
  }
})