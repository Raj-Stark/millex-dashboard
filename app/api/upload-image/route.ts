import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log(req);

  const res = NextResponse.json("data", {
    status: 200,
  });

  return res;
}
