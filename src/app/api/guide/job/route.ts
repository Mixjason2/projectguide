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

    // สร้าง mock data เพิ่มเติม 10 รายการ
    const mockJobs = Array.from({ length: 10 }).map((_, i) => ({
      key: 1000 + i + 1,
      PNR: `MOCKPNR${i + 1}`,
      PNRDate: `2025-01-${String(i + 1).padStart(2, '0')}`,
      BSL_ID: `MOCKBSL${i + 1}`,
      PickupDate: `2025-01-${String(i + 1).padStart(2, '0')}`,
      Pickup: `MockPickup${i + 1}`,
      DropoffDate: `2025-01-${String(i + 2).padStart(2, '0')}`,
      Dropoff: `MockDropoff${i + 1}`,
      Source: `MockSource${i + 1}`,
      Pax: Math.floor(Math.random() * 5) + 1,
      IsConfirmed: i % 2 === 0,
      IsCancel: i % 3 === 0,
      NotAvailable: null,
      Photo: "",
      Remark: ""
    }))

    // รวมข้อมูลจริงกับ mock data
    const allJobs = Array.isArray(data) ? [...data, ...mockJobs] : mockJobs

    return NextResponse.json(allJobs)

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