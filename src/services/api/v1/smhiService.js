/**
 * @file Defines the SMHI weather station data service.
 * @module service
 * @author Fredrik Svensson
 * @version 0.1.0
 * @since 0.1.0
 */

import { SMHIStation } from '../../../models/smhiStation.js'

export class SMHIService {
  async getStations() {
    // Entry point for the SMHI API. https://opendata.smhi.se/apidocs/metobs/index.html
    const urlEntryPoint = 'https://opendata-download-metobs.smhi.se/api/version/1.0/'
    const allStationsAirTemperature = 'parameter/1/station-set/all/period/latest-hour/data.json'
    try {
      const response = await fetch(urlEntryPoint + allStationsAirTemperature)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json()

      for (let station of data.station) {
        const stationData = {
          key: station.key,
          stationname: station.name,
          location: {
            type: "Point",
            coordinates: [station.longitude, station.latitude]
          },
          owner: "SMHI"
        }
        await SMHIStation.findOneAndUpdate({ key: station.key }, stationData, { new: true, upsert: true })
      }

      return data.station.map(station => ({
        key: station.key,
        name: station.name,
        latitude: station.latitude,
        longitude: station.longitude
      }))
    } catch (error) {
      console.error('Error fetching data from SMHI:', error)
      throw error
    }
  }
}
