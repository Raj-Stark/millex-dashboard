import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("myFile") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const realFormData = new FormData();
    realFormData.append(
      "myFile",
      new Blob([buffer], { type: file.type }),
      file.name
    );

    const uploadRes = await fetch(
      "http://193.203.160.16:8000/api/v1/product/uploadImage",
      {
        method: "POST",
        body: realFormData,
      }
    );

    const uploadData = await uploadRes.json();

    return NextResponse.json(uploadData, { status: uploadRes.status });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
