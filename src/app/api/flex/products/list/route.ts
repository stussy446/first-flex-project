import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get environment variables
    const flexApiKey = process.env.FLEX_API_KEY;
    const flexBaseUrl = process.env.FLEX_BASE_URL;

    if (!flexApiKey || !flexBaseUrl) {
      return NextResponse.json(
        { error: "Flex API credentials not configured" },
        { status: 500 }
      );
    }

    // List products from Flex
    const response = await fetch(`${flexBaseUrl}/v1/products`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${flexApiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Flex Products List Error:", errorData);
      return NextResponse.json(
        { error: "Failed to list products from Flex", details: errorData },
        { status: response.status }
      );
    }

    const products = await response.json();
    console.log("Flex Products:", JSON.stringify(products, null, 2));

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("List Products API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}