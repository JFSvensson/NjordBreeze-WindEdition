/**
 * @file Defines the router for the API.
 * @module router
 * @author Fredrik Svensson
 * @version 0.1.0
 * @since 0.1.0
 */

import express from 'express'
import { router as weatherRouter } from './weatherRouter.js'
import { router as smhiRouter } from './smhiRouter.js'
import { HateoasMiddleware } from '../../../middleware/hateoasMiddleware.js'

export const router = express.Router()

const hateoas = new HateoasMiddleware()

/**
 * @openapi
 * /:
 *   get:
 *     summary: Get API status
 *     description: Returns the status of the API and provides dynamical links to other endpoints.
 *     tags:
 *      - Status
 *     responses:
 *       200:
 *         description: API is up and running. 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Welcome to the NjordBreeze API. Use our endpoints to interact with weather data.
 *                 documentation:
 *                   type: string
 *                   example: https://svenssonom.se/njordbreeze-we/docs
 *                 _links:
 *                   type: object
 *                   properties:
 *                     self:
 *                       type: string
 *                       description: The current endpoint.
 *                       example: / 
 *                     weather:
 *                       type: string
 *                       description: The weather data endpoint.
 *                       example: /weather
 */
router.get(
  '/',
  hateoas.addLinks,
  (req, res) => {
    res.json({
      message: 'Welcome to the NjordBreeze API. Use our endpoints to interact with weather data.',
    })
  }
)

router.use('/weather', weatherRouter)
router.use('/smhi', smhiRouter)
