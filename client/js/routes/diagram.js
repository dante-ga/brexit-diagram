import { domain, subdomains } from '../domain/domain.js'
import { Diagram } from '../components/diagram.js'
import { Tabs } from '../components/global.js'
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

const parseDagram = (str) => {
  const locs = {}
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
  return { rows, locs }
}


const getDiagramObj = (str, subKey, evaluating) => {
  const arrows = []
  const valuePaths = []
  const { rows, locs } = parseDagram(str)
  for (const row of rows) {
    for (const cell of row) {
      const {key, value, loc} = cell
      if (!key) continue
      if (value) {
        cell.title = 'Valued by: '+domain[key].valuedBy.join(', ')
        valuePaths.push([locs[key], loc])
        cell.notify = evaluating && hasMissingValues(key).missing
        const agent = domain[key].valuedBy[0]
        cell.path = `/value/${key}/${agent}`
        if (loc[0] !== locs[key][0]) {
          cell.shiftBack = true
        }
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
          cell.choice = false
        }
        cell.path = '/factor/' + key
      }
      cell.importance = !evaluating && !cell.external && getImportance(key, value)
      cell.onClick = (event) => navigate(cell.path, event)
    }
  }
  return { rows, arrows, valuePaths }
}

const hasExternal = {}
for (const subKey in subdomains) {
  const { rows } = parseDagram(subdomains[subKey].diagram)
  for (const row of rows) {
    for (const cell of row) {
      const {key, value} = cell
      if (key && !value && (domain[key].subKey !== subKey)) {
        hasExternal[key] = true
      }
    }
  }
}

export const getDiagram = ({subKey}, { evaluating }) => {
  //TODO: do no re-compute most of the diagramObj properties
  const diagram = getDiagramObj(subdomains[subKey].diagram, subKey, evaluating)
  diagram.extArrows = []
  for (const row of diagram.rows) {
    for (let j = 0; j < row.length; j++) {
      const { value, external, key, loc } = row[j]
      const extArrow = key && !value && !external && hasExternal[key]
      if (extArrow) {
        //TODO: do not rely on domain hints
        const blocked = row[j+1] && row[j+1].key || domain[key].blockedExtArrow
        const flip = domain[key].flipExtArrow
        diagram.extArrows.push({ loc, blocked, flip })
      }
    }
  }
  const subTabs = Object.keys(subdomains).map((sub) => ({
    label: sub.toUpperCase(),
    active: sub === subKey,
    onClick: (event) => navigate('/diagram/'+sub, event),
    path: '/diagram/'+sub,
  }))
  const content = [
    Tabs(subTabs),
    Diagram(diagram),
  ]
  return { content, title: subKey.toUpperCase() }
}
