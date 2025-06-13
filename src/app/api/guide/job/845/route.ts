import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const API_URL = 'https://operation.dth.travel:7082'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const token = body.token

  try {
    const res = await axios.post(
      `${API_URL}/api/guide/job/845`,
      { token },
      { headers: { 'Content-Type': 'application/json' } }
    )
    return NextResponse.json(res.data)
  } catch (e: any) {
    return NextResponse.json({ error: 'Fetch error', detail: e.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const body = await req.json()
  const token = body.token
  const data = body.data

  try {
    const res = await axios.put(
      `${API_URL}/api/guide/job/845`,
      { ...data, token },
      { headers: { 'Content-Type': 'application/json' } }
    )
    return NextResponse.json(res.data)
  } catch (e: any) {
    return NextResponse.json({ error: 'Update error', detail: e.message }, { status: 500 })
  }
}