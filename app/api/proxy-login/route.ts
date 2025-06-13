import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Forward the request to the backend login endpoint
    const backendRes = await fetch(
      `http://${process.env.LOCAL_BACKEND_URL}/api/v1/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      }
    );

    const data = await backendRes.json();

    // Create a NextResponse with the data
    const response = NextResponse.json(data, { status: backendRes.status });

    // Forward all Set-Cookie headers from the backend to the client
    const setCookie = backendRes.headers.get("set-cookie");
    if (setCookie) {
      response.headers.set("set-cookie", setCookie);
    }

    return response;
  } catch (error) {
    console.error("Login failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
