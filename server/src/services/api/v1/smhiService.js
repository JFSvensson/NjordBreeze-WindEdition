/**
 * @file Defines the SMHI weather station data service.
 * @module service
 * @author Fredrik Svensson
 * @version 0.1.0
 * @since 0.1.0
 */

import { SMHIStation } from '../../../models/smhiStation.js'
import { getElasticsearchClient } from '../../../config/elasticsearch.js'
// import { ElasticsearchService } from './elasticsearchService.js'

const client = getElasticsearchClient()
// const elasticService = new ElasticsearchService()

export class SMHIService {

  async fetchAndStoreDataForAllStations() {

    // await elasticService.removeIndex()
    // await elasticService.createIndex()

    try {
      // Fetch all stations
      const allStationsResponse = await fetch('https://opendata-download-metobs.smhi.se/api/version/1.0/parameter/1/station-set/all/period/latest-hour/data.json')
      const allStationsData = await allStationsResponse.json()
  
      let indexedStationsCount = 0

      // Prepare bulk operations
      const bulkOps = []
  
    // Fetch data for each station and prepare bulk operation
    for (const station of allStationsData.station) {
      try {
        const temperatureResponse = await fetch(`https://opendata-download-metobs.smhi.se/api/version/latest.json/parameter/1/station/${station.key}/period/latest-months/data.json`)
        const temperatureData = await temperatureResponse.json()

        const windSpeedResponse = await fetch(`https://opendata-download-metobs.smhi.se/api/version/latest.json/parameter/4/station/${station.key}/period/latest-months/data.json`)
        const windSpeedData = await windSpeedResponse.json()

        const windDirectionResponse = await fetch(`https://opendata-download-metobs.smhi.se/api/version/latest.json/parameter/3/station/${station.key}/period/latest-months/data.json`)
        const windDirectionData = await windDirectionResponse.json()

        // Prepare bulk operation
        // const bulkOps = [{ index: { _index: 'smhi-data', _id: station.key }}, { ...temperatureData, windSpeed: windSpeedData.value, windDirection: windDirectionData.value }]
        const bulkOps = temperatureData.value.map(item => {
          const windSpeedItem = windSpeedData.value.find(windItem => windItem.date === item.date)
          const windDirectionItem = windDirectionData.value.find(windItem => windItem.date === item.date)
        
          return [
            { index: { _index: 'smhi-data', _id: `${station.key}-${item.date}` } },
            { 
              key: station.key,
              stationname: station.stationname,
              location: {
                type: "Point",
                coordinates: [station.longitude, station.latitude]
              },
              owner: station.owner,
              date: item.date, 
              temperature: item.value, 
              windSpeed: windSpeedItem ? windSpeedItem.value : null, 
              windDirection: windDirectionItem ? windDirectionItem.value : null 
            }
          ]
        })

        // Execute bulk operation
        const bulkResponse = await client.bulk({ refresh: true, body: bulkOps.flat() })
        console.log('Bulk operation executed successfully for station', station.key)
        indexedStationsCount++
      } catch (error) {
        console.error(`Error fetching data for station ${station.key}:`, error)
      }
    }

    console.log(`Total number of indexed stations: ${indexedStationsCount}`)

    } catch (error) {
      console.error('Error fetching data from SMHI or storing data in Elasticsearch:', error)
      throw error
    }
  }

