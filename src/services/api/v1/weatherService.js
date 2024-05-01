/**
 * @file Defines the weather service for the application.
 * @module service
 * @author Fredrik Svensson
 * @version 0.1.0
 * @since 0.1.0
 */

import { Weather } from '../../../models/weather.js'

export class WeatherService {
  async getAllWeatherData(id) {
    const weather = await Weather.find({ stationid: id })
    return weather
  }

  async getWeatherData(id) {
    const weather = await Weather.findById(id)
    return weather
  }

  async addWeatherData(data) {
    const weather = await Weather.create(data)
    return weather
  }

  async updateWeatherData(id, data) {
    const weather = await Weather.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    return weather
  }

  async deleteWeatherData(id) {
    const weather = await Weather.findByIdAndDelete(id)
    return weather
  }

  async getCurrentWeatherData(id) {
    const weather = await Weather.find({ stationid: id })
    .sort({ createdAt: -1 })
    .limit(1)
  return weather[0]
  }
}
