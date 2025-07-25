import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const cookieHeader = req.headers.get("cookie");

    const backendRes = await fetch(
      `${process.env.LOCAL_BACKEND_URL}/product/${productId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(cookieHeader ? { cookie: cookieHeader } : {}),
        },
        credentials: "include",
      }
    );

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error("Product deletion failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
