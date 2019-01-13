const getArgs = require('./getArgs.js')
const fs = require('fs')

const args = getArgs()
const name = args['name'] || null

if (name === null) {
  console.log("You must specify a name for your component\n\t eg. node createComponent.js name=Foo")
  process.exit()
}

const UCName = name.charAt(0).toUpperCase() + name.slice(1)
const LCName = name.charAt(0).toLowerCase() + name.slice(1)

const index = `import React from 'react'
import { connect } from 'react-redux'
import propTypes from 'prop-types'
import ${UCName} from 'components/${LCName}'

const mapStateToProps = (state) => {
  return {

  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {

  }
}

export default connect(mapStateToProps,mapDispatchToProps)(${UCName})`

const test = `
import React from 'react'
import { createMockStore } from 'redux-test-utils'
import { shallowWithStore } from 'helpers/testHelper'
import { prefix } from 'helpers/component'
import ${UCName} from './index'
//TODO: import your actions here

describe('${UCName} container', () => {
  // mock the relievent state here.
  const testState = { test: 'test' }
  const store = createMockStore(testState)
  const wrapper = shallowWithStore(<${UCName} />, store)

  it('${UCName} container - should map the store to props', () => {
    expect(wrapper).toBeInstanceOf(Object)
    // test mappings below
    expect(wrapper.prop('test')).toEqual(testState.test)
  })

  it('${UCName} container - should dispatch actions', () => {
    expect(wrapper).toBeInstanceOf(Object)
    // test correct dispatch actions below
    wrapper.props().dummyAction()
    expect(store.isActionDispatched(dummyAction()))
  })
})
`
//mk the directory
const dir = `./src/containers/${LCName}`
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir)
}

const indexFile = dir + '/index.js'
const testFile = dir + `/${LCName}.test.js`
if (fs.existsSync(indexFile)) {
  console.log(`${UCName} index.js already exists! Remove before running this script.`)
  process.exit()
}

fs.writeFile(indexFile, index, function (err) {
  if (err) {
    return console.log(err)
  } else {
    console.log(`${indexFile} created`)
    fs.writeFile(testFile, test, function (err) {
      if (err) {
        return console.log(err)
      } else {
        console.log(`${testFile} created`)
        process.exit()
      }
    })
  }
})


