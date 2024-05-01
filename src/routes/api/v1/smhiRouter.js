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
 * /smhi/stations:
 *  get:
 *    summary: Get information about all active SMHI weather stations
 *    description: Returns information about a currently active SMHI stations (those that has reported temperature data for the last hour).
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
  '/stations',
  hateoas.addLinks, 
 (req, res) => smhiController.getStations(req, res)
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
 */
