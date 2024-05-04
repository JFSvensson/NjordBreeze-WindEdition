/**
 * @file Defines the smhi station router for the application.
 * @module router
 * @author Fredrik Svensson
 * @version 0.1.0
 * @since 0.1.0
 */
import express from 'express'
import { SMHIController } from '../../../controllers/api/v1/smhiController.js'
import { HateoasMiddleware } from '../../../middleware/hateoasMiddleware.js'

export const router = express.Router()

const smhiController = new SMHIController()
const hateoas = new HateoasMiddleware()

/**
 * @openapi
 * /smhi/current-weather:
 *  get:
 *    summary: Get the most current weather data from all active SMHI weather stations
 *    description: Returns information about temperature, wind speed and wind direction from all currently active SMHI stations.
 *    tags:
 *      - SMHI Weather Stations
 *    responses:
 *      '200':
 *        description: Successful response with SMHI weather station information.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SMHIWeatherStation'
 *      '404':
 *        description: SMHI weather station not found.
 */
router.get(
  '/current-weather',
  hateoas.addLinks, 
 (req, res) => smhiController.getCurrentWeather(req, res)
)

/**
 * @openapi
 * /smhi/current-highest-wind-speed:
 *  get:
 *    summary: Get the most current highest wind speed data from all active SMHI weather stations
 *    description: Returns information about the station with the highest wind speed from all currently active SMHI stations.
 *    tags:
 *      - SMHI Weather Stations
 *    responses:
 *      '200':
 *        description: Successful response with SMHI weather station information.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SMHIWeatherStation'
 *      '404':
 *        description: SMHI weather station not found.
 */
router.get(
  '/current-highest-wind-speed',
  hateoas.addLinks,
  (req, res) => smhiController.getCurrentHighestWindSpeed(req, res)
)


/**
 * @openapi
 * /smhi/stations-with-moderate-wind-speed:
 *  get:
 *    summary: Get all stations with wind speed above 3.4 m/s.
 *    description: Returns information about the stations with a wind speed above the threshold for moderate winds.
 *    tags:
 *      - SMHI Weather Stations
 *    responses:
 *      '200':
 *        description: Successful response with SMHI weather station information.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SMHIWeatherStation'
 *      '404':
 *        description: SMHI weather station not found.
 */
router.get(
  '/stations-with-moderate-wind-speed',
  hateoas.addLinks,
  (req, res) => smhiController.getStationsWithModerateWindSpeed(req, res)
)

/**
 * @openapi
 * components:
 *  schemas:
 *    SMHIWeatherStation:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          format: uuid
 *          description: The unique identifier for the weather station.
 *        stationname:
 *          type: string
 *          description: The name of the weather station.
 *        key:
 *          type: string
 *          description: The key provided by SMHI.
 *        location:
 *          type: object
 *          required:
 *            - type
 *            - coordinates
 *          properties:
 *            type:
 *              type: string
 *              description: The type of the GeoJSON object, e.g., Point.
 *              enum:
 *                - Point
 *              default: Point
 *            coordinates:
 *              type: array
 *              description: A longitude and latitude coordinates of the station.
 *              minItems: 2
 *              maxItems: 2
 *              items:
 *                type: number
 *                format: double
 *        owner:
 *          type: string
 *          description: The owner of the weather station, SMHI.
 *        temperature:
 *          type: number
 *          description: The temperature in degrees Celsius.
 *        windSpeed:
 *          type: number
 *          description: The wind speed in meters per second.
 *        windDirection:
 *          type: number
 *          description: The wind direction in degrees.
 *        date:
 *          type: Date
 *          description: The date and time of the weather data.
 */
