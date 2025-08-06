import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { product_id, unit_amount } = await request.json();
    
    if (!product_id || !unit_amount) {
      return NextResponse.json(
        { error: "product_id and unit_amount are required" },
        { status: 400 }
      );
    }

    // Get environment variables
    const flexApiKey = process.env.FLEX_API_KEY;
    const flexBaseUrl = process.env.FLEX_BASE_URL;

    if (!flexApiKey || !flexBaseUrl) {
      return NextResponse.json(
        { error: "Flex API credentials not configured" },
        { status: 500 }
      );
    }

    // Create price in Flex
    const response = await fetch(`${flexBaseUrl}/v1/prices`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${flexApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price: {
          product: product_id,
          description: `Price for product ${product_id}`,
          unit_amount: Math.round(unit_amount * 100), // Convert to cents
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Flex Price API Error:", errorData);
      return NextResponse.json(
        { error: "Failed to create price in Flex", details: errorData },
        { status: response.status }
      );
    }

    const flexPrice = await response.json();
    console.log("✅ Price created:", JSON.stringify(flexPrice, null, 2));

    return NextResponse.json({
      success: true,
      price: flexPrice,
      message: "Price created successfully in Flex",
    });
  } catch (error) {
    console.error("Price API Route Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}