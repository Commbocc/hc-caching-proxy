import express from 'express'
import cors from 'cors'
import { middleware as redisMiddleware } from './util/redis.mjs'

//
import PressReleasesRoutes from './routes/press-releases.mjs'
import AirtableRoutes from './routes/airtable.mjs'
import PowerbiRoutes from './routes/powerbi.mjs'

const PORT = process.env.PORT || 4040

const app = express()
app.use(cors())
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(redisMiddleware)

// https redirect
app.get('*', (req, res, next) => {
  if (
    process.env.NODE_ENV == 'production' &&
    req.headers['x-forwarded-proto'] != 'https'
  ) {
    res.redirect(`https://${req.headers.host + req.url}`)
  } else {
    return next()
  }
})

// routes
app.use('/press-releases', PressReleasesRoutes)
app.use('/airtable', AirtableRoutes)
app.use('/powerbi', PowerbiRoutes)

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send(err.message)
})

// listen
app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`))
