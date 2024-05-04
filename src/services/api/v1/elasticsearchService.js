/**
 * @file Defines the Elasticsearch data service.
 * @module service
 * @author Fredrik Svensson
 * @version 0.1.0
 * @since 0.1.0
 */

import { getElasticsearchClient } from '../../../config/elasticsearch.js'

const client = getElasticsearchClient()

export class ElasticsearchService {

  async createIndex() {
    const exists = await client.indices.exists({ index: 'smhi-data' })
    if (!exists) {
      await client.indices.create({
        index: 'smhi-data',
        body: {
          mappings: {
            properties: {
              key: { type: 'keyword' },
              stationname: { type: 'text' },
              location: { type: 'geo_point' },
              owner: { type: 'keyword' },
              temperature: { type: 'float' },
              windSpeed: { type: 'float' },
              windDirection: { type: 'float' },
              date: { type: 'date' }
            }
          }
        }
      })
    }
  }

  async removeIndex() {
    try {
      const exists = await client.indices.exists({ index: 'smhi-data' })
      if (exists) {
        await client.indices.delete({ index: 'smhi-data' })
      }
      console.log('Index removed:', exists)
      return exists
    } catch (error) {
      console.error('Error removing index:', error)
    }
  }
}