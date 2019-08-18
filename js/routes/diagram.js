import { domain, subdomains } from '../domain/domain.js'
import { Diagrams } from '../components/diagram.js'
import { userVals } from '../calc/calc.js'
import { updateView, navigate } from '../app.js'

const parseDepends = (fn) => {
  if (!fn) return []
  const matches = fn.toString().match(/\Wc\.\w+/g)
  if (!matches) return []
  const depends = matches.map(str => str.slice(3))
  return depends
}

const hasChoice = (key) => {
  const { choice, mergeFrom, decidedBy } = domain[key]
  return (choice && !decidedBy) || mergeFrom.some(hasChoice)
}

const hasChoiceMissing = (key) => {
  const { choice, mergeFrom, decidedBy } = domain[key]
  return (choice && !decidedBy && !(key in userVals)) || mergeFrom.some(hasChoiceMissing)
}

const hasExternal = {}
const parseDiagram = (str, subKey) => {
  let locs = {}
  let arrows = []
  const rows = str
    .split('\n')
    .map(line => line.match(/\S+/g))
    .filter(row => row && (row.length > 0))
    .map((row, i) => row.map((cell, j) => {
      if (cell === '-') {
        return {}
      } else if (cell[0] === '$') {
        return ({
          key: cell.slice(1),
          value: true,
          loc: [i, j],
        })
      } else {
        const key = cell
        locs[key] = [i, j]
        return { key, loc: [i, j] }
      }
    }))
  for (const row of rows) {
    for (const cell of row) {
      const {key, value, loc} = cell
      if (!key) continue
      if (value) {
        cell.title = 'Valued by: '+domain[key].valuedBy.join(', ')
        arrows.push([locs[key], loc])
        cell.notify = true
      } else {
        const { title, calc } = domain[key]
        cell.title = title
        //Exclude external arrows
        if (domain[key].subKey === subKey) {
          parseDepends(calc)
            .filter(dk => (dk in locs) && dk !== key)
            .map(dk => locs[dk])
            .forEach(fromLoc => arrows.push([fromLoc, loc]))
          cell.choice = hasChoice(key)
          cell.decision = !!domain[key].decidedBy
          cell.notify = cell.choice && hasChoiceMissing(key)
        } else {
          cell.external = true
          hasExternal[key] = true
          cell.choice = false
        }
      }
    }
  }
  return { rows, arrows }
}

export const getDiagram = () => {
  const diagrams = []
  for (const subKey in subdomains) {
    const { diagram } = subdomains[subKey]
    diagrams.push({ subKey, ...parseDiagram(diagram, subKey) })

    for (const diagram of diagrams) {
      //Add external arrows
      diagram.extArrows = []
      for (const row of diagram.rows) {
        for (let j = 0; j < row.length; j++) {
          const { value, external, key, loc } = row[j]
          const extArrow = key && !value && !external && hasExternal[key]
          if (extArrow) {
            const blocked = row[j+1] && row[j+1].key
            const flip = domain[key].flipExtArrow
            diagram.extArrows.push({ loc, blocked, flip })
          }
        }
      }

      //Add visibility controls
      diagram.collapsed = false
      diagram.toggle = () => {
        diagram.collapsed = !diagram.collapsed
        updateView()
      }
    }
  }
  const onCellClick = (key, value) => navigate(((value) ? '/value/' : '/factor/') + key)
  return Diagrams(diagrams, onCellClick)
}
