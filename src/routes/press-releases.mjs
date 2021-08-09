import express from 'express'
import { client as mailchimpClient } from '../util/mailchimp.mjs'

const router = express.Router()

//
router.get('/', async (req, res, next) => {
  try {
    const json = await req.redisGetSet(
      async () => {
        const { data } = await mailchimpClient.get('/campaigns', {
          params: {
            //
            count: 10,
            sort_dir: 'DESC',
            offset: 0,
            ...req.query,
            //
            list_id: process.env.MAILCHIMP_LIST_ID,
            status: 'sent',
            sort_field: 'send_time',
          },
        })
        return data
      },
      {
        ttl: 900, // ttl 15 minutes
      }
    )

    res.json(json)
  } catch (error) {
    next(error)
  }
})

//
router.get('/:id', async (req, res, next) => {
  try {
    const json = await req.redisGetSet(async () => {
      const { data: pr } = await mailchimpClient.get(
        `/campaigns/${req.params.id}`,
        {
          params: {
            fields: [],
            exclude_fields: [],
            ...req.query,
          },
        }
      )
      const { data: content } = await mailchimpClient.get(
        `/campaigns/${req.params.id}/content`
      )
      return { ...pr, content }
    })

    res.json(json)
  } catch (error) {
    next(error)
  }
})

// webhook ?
// app.post('/', (req, res) => {
// //  redis publisher ?
// publisher.publish ?
// })

export default router
