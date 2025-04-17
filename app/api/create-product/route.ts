import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Grab cookies from the original request
    const cookieHeader = req.headers.get("cookie");

    // Send product data to the actual backend API
    const backendRes = await fetch(
      "http://193.203.160.16:8000/api/v1/product",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(cookieHeader ? { cookie: cookieHeader } : {}),
        },
        credentials: "include",
        body: JSON.stringify(body),
      }
    );

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error("Product creation failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
