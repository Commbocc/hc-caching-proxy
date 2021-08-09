import Redis from 'redis'

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'
const REDIS_DEFAULT_TTL = process.env.REDIS_DEFAULT_TTL || 3600 // 1 hour

export const client = Redis.createClient(REDIS_URL)
// export const publisher = Redis.createClient(REDIS_URL)
// export const subscriber = Redis.createClient(REDIS_URL)

export function getset(key, cb, opts = {}) {
  const options = { force: false, ttl: REDIS_DEFAULT_TTL, ...opts }
  return new Promise((resolve, reject) => {
    client.get(key, async (error, data) => {
      if (error) return reject(error)
      if (data != null && !options.force) return resolve(JSON.parse(data))
      try {
        const data = await cb()
        client.setex(key, options.ttl, JSON.stringify(data))
        resolve(data)
      } catch (error) {
        reject(error)
      }
    })
  })
}

export const middleware = (req, res, next) => {
  const force = req.query.force || false
  req.redisGetSet = (cb, opts = {}) => getset(req.url, cb, { force, ...opts })
  next()
}
