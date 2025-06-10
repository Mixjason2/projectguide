import { NextRequest, NextResponse } from 'next/server'

const VALID_TOKEN = 'AVM4UmVVMJuXWXzdOvGgaTqNm/Ysfkw0DnscAzbE+J4+Kr7AYjIs7Eu+7ZXBGs+MohOuqTTZkdIiJ5Iw8pQVJ0tWaz/R1sbE8ksM2sKYSTDKrKtQCYfZuq8IArzwBRQ3E1LIlS9Wb7X2G3mKkJ+8jCdb1fFy/76lXpHHWrI9tqt2/IXD20ZFYZ41PTB0tEsgp9VXZP8I5j+363SEnn5erg=='

export async function POST(req: NextRequest) {
  const body = await req.json()
  const token = body.token

  if (token !== VALID_TOKEN) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  const jobs = [
    {
      key: 1,
      PNR: "ABC123",
      PNRDate: "2025-01-05",
      BSL_ID: "BSL001",
      PickupDate: "2025-01-05",
      Pickup: "Airport",
      DropoffDate: "2025-01-05",
      Dropoff: "Hotel",
      Source: "Website",
      Pax: 2,
      IsConfirmed: true,
      IsCancel: false,
      NotAvailable: null,
      Photo: "",
      Remark: ""
    },
    {
      key: 2,
      PNR: "XYZ789",
      PNRDate: "2025-01-10",
      BSL_ID: "BSL002",
      PickupDate: "2025-01-10",
      Pickup: "Station",
      DropoffDate: "2025-01-10",
      Dropoff: "Resort",
      Source: "App",
      Pax: 4,
      IsConfirmed: false,
      IsCancel: false,
      NotAvailable: null,
      Photo: "",
      Remark: ""
    }
  ]
  return NextResponse.json(jobs)
}