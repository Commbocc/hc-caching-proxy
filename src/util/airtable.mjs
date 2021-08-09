import axios from 'axios'

export const client = axios.create({
  baseURL: 'https://api.airtable.com/v0',
  headers: { Authorization: `Bearer ${process.env.AIRTABLE_READ_KEY}` },
})
