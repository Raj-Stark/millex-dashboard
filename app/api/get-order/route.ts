import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Grab cookies from the original request
    const cookieHeader = req.headers.get("cookie");

    // Send product data to the actual backend API
    const backendRes = await fetch(`${process.env.LOCAL_BACKEND_URL}/order`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
      },
      credentials: "include",
    });

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
