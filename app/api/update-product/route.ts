import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const productId = body._id; // Assuming the product ID is passed in the body

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required for update." },
        { status: 400 }
      );
    }

    // Grab cookies from the original request
    const cookieHeader = req.headers.get("cookie");

    // Send product data to the actual backend API for update
    const backendRes = await fetch(
      `${process.env.LOCAL_BACKEND_URL}/product/${productId}`,
      {
        method: "PATCH",
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
    console.error("Product update failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
