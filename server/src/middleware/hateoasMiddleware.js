/**
 * @file Defines the HATEOAS links middleware for the application.
 * @module middleware
 * @author Fredrik Svensson
 * @version 0.1.0
 * @since 0.1.0
 */

export class HateoasMiddleware {

  /**
   * Middleware to add HATEOAS links to the response object.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {void}
   */
  addLinks(req, res, next) {
    // Define links that should be included in all responses.
    const basicLinks = {
      self: {
        href: req.originalUrl,
        rel: 'self',
        method: 'GET',
        description: 'Current resource.'
      },
      documentation: {
        href: 'https://svenssonom.se/njordbreeze-we/docs/',
        rel: 'documentation',
        description: 'API documentation.'
      }
    }

    // Define dynamic links based on the request.
    let dynamicLinks = {}
    
    if (req.originalUrl === '/api/v1') {
      dynamicLinks.smhi = {
        href: '/smhi',
        rel: 'smhi',
        method: 'GET',
        description: 'Get smhi data.'
      }
    }

    if (req.originalUrl === '/api/v1/smhi') {
      dynamicLinks.weatherCurrent = {
        href: 'current-weather',
        rel: 'weather',
        method: 'GET',
        description: 'Get the most current weather data.'
      }
      dynamicLinks.windSpeedMax = {
        href: 'current-highest-wind-speed',
        rel: 'weather',
        method: 'GET',
        description: 'Get the currently highest wind speed data.'
      }
    }

    // Combine the links.
    let links = {
      _links: {
        ...basicLinks,
        ...dynamicLinks
      }
    }

    if (!res.jsonOverridden) {
      const originalJson = res.json.bind(res)
      res.json = (data) => {
        // If the data is an object and has a toJSON method, call it.
        if (data && typeof data === 'object' && typeof data.toJSON === 'function') {
          data = data.toJSON()
        }
        data = { ...data, ...links }
        originalJson(data)
      }
      res.jsonOverridden = true
    }

    next()
  }
}
