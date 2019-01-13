const getArgs = require('./getArgs.js')
const fs = require('fs')

const args = getArgs()
const name = args['name'] || null
const cType = args['type'] || 'functional'

if (name === null) {
  console.log("You must specify a name for your component\n\t eg. node createComponent.js name=Foo")
  process.exit()
}

const UCName = name.charAt(0).toUpperCase() + name.slice(1)
const LCName = name.charAt(0).toLowerCase() + name.slice(1)

if (['functional', 'class'].indexOf(cType) === -1) {
  console.log('You must specify a type for your component (\'class\',\'functional\')\n\t eg. node createComponent.js name=Foo type=functional')
  process.exit()
}

const index = `export { default } from './${LCName}';`

let component = ''
if (cType === 'class') {
  component = `import React, { Component } from 'react';
import propTypes from 'prop-types';

import s from './${LCName}.scss';


class ${UCName} extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  componentDidMount() {

  }
  render() {
    return (<div id="${UCName}" className={s.container}>
      <p>Hi, I am a ${UCName} component</p>
      </div>);
  }
}

${UCName}.propTypes = {
  
}

${UCName}.defaultProps = {
  
}

export default ${UCName};`
} else {
  component = `import React from 'react';
import propTypes from 'prop-types';

import s as './${LCName}.scss';

const ${UCName} = (props) => {
  return (<div id="${UCName}" className={s.container}>
    <p>Hi, I am a ${UCName} component</p>
  </div>);
};

${UCName}.propTypes = {
  
}

${UCName}.defaultProps = {
  
}

export default ${UCName}`
}

const scss = ``;

const testFile = `
import React from 'react';
import ${UCName} from './index';
import { shallow } from 'enzyme';

describe('${UCName} Component', () => {
  it('renders', () => {
    //Example - 
    const wrapper = shallow(<${UCName} />)
    expect(wrapper.find('#${UCName}').length).toEqual(1)
  })
})`

//mk the directory
const dir = `./src/components/${UCName}`
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
    fs.writeFile(dir + `/${LCName}.js`, component, function (err) {
      if (err) {
        return console.log(err)
      } else {
        console.log(dir + `/${LCName}.js created`)
        fs.writeFile(dir + `/${LCName}.scss`, scss, function (err) {
          if (err) {
            return console.log(err)
          } else {
            console.log(dir + `/${LCName}.scss created`)
            fs.writeFile(dir + `/${LCName}.test.js`, testFile, function (err) {
              if (err) {
                return console.log(err)
              } else {
                console.log(dir + `/${LCName}.test.js created`)
                process.exit()
              }
            })
          }

        })
      }

    })
  }
})