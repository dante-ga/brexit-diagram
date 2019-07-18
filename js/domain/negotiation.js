const factors = {
  marketMovement: {
    type: 'option',
    title: 'UK-EU negotiations',
    desc: 'UK-EU single market and freedom of movement combination',
    options: {
      marketAndMovement: 'Single market and freedom of movement',
      onlyMarket: 'Only single market',
      onlyMovement: 'Only freedom of movement',
      noMarketNoMovement: 'No single market and no freedom of movement',
    },
    choice: true,
    disableOptions: c => (c.ukInEu) ? ['onlyMarket', 'onlyMovement', 'noMarketNoMovement'] : [],
    calc: c => (c.ukInEu) ? 'marketAndMovement' : c.marketMovement,
  },
  singleMarket: {
    type: 'boolean',
    title: 'Single market',
    desc: "The UK is effectively in EU's single market.",
    calc: c => ['marketAndMovement', 'onlyMarket'].includes(c.marketMovement),
  },
  freedomOfMovement: {
    type: 'boolean',
    title: 'Freedom of movement',
    desc: "There is effectively freedom of movement between the UK and the EU.",
    calc: c => ['marketAndMovement', 'onlyMovement'].includes(c.marketMovement),
  },
  marketMovementTied: {
    type: 'boolean',
    title: 'Market tied to movement',
    desc: "The access to the single market and the freedom of movement across the EU are tied together.",
    calc: c => ['marketAndMovement', 'noMarketNoMovement'].includes(c.marketMovement),
    valuedBy: ['EU'],
  }
}

const grid = `
  -      -              singleMarket      -                  -
  ukInEu marketMovement -                 marketMovementTied $marketMovementTied
  -      -              freedomOfMovement -                  -
`

export const negotiation = { factors, grid }
