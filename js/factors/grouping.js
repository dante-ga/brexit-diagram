import { Grouping } from '../components/factors.js'
import { Select } from '../components/inputs.js'
import { Div } from '../components/global.js'
import { updateView } from '../app.js'
import { domain, subKeys } from '../domain/domain.js'

let starredIds = new Set()
if (localStorage.getItem('starredIds')) {
  starredIds = new Set(JSON.parse(localStorage.getItem('starredIds')))
}

const toggleStar = (id, starred) => () => {
  (starred) ? starredIds.delete(id) : starredIds.add(id)
  updateView()
  localStorage.setItem('starredIds', JSON.stringify([...starredIds]))
}

let activeTag = 'starred'

export const isVisible = (id, key) => {
  if (activeTag === 'all') {
    return true
  } else if (activeTag === 'starred') {
    return starredIds.has(id)
  } else {
    if (starredIds.has(id)) {
      return true
    } else if (key) {
      return domain[key].subKey === activeTag
    } else {
      return false
    }
  }
}

export const getGrouping = (id, key) => {
  if (activeTag === 'all') {
    const starred = starredIds.has(id)
    const tags = (key) ? [ domain[key].subKey ] : []
    return Grouping(tags, starred, toggleStar(id, starred))
  }
}

const tagLabels = ['all', 'starred', ...subKeys]

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
