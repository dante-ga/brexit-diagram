import { ValuesTable } from './components/values.js'
import { Button, Div } from './components/global.js'
import { Select } from './components/inputs.js'
import { getValueList, rescaleValues, agents, activeAgent, setAgent } from './data.js'

export const getValues = () => {
  const agentOptions = agents.map(agent => ({
    label: agent,
    value: agent,
    selected: agent === activeAgent,
  }))
  return Div([
    Select('Agent', agentOptions, setAgent),
    ValuesTable(getValueList()),
    Button({ label: 'Rescale to 100', onClick: rescaleValues }),
  ])
}
