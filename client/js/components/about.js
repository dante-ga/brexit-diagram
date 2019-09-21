const { html } = lighterhtml

export const Article = (title) => html`
  <h1 class="title has-text-centered">
    ${title}
  </h1>
`
