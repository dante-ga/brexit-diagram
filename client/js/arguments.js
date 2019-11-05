import { ArgumentsColumn, Arguments } from './components/arguments.js'
import { saveArgument } from './persist.js'

const unmodArgs = {}
let showUnmodArgs = false

const addUnmodArg = ({path, side, text}) => {
  if (!unmodArgs[path]) {
    unmodArgs[path] = { lower: [], higher: [] }
  }
  unmodArgs[path][side].push(text)
}

export const importUnmodArgs = (data) => data
  .sort((a,b) => a.microseconds - b.microseconds)
  .map(addUnmodArg)

const areaTexts = { lower: {}, higher: {} }

const getColumn = (side, sideArguments, multipleFields, path, updateView) => {
  return ArgumentsColumn({
    path,
    side,
    sideArguments,
    showUnmodArgs,
    setUnmodArgs: (val) => {
      showUnmodArgs = val
      updateView()
    },
    sideUnmodArgs: (unmodArgs[path]) ? unmodArgs[path][side] : [],
    multipleFields,
    onChange: (e) => {
      areaTexts[side][path] = e.target.value
      //Need to update view, otherwise textarea value is not reset correctly later on
      updateView()
    },
    areaText: areaTexts[side][path] || '',
    addArgument: () => {
      const text = (areaTexts[side][path] || '').trim()
      if (text) {
        saveArgument(path, side, text)
        delete areaTexts[side][path]
        addUnmodArg({path, side, text})
        updateView()
      }
    },
  })
}

export const getArguments = (_arguments={higher:[],lower:[]}, multipleFields, path, updateView) => {
  const columns = ['lower', 'higher']
    .map(side => getColumn(side, _arguments[side], multipleFields, path, updateView))
  return Arguments(columns)
}
