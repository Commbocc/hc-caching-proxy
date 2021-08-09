import express from 'express'
import { client as airtableClient } from '../util/airtable.mjs'

const router = express.Router()

router.get('/:baseId/:table', async (req, res, next) => {
  try {
    const { baseId, table } = req.params

    const json = await req.redisGetSet(async () => {
      const { data } = await airtableClient.get(`/${baseId}/${table}`, {
        params: req.query,
      })
      return data
    })

    res.json(json)
  } catch (error) {
    next(error)
  }
})

export default router
