import { Client } from '@elastic/elasticsearch'

let client

export function getElasticsearchClient() {
  if (!client) {
    client = new Client({ node: 'http://localhost:9200' })
  }
  return client
}
