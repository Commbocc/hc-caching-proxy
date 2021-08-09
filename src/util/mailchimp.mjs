import axios from 'axios'

export const client = axios.create({
  baseURL: `https://${process.env.MAILCHIMP_SERVER}.api.mailchimp.com/3.0`,
  auth: {
    password: process.env.MAILCHIMP_KEY,
  },
})
