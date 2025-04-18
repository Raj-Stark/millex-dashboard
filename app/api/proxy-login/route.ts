import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const loginRes = await fetch(
      "http://193.203.160.16:8000/api/v1/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await loginRes.json();

    if (!loginRes.ok) {
      return NextResponse.json(
        { error: data.message || "Login failed" },
        { status: loginRes.status }
      );
    }

    // Forward the response including any cookies/session tokens
    const response = NextResponse.json(data, { status: loginRes.status });

    // If the backend sets cookies, you might need to forward them
    const cookies = loginRes.headers.get("set-cookie");
    if (cookies) {
      response.headers.set("set-cookie", cookies);
    }

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