  async getCurrentWeather() {
    // Entry point for the SMHI API. https://opendata.smhi.se/apidocs/metobs/index.html
    const urlEntryPoint = 'https://opendata-download-metobs.smhi.se/api/version/1.0/'
    const allStationsAirTemperature = 'parameter/1/station-set/all/period/latest-hour/data.json'
    const allStationsWindSpeed = 'parameter/4/station-set/all/period/latest-hour/data.json'
    const allStationsWindDirection = 'parameter/3/station-set/all/period/latest-hour/data.json'
    try {
      const [tempResponse, windSpeedResponse, windDirectionResponse] = await Promise.all([
        fetch(urlEntryPoint + allStationsAirTemperature),
        fetch(urlEntryPoint + allStationsWindSpeed),
        fetch(urlEntryPoint + allStationsWindDirection)
      ])

      if (!tempResponse.ok || !windSpeedResponse.ok || !windDirectionResponse.ok) {
        throw new Error(`HTTP error! status: ${tempResponse.status} or ${windSpeedResponse.status} or ${windDirectionResponse.status}`)
      }

      const [tempData, windSpeedData, windDirectionData] = await Promise.all([
        tempResponse.json(),
        windSpeedResponse.json(),
        windDirectionResponse.json()
      ])

      const bulkOps = tempData.station.flatMap(station => {
        const windSpeedStation = windSpeedData.station.find(ws => ws.key === station.key)
        const windDirectionStation = windDirectionData.station.find(wd => wd.key === station.key)

        const latestTemperature = station.value[0]
        const latestWindSpeed = windSpeedStation ? windSpeedStation.value[0] : null
        const latestWindDirection = windDirectionStation ? windDirectionStation.value[0] : null

        const stationData = {
          key: station.key,
          stationname: station.name,
          location: {
            type: "Point",
            coordinates: [station.longitude, station.latitude]
          },
          owner: "SMHI",
          temperature: latestTemperature ? latestTemperature.value : null,
          windSpeed: latestWindSpeed ? latestWindSpeed.value : null,
          windDirection: latestWindDirection ? latestWindDirection.value : null,
          date: latestTemperature ? new Date(latestTemperature.date) : null
        }
        SMHIStation.findOneAndUpdate({ key: station.key }, stationData, { new: true, upsert: true })

        // Prepare bulk operation
        return [{ index: { _index: 'smhi-data', _id: station.key }}, stationData]
      })

      // Execute bulk operation
      const bulkResponse = await client.bulk({ refresh: true, body: bulkOps.flat() })
      console.log('Bulk operation executed successfully!', bulkOps.length, 'items indexed.')
      return bulkResponse

    } catch (error) {
      console.error('Error fetching data from SMHI:', error)
      throw error
    }
  }

  // async getAllWindSpeedData() {
  //   try {
  //     const response = await client.search({
  //       index: 'smhi-data',
  //       _source: ['windSpeed', 'windDirection', 'location', 'date'],
  //       size: 10000,
  //       body: {
  //         sort: [
  //           { date: { order: 'asc' } }
  //         ],
  //         query: {
  //           match_all: {}
  //         }
  //       }
  //     })
  //     return response.hits.hits.map(hit => hit._source)
  //   } catch (error) {
  //     console.error('Error fetching data from Elasticsearch:', error)
  //     throw error
  //   }
  // }

  async getAllWindSpeedData() {
    let allDocuments = []
    let searchAfter
    let response

    const oneMonthInMilliseconds = 30 * 24 * 60 * 60 * 1000
    const startDate = 1703725200000 // The start date in milliseconds, from data-set
    const endDate = startDate + oneMonthInMilliseconds // The end date in milliseconds

    do {
      response = await client.search({
        index: 'smhi-data',
        _source: ['windSpeed', 'windDirection', 'location', 'date'],
        size: 1000,
        body: {
          sort: [
            { date: { order: 'asc' } }
          ],
          query: {
            bool: {
              must: [
                { match_all: {} },
                {
                  range: {
                    date: {
                      gte: startDate,
                      lte: endDate
                    }
                  }
                }
              ]
            }
          },
          search_after: searchAfter
        }
      })
  
      const hits = response.hits.hits
      hits.forEach(hit => allDocuments.push(hit._source))

      if (hits.length) {
        searchAfter = hits[hits.length - 1].sort
      }
    } while (response && response.hits.hits.length)
  
    return allDocuments
  }
  

  async getCurrentHighestWindSpeed() {
    try {
      const response = await client.search({
        index: 'smhi-data',
        body: {
          size: 1,
          sort: [{ "windSpeed": { "order": "desc" } }],
          query: {
            bool: {
              must: {
                exists: {
                  "field": "windSpeed"
                }
              }
            }
          }
        }
      })

      if (response && response.hits && response.hits.total.value > 0) {
        return response.hits.hits[0]._source
      } else {
        return null
      }
    } catch (error) {
      console.error('Error searching for max windspeed:', error)
    }
  }

  async getStationsWithModerateWindSpeed() {
    try {
      const windSpeedThreshold = 3.4 // Set the threshold for "måttlig vind" (moderate wind)
      const response = await client.search({
        index: 'smhi-data',
        body: {
          size: 1000,  // Adjust the number of stations to return
          query: {
            bool: {
              must: [
                { range: { "windSpeed": { "gte": windSpeedThreshold } } }
              ]
            }
          },
          sort: [{ "windSpeed": { "order": "desc" } }]
          }
        })

      if (response && response.hits && response.hits.total.value > 0) {
          return response.hits.hits.map(hit => hit._source)  // Returns an array of all stations meeting the criteria
      } else {
          console.log('No stations found with wind speed above', windSpeedThreshold)
          return []
      }
    } catch (error) {
        console.error('Error searching for stations with high windspeed:', error)
        return []
    }
  }
}
