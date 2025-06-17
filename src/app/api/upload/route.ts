import { NextRequest, NextResponse } from "next/server";

let uploadsDB: any[] = []; // ตัวอย่างเก็บข้อมูลใน memory

export async function POST(request: NextRequest) {
  try {
    const { token, data } = await request.json();

    // ตรวจสอบ token (ตัวอย่าง)
    if (!token || token.length < 10) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // บันทึกข้อมูลใหม่ (สมมติเพิ่ม id อัตโนมัติ)
    const newEntry = {
      id: Date.now(),
      ...data,
    };
    uploadsDB.push(newEntry);

    return NextResponse.json({ success: true, id: newEntry.id });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
