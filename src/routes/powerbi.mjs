import express from 'express'
import getToken from '../util/powerbi/token.js'

const router = express.Router()

router.get('/:reportId', async (req, res, next) => {
  try {
    const { reportId } = req.params

    const json = await req.redisGetSet(async () => {
      const token = await getToken(reportId)
      return token
    })

    res.json(json)
  } catch (error) {
    next(error)
  }
})

export default router
