import { writeFileSync } from 'fs'
import { dump } from 'js-yaml'
import openapiSpecification from './openapiDef.js'

const fileContents = dump(openapiSpecification, { noRefs: true })
writeFileSync('./openapi.yaml', fileContents, 'utf8')

console.log('OpenAPI YAML file has been generated!')
