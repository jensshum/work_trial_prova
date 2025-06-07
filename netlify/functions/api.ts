import { Handler } from '@netlify/functions'
import { NextApiRequest, NextApiResponse } from 'next'
import { createServer } from 'http'
import { parse } from 'url'

const handler: Handler = async (event, context) => {
  const { path, query } = parse(event.path, true)
  const req = {
    url: event.path,
    method: event.httpMethod,
    headers: event.headers,
    query,
  } as NextApiRequest

  const res = {
    statusCode: 200,
    headers: {},
    body: '',
    setHeader: (name: string, value: string) => {
      res.headers[name] = value
    },
    end: (body: string) => {
      res.body = body
    },
  } as unknown as NextApiResponse

  try {
    // Handle API routes
    if (path?.startsWith('/api/')) {
      const apiPath = path.replace('/api/', '')
      const apiHandler = await import(`../../app/api/${apiPath}/route`)
      
      if (apiHandler.GET) {
        await apiHandler.GET(req, res)
      } else if (apiHandler.POST) {
        await apiHandler.POST(req, res)
      }
    }

    return {
      statusCode: res.statusCode,
      headers: res.headers,
      body: res.body,
    }
  } catch (error) {
    console.error('API Error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    }
  }
}

export { handler } 