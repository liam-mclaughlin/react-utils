export const cleanHtmlFromStr = (str) => {
  let cleanStr = ''
  //Use the browser to clean the html
  if (str) {
    const div = document.createElement("div")
    div.innerHTML = str
    cleanStr = div.innerText
    div.remove()
  }
  return cleanStr
}

// Capitalizes a string
export const capitalize = string => string.replace(/\b\w/g, l => l.toUpperCase())

export const isTouch = () => window.isTouch

// gets the offset for an element (like jquery offset)
export const offset = (elem) => {
  if (elem) {
    const box = elem.getBoundingClientRect()

    const body = document.body
    const docEl = document.documentElement

    const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop
    const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft

    const clientTop = docEl.clientTop || body.clientTop || 0
    const clientLeft = docEl.clientLeft || body.clientLeft || 0

    const top = box.top + scrollTop - clientTop
    const left = box.left + scrollLeft - clientLeft
    return {
      top: Math.round(top),
      left: Math.round(left)
    }
  }
  return null
}

export const redirectPost = (url, data) => {
  const form = document.createElement('form')
  document.body.appendChild(form)
  form.method = 'post'
  form.action = url
  for (const name in data) {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = name
    input.value = data[name]
    form.appendChild(input)
  }
  form.submit()
}

export const debounce = (fn, delay) => {
  let timer = null
  return function () {
    const context = this,
      args = arguments
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(context, args)
    }, delay)
  }
}