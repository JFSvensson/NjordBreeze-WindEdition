/**
 * @file Defines the SMHI weather station data service.
 * @module service
 * @author Fredrik Svensson
 * @version 0.1.0
 * @since 0.1.0
 */

import { SMHIStation } from '../../../models/smhiStation.js'
import { getElasticsearchClient } from '../../../config/elasticsearch.js'

const client = getElasticsearchClient()

export class SMHIService {
  async getStations() {
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
      await client.bulk({ refresh: true, body: bulkOps })
      console.log('Bulk operation executed successfully!', bulkOps.length, 'items indexed.', bulkOps)
      return bulkOps.map(op => op[1])  // Return only the data

    } catch (error) {
      console.error('Error fetching data from SMHI:', error)
      throw error
    }
  }
}
