export function round2tenth(num) {
  return Math.round(num * 10) / 10
}

export const camel2space = str => str.replace( /([A-Z])/g, " $1" ).toLowerCase()

export const bn = 1000000000

export const debounce = (func, wait, initial, state) => {
  return function executedFunction() {
    const context = this
    const args = arguments

    const later = function() {
      if (state.subsequent) {
        func.apply(context, args)
      }
      delete state.timeout
      delete state.subsequent
    }

    if (initial && !state.timeout) {
      func.apply(context, args)
    } else {
      state.subsequent = true
    }
    clearTimeout(state.timeout)
    state.timeout = setTimeout(later, wait)
  }
}

export const clone = obj => JSON.parse(JSON.stringify(obj))

//https://stackoverflow.com/a/2117523
export const uuidv4 = () => ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
  (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
)
