export const getNegotiationDistribution = (options, agentValues) => {
  const counts = {}
  for (const option of options) {
    counts[option] = 0
  }
  const agents = Object.keys(agentValues)
  setOptionCountsRec(agents, options, agentValues, counts)
  const totalCount = Math.pow(agents.length, options.length - 1)
  const dist = {}
  for (const option of options) {
    dist[option] = counts[option] / totalCount
  }
  return dist
}

const setOptionCountsRec = (agents, openOptions, agentValues, counts) => {
  if (openOptions.length > 1) {
    for (const agent of agents) {
      const newOpenOptions = removeWorstOption(openOptions, agentValues[agent])
      setOptionCountsRec(agents, newOpenOptions, agentValues, counts)
    }
  } else {
    counts[openOptions[0]]++
  }
}

//TODO: (deterministically) remove / reduce bias due to ordering of equally weighted options
const removeWorstOption = (openOptions, values) => {
  let minValue = Infinity
  let minIndex
  for (let i = 0; i < openOptions.length; i++) {
    const value = values[openOptions[i]]
    if (value < minValue) {
      minValue = value
      minIndex = i
    }
  }
  const newOpenOptions = openOptions.slice()
  newOpenOptions.splice(minIndex, 1)
  return newOpenOptions
}
