import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("myFile") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Grab cookies from the original request
    const cookieHeader = req.headers.get("cookie");

    // Convert File to Buffer and wrap in Blob
    const buffer = Buffer.from(await file.arrayBuffer());
    const realFormData = new FormData();
    realFormData.append(
      "myFile",
      new Blob([buffer], { type: file.type }),
      file.name
    );

    const uploadRes = await fetch(
      `${process.env.LOCAL_BACKEND_URL}/product/uploadImage`,
      {
        method: "POST",
        body: realFormData,
        headers: {
          ...(cookieHeader ? { cookie: cookieHeader } : {}),
        },
        credentials: "include",
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
