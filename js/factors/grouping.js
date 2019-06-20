import { Grouping } from '../components/factors.js'
import { Select } from '../components/inputs.js'
import { Div } from '../components/global.js'
import { updateView } from '../app.js'

let starredIds = new Set()
if (localStorage.getItem('starredIds')) {
  starredIds = new Set(JSON.parse(localStorage.getItem('starredIds')))
}

const toggleStar = (id, starred) => () => {
  (starred) ? starredIds.delete(id) : starredIds.add(id)
  updateView()
  localStorage.setItem('starredIds', JSON.stringify([...starredIds]))
}

const tagFactors = [
  {label: 'Scotland', ids: new Set(["independentScotland:Scotland:value","scotlandInEu:Scotland:value","scotlandApproval:domain","independentScotland:domain","scotlandEuMember:domain","Scotland:totalValue","scotlandInEu:domain","brexitApproval:domain"])},
]

let activeTag = 'starred'

export const visibleById = (id) => {
  if (activeTag === 'all') {
    return true
  } else if (activeTag === 'starred') {
    return starredIds.has(id)
  } else {
    return tagFactors
      .find(({label}) => label === activeTag)
      .ids
      .has(id)
  }
}

export const GroupingById = (id) => {
  if (activeTag === 'all') {
    const starred = starredIds.has(id)
    const tags = tagFactors
      .filter(({ids}) => ids.has(id))
      .map(({label}) => label)
    return Grouping(tags, starred, toggleStar(id, starred))
  }
}

const tagLabels = ['all', 'starred', ...tagFactors.map(({label}) => label)]

const setTag = (tag) => {
  activeTag = tag
  updateView()
}

export const Filter = () => {
  const tagOptions = tagLabels.map(tag => ({
    label: tag,
    value: tag,
    selected: tag === activeTag,
  }))
  return Select('Tag', tagOptions, setTag)
}
