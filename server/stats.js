import './mock_dom.js'
import { domain, getMainDecision } from '../client/js/domain/domain.js'
import AWS from 'aws-sdk'
import { importUserVals, userVals } from '../client/js/calc/calc.js'
import { importUserValues } from '../client/js/routes/values.js'

const valPref = 'val_'
const valuePref = 'value_'

const attributes = []
for (const key in domain) {
  const { choice, decidedBy, valuedBy, type, options } = domain[key]
  if (choice && !decidedBy) {
    attributes.push(valPref + key)
  }
  if (valuedBy) {
    for (const agent of valuedBy) {
      if (type === 'option') {
        for (const option in options) {
          attributes.push(valuePref + agent + '_' + key + '_' + option)
        }
      } else {
        attributes.push(valuePref + agent + '_' + key)
      }
    }
  }
}

AWS.config.update({region: 'eu-west-1'})
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'})

const main = async () => {
  const dbResponse = await ddb.scan({
    TableName: 'Users',
    ProjectionExpression: attributes.join(','),
    FilterExpression: 'attribute_exists (complete)'
  }).promise()
  const users = dbResponse.Items.map(AWS.DynamoDB.Converter.unmarshall)
  for (const user of users) {
    importUserVals(user)
    importUserValues(user)
    const decision = getMainDecision(userVals)
    console.log(decision)

    //CONTINUE HERE!!!!
    //CONTINUE HERE!!!!
    //CONTINUE HERE!!!!
    //CONTINUE HERE!!!!
    //TODO: make all user inputs into simple sliders
    //TODO: calculate average oppinions from the two sides
  }
}
main()
