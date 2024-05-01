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
        href: 'https://svenssonom.se/njordbreeze/docs/',
        rel: 'documentation',
        description: 'API documentation.'
      }
    }

    // Define dynamic links based on the request.
    let dynamicLinks = {}
    
    if (req.originalUrl === '/api/v1') {
      dynamicLinks.authRegister = {
        href: '/auth/register',
        rel: 'auth',
        method: 'POST',
        description: 'Register user.'
      }
      dynamicLinks.authLogin = {
        href: '/auth/login',
        rel: 'auth',
        method: 'POST',
        description: 'Login user.'
      }
      dynamicLinks.stationsGet = {
        href: '/stations',
        rel: 'stations',
        method: 'GET',
        description: 'Get all weather stations.'
      }
      dynamicLinks.stationsGetId = {
        href: '/stations/:id',
        rel: 'stations',
        method: 'GET',
        description: 'Get a specific weather station.'
      }
      dynamicLinks.weather = {
        href: '/weather',
        rel: 'weather',
        method: 'GET',
        description: 'Get all weather data.'
      }
      dynamicLinks.webhooksRegister = { 
        href: '/webhooks/register',
        rel: 'webhooks',
        method: 'POST',
        description: 'Register a new webhook.'
      }
      dynamicLinks.webhooksDelete = {
        href: '/webhooks/remove/:id',
        rel: 'webhooks',
        method: 'DELETE',
        description: 'Remove a webhook.'
      }
    }

    if (req.originalUrl === `/api/v1/users/${req.params.id}` && req.user) {
      dynamicLinks.authLogout = {
        href: '/auth/logout',
        rel: 'auth',
        method: 'POST',
        description: 'Logout user.'
      }
      dynamicLinks.authRefresh = {
        href: '/auth/refresh',
        rel: 'auth',
        method: 'POST',
        description: 'Refresh access token.'
      }
      dynamicLinks.usersGet = {
        href: `/users/${req.params.id}`,
        rel: 'users',
        method: 'GET',
        description: 'Get information about the user.'
      }
      dynamicLinks.usersUpdate = {
        href: `/users/${req.params.id}`,
        rel: 'users',
        method: 'PUT',
        description: 'Update user information.'
      }
      dynamicLinks.usersDelete = {
        href: `/users/${req.params.id}`,
        rel: 'users',
        method: 'DELETE',
        description: 'Delete user.'
      }
    }    

    if (req.originalUrl === '/api/v1/stations' && req.user) {
      dynamicLinks.stationsPost = {
        href: '/stations',
        rel: 'stations',
        method: 'POST',
        description: 'Register a new weather station.'
      }
    }

    if (req.originalUrl === `/api/v1/stations/${req.params.id}` && req.user) {
      dynamicLinks.stationsUpdate = {
        href: `/stations/${req.params.id}`,
        rel: 'stations',
        method: 'PUT',
        description: 'Update a weather station.'
      }
      dynamicLinks.stationsDelete = {
        href: `/stations/${req.params.id}`,
        rel: 'stations',
        method: 'DELETE',
        description: 'Delete a weather station.'
      }
    }

    if (req.originalUrl === '/api/v1/weather') {
      dynamicLinks.weatherGetStation = {
        href: '/weather/stations/:id',
        rel: 'weather',
        method: 'GET',
        description: 'Get all weather data from a specific weather station.'
      }
      dynamicLinks.weatherGetId = {
        href: '/weather/:id',
        rel: 'weather',
        method: 'GET',
        description: 'Get a specific set of weather data.'
      }
      dynamicLinks.weatherCurrent = {
        href: '/weather/current/:id',
        rel: 'weather',
        method: 'GET',
        description: 'Get the current weather data from a specific weather station.'
      }
    }

    if (req.originalUrl === `/api/v1/weather${req.params.id}` && req.user) {
      dynamicLinks.weatherPost = {
        href: `/weather/${req.params.id}`,
        rel: 'weather',
        method: 'POST',
        description: 'Add a new set of weather data.'
      }
      dynamicLinks.weatherUpdate = {
        href: `/weather/${req.params.id}`,
        rel: 'weather',
        method: 'PUT',
        description: 'Update a specific set of weather data.'
      }
      dynamicLinks.weatherDelete = {
        href: `/weather/${req.params.id}`,
        rel: 'weather',
        method: 'DELETE',
        description: 'Delete a specific set of weather data.'
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
