import { html } from '../../third_party/lit-html/lit-html.js'

const suffix = '@brexitdiagram.uk'

const articles = {
  project: html`
    <h1 class="title has-text-centered">
      About this project
    </h1>
    <p>
      The question of Brexit has split British society like no other. This can be explained by the differences in people's values and the complexity of the subject. Moreover, traditional debate formats don't seem to be able to bring us closer to a <strong>consensus</strong>. This project is a platform designed to tackle these issues.
    </p>
    <p>
      Brexit has the potential to influence a web of hundreds of factors. One way in which decisions of such complexity are made in business and in this project is by constructing an <strong>influence diagram</strong>. The diagram shows which factors influence one another. Under the hood there is a mathematical model which describes numerically how exactly those factors are connected. Breaking down one big argument into small arguments about individual factors facilitates a focused discussion. At the same time, the underlying mathematical model binds everything together calculating the final conclusion.
    </p>
    <p>
      The Brexit diagram used in this project for the most part separates questions about facts from <strong>questions about values</strong>. This should indicate where the consensus can be achieved by providing more and better evidence and where the consensus is less likely and emotional statements can be appropriate.
    </p>
    <p>
      Usually arguments are formed by discussing truthfulness of statements. In contrast, all of the sub-arguments presented in this project are about <strong>questions of degree</strong>, a point on a continuum. Such format is more appropriate for discussing trade, immigration, budget and many other aspects of Brexit. Unlike other debating platforms, here sub-arguments are connected by a mathematical model. This means that by supporting or opposing a particular sub-argument and changing the degree of support of others you have a measurable effect on the overall conclusion. Without this opposing sides can maintain their separate positions by just focusing on sub-arguments which are in their favour.
    </p>
    <p>
      Finally, this project does not aim to make an authoritative conclusion about Brexit. Instead, it's a new tool which will hopefully make the Brexit debate more productive.
    </p>
  `,
  author: html`
    <h1 class="title has-text-centered">
      Author
    </h1>
    <p>
      At a young age I was inspired by success of projects like Wikipedia. The potential of mass cooperation via the Internet and software has fascinated me ever since. I moved to the UK to study at a school and then a university to finally graduate with a Mathematics and Computer Science degree.
    </p>
    <p>
      While working as a Web Developer for a number of years, I became interested in tackling the complexity of conflict resolution using the knowledge and skill that I acquired from my degree. I recently started working full time on this project and I'm looking for people interested in similar things and potential collaborators.
    </p>
  `,
  algo: html`
    <h1 class="title has-text-centered">
      Algorithms
    </h1>
    <p>
      Short descriptions of the most important algorithms used in this project are provided below.
    </p>

    <h2>Decision</h2>
    <p>
      The rational agent model is used to calculate decisions. This means that when making a decision, the agent (which is a political entity in our case) calculates expected values for each of options and picks the highest one. The use of <strong>expected</strong> values allows evaluation of options with uncertain outcomes.
    </p>

    <h2>Negotiation</h2>
    <p>
      When modeling probability of an outcome in a negotiation I wanted to pick an algorithm which would have the following characteristics.
      <ul>
        <li>If a win-win option exists it should always be picked.</li>
        <li>Loose-loose options should never be picked.</li>
        <li>In all other cases the outcome should be uncertain.</li>
        <li>Options which are generally more valuable should be more likely to be picked.</li>
      </ul>
      The algorithm calculates probabilistic distribution which is equivalent to the following random process.
      <ol type="1">
        <li>An agent is picked at random.</li>
        <li>The agent removes the option from the table that is the worst for him.</li>
        <li>Steps 1 and 2 repeat until only one option is left.</li>
        <li>The remaining option is picked.</li>
      </ol>
    </p>

    <h2>Significance of a disagreement</h2>
    <p>
      Significance of disagreements are indicated on the influence diagram by red exclamation marks. The significances are calculated in the following way.
      <ol type="1">
        <li>Answers from people who were recommended the same Brexit option by the decision algorithm are combined to create average profiles.</li>
        <li>Total Brexit option values for each of the profiles are calculated.</li>
        <li>Then for each of the nodes in the diagram, answers of the profile are substituted by answers in another profile and total values are recalculated.</li>
        <li>The amount of points by which the total value shifted determines the significance of disagreement (low/significant/critical).</li>
      </ol>
    </p>
  `,
  future: html`
    <h1 class="title has-text-centered">
      Future plans
    </h1>
    <h2>Stage 0</h2>
    <p>
      This was the previous stage dedicated to the project called Gitarg. Its aim was to explore the possibility of creating a tool analogous to Git but for arguments/debates. Git allows very large groups of programmers to solve complex problems by working independently on their separate parts. Gitarg could potentially create high quality arguments but it was also very formal and required very detailed and complex models to describe the subject matter. This stage has mostly involved research into argumentation, philosophy and some advanced computer algorithms.
    </p>
    <h2>Stage 1</h2>
    <p>
      This is the current stage dedicated to BrexitDiagram.uk. This website is an evolution of Gitarg which aims at finding a happy medium between formal and informal processes of argumentation. Its target audience is the public interested in Brexit rather than people who want to build mathematical models themselves. During this stage I will continue to gather feedback and make adjustments to the website.
    </p>
    <h2>Stage 2</h2>
    <p>
      This stage will involve adding 3-5 other topics beside Brexit. This will help me to understand how generalisable is this approach to argumentation and hopefully attract a wider audience.
    </p>
    <h2>Stage 3</h2>
    <p>
      Finally, this stage will consist of creating a platform where editors will be able to create arguments about topics of their choosing. This involves some technical challenges such as creating a general algorithm for solving arbitrary rich influence diagrams.
    </p>
    <h2>Stage 4</h2>
    <p>
      This is a very hypothetical stage which will aim at implementing some of the ambitious goals of Gitarg. It may involve some advanced intelligence feature such as a semantic reasoner and natural language generation.
    </p>
  `,
}

export const Article = (topic) => html`
  <div class="content">
    ${articles[topic]}
  </div>
`
