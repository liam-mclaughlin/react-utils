
const ret = () => {
  let args = {}
  process.argv.forEach((value) => {
    if (value.indexOf('=') > -1) {
      let parts = value.split('=')
      let arg = (parts[0].indexOf('--') === 0)? parts[0].slice(2) : parts[0]
      let argV
      if (parts[1].indexOf(',') > -1) {
        argV = parts[1].split(',')
      } else if (parts.length === 1 || parts[1].length === 0) {
        argV = true
      } else {
        argV = parts[1]
      }
      args[arg] = argV
    } else {
      args[value] = true
    }
  })
  return args
}

module.exports = ret