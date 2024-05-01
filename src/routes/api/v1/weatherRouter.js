/**
 * @file Defines the weather data router for the application.
 * @module router
 * @author Fredrik Svensson
 * @since 0.1.0
 */

import express from 'express'
import { WeatherController } from '../../../controllers/api/v1/weatherController.js'
import { HateoasMiddleware } from '../../../middleware/hateoasMiddleware.js'

export const router = express.Router()

const controller = new WeatherController()
const hateoas = new HateoasMiddleware()

/**
 * @openapi
 * /weather/stations/{stationId}:
 *  get:
 *    summary: Get a all weather data from a specific station.
 *    description: Returns all weather data from a specific station.
 *    tags:
 *      - Weather Data
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true  
 *        schema:
 *          type: string
 *        description: The weather station's ID.
 *    responses:
 *      '200':
 *        description: A list of weather data.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/WeatherData'
 *      '404':
 *        description: Weather data not found.
 */
router.get(
  '/stations/:id',
  hateoas.addLinks,
  (req, res) => controller.getAllWeatherData(req, res)
)

/**
 * @openapi
 * /weather/{id}:
 *  get:
 *    summary: Get a specific set of weather data.
 *    description: Returns a specific set of weather data from a specific station.
 *    tags:
 *      - Weather Data
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true  
 *        schema:
 *          type: string
 *        description: The weather station's ID.
 *    responses:
 *      '200':
 *        description: A list of weather data.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/WeatherData'
 *      '404':
 *        description: Weather data not found.
 */
router.get(
  '/:id',
  hateoas.addLinks,
  (req, res) => controller.getWeatherData(req, res)
)

/**
 * @openapi
 * /weather/{id}:
 *  post:
 *    summary: Add new weather data to a station
 *    description: Adds new weather data (temperature, windspeed and winddirection) to a specific weather station in the system. User needs to be authenticated and the owner of the station to add data.
 *    tags:
 *      - Weather Data
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true  
 *        schema:
 *          type: string
 *        description: The weather station's ID.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/WeatherData'
 *    responses:
 *      '201':
 *        description: Weather data added successfully.
 *      '401':
 *        description: Unauthorized.
 */
router.post(
  '/:id',
  hateoas.addLinks,
  (req, res) => controller.addWeatherData(req, res)
)

/**
 * @openapi
 * /weather/{id}:
 *  put:
 *    summary: Update weather data.
 *    description: Update weather data (temperature, windspeed and winddirection) for a specific dataset. User needs to be authenticated and the owner of the station to add data.
 *    tags:
 *      - Weather Data
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true  
 *        schema:
 *          type: string
 *        description: The weather data's ID.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/WeatherData'
 *    responses:
 *      '201':
 *        description: Weather data updated successfully.
 *      '401':
 *        description: Unauthorized.
 */
router.put(
  '/:id',
  hateoas.addLinks,
  (req, res) => controller.updateWeatherData(req, res)
)

/**
 * @openapi
 * /weather/{id}:
 *  delete:
 *    summary: Delete weather data.
 *    description: Delete a specific dataset. User needs to be authenticated and the owner of the station to add data.
 *    tags:
 *      - Weather Data
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true  
 *        schema:
 *          type: string
 *        description: The weather data's ID.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/WeatherData'
 *    responses:
 *      '201':
 *        description: Weather data updated successfully.
 *      '401':
 *        description: Unauthorized.
 */
router.delete(
  '/:id',
  hateoas.addLinks,
  (req, res) => controller.deleteWeatherData(req, res)
)

/**
 * @openapi
 * /weather/current/{id}:
 *   get:
 *     summary: Get current weather conditions.
 *     description: Returns current weather conditions, being the data most recently added, for a specified location.
 *     tags:
 *       - Weather Data
 *     parameters:
 *       - in: query
 *         name: stationid
 *         schema:
 *           type: string
 *         required: true
 *         description: The id for the weather station to fetch current weather conditions for.
 *     responses:
 *       '200':
 *         description: Successful response with current weather conditions.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WeatherData'
 *       '404':
 *         description: Location not found.
 */
router.get(
  '/current/:id',
  hateoas.addLinks,
  (req, res) => controller.getCurrentWeatherData(req, res)
)

/**
 * @openapi
 * components:
 *  schemas:
 *   WeatherData:
 *    type: object
 *    properties:
 *     temperature:
 *      type: number
 *      format: float
 *      description: Temperature in Celsius.
 *     windSpeed:
 *      type: number
 *      format: float
 *      description: Wind speed in m/s.
 *     windDirection:
 *      type: number
 *      format: float
 *      description: Wind direction in degrees. 360 degrees is north, 90 degrees is east, 180 degrees is south, and 270 degrees is west. 0 degrees is calm.
 *     stationid:
 *      type: string
 *      description: Unique identifier for the station.
 */
