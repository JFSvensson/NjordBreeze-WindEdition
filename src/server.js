/**
 * This is the entry point of the application.
 * Inspired by earlier assignments.
 *
 * @file server.js is the root file that starts the server.
 * @author Fredrik Svensson
 * @version 0.1.0
 * @since 0.1.0
 */

// Import modules.
import express from 'express'
import { connectToDatabase } from './config/mongoose.js'
import helmet from 'helmet'
import logger from 'morgan'
import swaggerUi from 'swagger-ui-express'
import openapiSpecification from './openapiDef.js'
import { router } from './routes/router.js'

try {
  // Connect to the database.
  await connectToDatabase(process.env.DB_CONNECTION_STRING_NB)

  // Create an Express application.
  const app = express()

  // Setup helmet to secure the application.
  app.use(helmet())
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'gitlab.lnu.se', "https://cdn.jsdelivr.net", "https://unpkg.com"],
        styleSrc: ["'self'", "'unsafe-inline'", 'gitlab.lnu.se', "https://unpkg.com"],
        imgSrc: ["'self'", 'data:', 'gitlab.lnu.se', "https://unpkg.com", "https://*.openstreetmap.org"],
        connectSrc: ["'self'", 'gitlab.lnu.se'],
        frameSrc: ["'self'", 'gitlab.lnu.se'],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: []
      }
    })
  )

  // Serve Swagger docs
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification))

  // Set up a morgan logger using the dev format for log entries.
  app.use(logger('dev'))

  // Parse requests of the content type application/json.
  app.use(express.json())

  // Serve static files from the public directory.
  app.use(express.static('public'))

  // Production settings.
  if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // Running behind reverse proxy, trust first proxy
  }

  // Register routes.
  app.use('/', router)

  // Error handler.
  app.use(function (err, req, res, next) {
    // 404 Not Found.
    if (err.status === 404) {
      return res
        .status(404)
        .end()
    }

    // 500 Internal Server Error.
    // In development, include error details.
    if (req.app.get('env') === 'development') {
      return res
        .status(err.status || 500)
        .json({ error: err })
    }

    // In production, just send the status code.
    return res
      .status(err.status || 500)
      .json({ error: err })
  })

  // Starts the HTTP server listening for connections.
  const server = app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`)
    console.log('Press Ctrl-C to terminate...')
  })
} catch (error) {
  console.error(error)
  process.exit(1)
}
