import { NextRequest, NextResponse } from "next/server";

let uploadsDB: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const { token, data } = await request.json();

    // ตรวจสอบ token เบื้องต้น
    if (!token || token.length < 10) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // คุณอาจเพิ่ม validation data เพิ่มเติม เช่น ตรวจสอบว่ามี Remark, key, Images
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ error: "Missing or invalid data" }, { status: 400 });
    }

    // สร้าง id ใหม่
    const newEntry = {
      id: Date.now(),
      remark: data.Remark || "",
      key: data.key || null,
      images: data.Images || [],
    };

    uploadsDB.push(newEntry);

    return NextResponse.json({ success: true, id: newEntry.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
