import { Client } from '@elastic/elasticsearch'
import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let client

export function getElasticsearchClient() {
  if (!client) {
    client = new Client({ 
      node: 'https://localhost:9200',
      auth: {
        username: 'elastic',
        password: process.env.ELASTIC_PASSWORD
      },
      ssl: {
        ca: fs.readFileSync(path.resolve(__dirname, 'http_ca.crt')),
        rejectUnauthorized: true
      }
    })
  }
  return client
}
