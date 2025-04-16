import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const response = await fetch("http://193.203.160.16:8000/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });

  const data = await response.json();

  const cookie = response.headers.get("set-cookie");

  const res = NextResponse.json(data, {
    status: response.status,
  });

  if (cookie) {
    res.headers.set("set-cookie", cookie); // ✅ manually forward cookie to client
  }

  return res;
}
