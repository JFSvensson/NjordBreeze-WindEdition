/**
 * @file Defines the weather controller for the application.
 * @module controller
 * @author Fredrik Svensson
 * @version 0.1.0
 * @since 0.1.0
 */

import { WeatherService } from '../../../services/api/v1/weatherService.js'

/**
 * Handles requests for weather data.
 */
export class WeatherController {
  constructor() {
    this.weatherService = new WeatherService()
  }

  /**
   * Get all weather data from a specific station.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {void}
   * @throws {Error} Throws an error if no weather data is found.
   * @throws {Error} Throws an error if an error occurs while fetching the weather data.
   */
  async getAllWeatherData(req, res) {
    try {
      const weather = await this.weatherService.getAllWeatherData(req.params.id)
      if (!weather) {
        return res.status(404).json({ message: 'No weather data found' })
      }
      res.json(weather)
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while fetching the weather data' })
    }
  }

  /**
   * Get a specific set of weather data.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {void}
   * @throws {Error} Throws an error if no weather data is found.
   * @throws {Error} Throws an error if an error occurs while fetching the weather data.
   */
  async getWeatherData(req, res) {
    try {
      const weather = await this.weatherService.getWeatherData(req.params.id)
      if (!weather) {
        return res.status(404).json({ message: 'No weather data found' })
      }
      res.json(weather)
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while fetching the weather data' })
    }
  }

  /**
   * Add weather data for a specific location.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {void}
   * @throws {Error} Throws an error if the weather data is not added.
   * @throws {Error} Throws an error if an error occurs while adding the weather data.
   */
  async addWeatherData(req, res) {
    try {
      const data = {
        ...req.body,
        stationid: req.params.id
      }
      const weather = await this.weatherService.addWeatherData(data)
      if (!weather) {
        return res.status(400).json({ message: 'Weather data not added' })
      }
      res.status(201).json(weather)
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while adding the weather data' })
    }
  }

  /**
   * Update weather data for a specific location.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {void}
   * @throws {Error} Throws an error if the weather data is not updated.
   * @throws {Error} Throws an error if an error occurs while updating the weather data.
   */
  async updateWeatherData(req, res) {
    try {
      const weather = await this.weatherService.updateWeatherData(req.params.id, req.body)
      if (!weather) {
        return res.status(400).json({ message: 'Weather data not updated' })
      }
      res.json(weather)
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while updating the weather data' })
    }
  }

  /**
   * Delete weather data for a specific location.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {void}
   * @throws {Error} Throws an error if the weather data is not deleted.
   * @throws {Error} Throws an error if an error occurs while deleting the weather data.
   */
  async deleteWeatherData(req, res) {
    try {
      const weather = await this.weatherService.deleteWeatherData(req.params.id)
      if (!weather) {
        return res.status(400).json({ message: 'Weather data not deleted' })
      }
      res.json(weather)
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while deleting the weather data' })
    }
  }

  /**
   * Get current weather data for a specific location.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {void}
   * @throws {Error} Throws an error if no weather data is found.
   * @throws {Error} Throws an error if an error occurs while fetching the weather data.
   */
  async getCurrentWeatherData(req, res) {
    try {
      const weather = await this.weatherService.getCurrentWeatherData(req.params.id)
      if (!weather) {
        return res.status(404).json({ message: 'No weather data found' })
      }
      res.json(weather)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'An error occurred while fetching the weather data' })
    }
  }
}
