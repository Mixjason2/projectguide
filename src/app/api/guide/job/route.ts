import { NextRequest, NextResponse } from 'next/server'
import https from 'https'
import axios from 'axios'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const apiUrl = 'https://operation.dth.travel:7082/api/guide/job'

    const agent = new https.Agent({ rejectUnauthorized: false })

    const { data } = await axios.post(apiUrl, body, {
      httpsAgent: agent,
      headers: { 'Content-Type': 'application/json' },
    })

    return NextResponse.json(data)

  } catch (err: any) {
    console.error('Route error:', JSON.stringify({
      message: err.message,
      code: err.code,
      responseData: err.response?.data,
      stack: err.stack,
    }, null, 2))
    return NextResponse.json(
      { error: 'Internal Server Error', detail: err.message },
      { status: 500 }
    )
  }
}