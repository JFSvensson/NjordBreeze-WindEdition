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
   * Get all weather stations.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {void}
   * @throws {Error} Throws an error if no weather station is not found.
   * @throws {Error} Throws an error if an error occurs while fetching the weather stations.
   */
  async getStations(req, res) {
    try {
      const station = await this.smhiService.getStations()
      if (!station) {
        return res.status(404).json({ message: 'No station found' })
      }
      res.json(station)
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while fetching the weather stations' })
    }
  }
}
