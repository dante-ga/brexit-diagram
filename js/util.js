export function round2tenth(num) {
  return Math.round(num * 10) / 10
}

export const camel2space = str => str.replace( /([A-Z])/g, " $1" ).toLowerCase()


export function debounce(func, wait, initial) {
  var timeout

  return function executedFunction() {
    var context = this
    var args = arguments

    var later = function() {
      timeout = null
      func.apply(context, args)
    }

    var callNow = initial && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}
