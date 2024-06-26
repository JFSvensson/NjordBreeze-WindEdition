/**
 * @file Defines the SMHI weather station data controller.
 * @module controller
 * @author Fredrik Svensson
 * @version 0.1.0
 * @since 0.1.0
 */

import { SMHIService } from '../../../services/api/v1/smhiService.js'

/**
 * Handles requests for weather station data.
 */
export class SMHIController {
  constructor() {
    this.smhiService = new SMHIService()
  }

  /**
   * Get the most current weather data from all stations.
   */
  async getCurrentWeather(req, res) {
    try {
      const currentWeather = await this.smhiService.getCurrentWeather()
      if (!currentWeather) {
        return res.status(404).json({ message: 'No weather data found' })
      }
      res.json(currentWeather)
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while fetching the weather data.' })
    }
  }

  /**
   * Get the weather data for last months from all stations.
   */
  async fetchAndStoreDataForAllStations(req, res) {
    try {
      const monthsWeather = await this.smhiService.fetchAndStoreDataForAllStations()
      if (!monthsWeather) {
        return res.status(404).json({ message: 'No weather data found' })
      }
      res.json(monthsWeather)
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while fetching the weather data.' })
    }
  }
  
  /**
   * Get all wind speed from all stations.
   */
  async getAllWindSpeedData(req, res) {
    try {
      const allWindSpeedData = await this.smhiService.getAllWindSpeedData()
      if (!allWindSpeedData) {
        return res.status(404).json({ message: 'No wind speed data found' })
      }
      res.json(allWindSpeedData)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'An error occurred while fetching the wind speed data' })
    }
  }

  /**
   * Get the most current highest wind speed from all stations.
   */
  async getCurrentHighestWindSpeed(req, res) {
    try {
      const currentHighestWindSpeed = await this.smhiService.getCurrentHighestWindSpeed()
      if (!currentHighestWindSpeed) {
        return res.status(404).json({ message: 'No wind speed data found' })
      }
      res.json(currentHighestWindSpeed)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'An error occurred while fetching the wind speed data' })
    }
  }

  /**
   * Get the stations with moderate wind speed, and above.
   */
  async getStationsWithModerateWindSpeed(req, res) {
    try {
      const moderateWindSpeed = await this.smhiService.getStationsWithModerateWindSpeed()
      if (!moderateWindSpeed) {
        return res.status(404).json({ message: 'No wind speed data found' })
      }
      res.json(moderateWindSpeed)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'An error occurred while fetching the wind speed data' })
    }
  }
}
