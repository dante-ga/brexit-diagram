import { domain, subdomains } from '../domain/domain.js'
import { Diagrams } from '../components/diagram.js'
import { userVals, hasChoiceMissing } from '../calc/calc.js'
import { hasMissingValues } from '../calc/value.js'
import { updateView, navigate } from '../app.js'
import { getImportance } from '../stats.js'

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

const hasExternal = {}
const parseDiagram = (str, subKey, evaluating) => {
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
        cell.notify = evaluating && hasMissingValues(key).missing
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
          cell.notify = evaluating && cell.choice && hasChoiceMissing(key)
        } else {
          cell.external = true
          hasExternal[key] = true
          cell.choice = false
        }
      }
      cell.importance = !evaluating && !cell.external && getImportance(key, value)
    }
  }
  return { rows, arrows }
}

const collapsed = {}
for (const subKey in subdomains) {
  collapsed[subKey] = false
}

const onCellClick = (key, value) => {
  if (value) {
    const agent = domain[key].valuedBy[0]
    navigate(`/value/${key}/${agent}`)
  } else {
    navigate('/factor/' + key)
  }
}

export const getDiagram = (_, { evaluating }) => {
  const diagrams = []
  for (const subKey in subdomains) {
    const diagram = parseDiagram(subdomains[subKey].diagram, subKey, evaluating)
    diagram.title = subKey

    //Add visibility controls
    diagram.collapsed = collapsed[subKey]
    diagram.toggle = () => {
      collapsed[subKey] = !collapsed[subKey]
      updateView()
    }

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
    diagrams.push(diagram)
  }
  return Diagrams(diagrams, onCellClick)
}
