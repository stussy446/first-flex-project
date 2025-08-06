// Next.js API route for Flex product creation
import { NextRequest, NextResponse } from "next/server";
import { ProductToCreate, FlexProduct } from "@/types/product";

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const productData: ProductToCreate = await request.json();
    console.log(
      "📦 Received product data:",
      JSON.stringify(productData, null, 2)
    );

    // Get environment variables
    const flexApiKey = process.env.FLEX_API_KEY;
    const flexBaseUrl = process.env.FLEX_BASE_URL;

    if (!flexApiKey || !flexBaseUrl) {
      return NextResponse.json(
        { error: "Flex API credentials not configured" },
        { status: 500 }
      );
    }

    // Debug: Check API key format (safely)
    console.log("🔑 API Key prefix:", flexApiKey.substring(0, 8));
    console.log("🌐 Base URL:", flexBaseUrl);

    // Prepare the data for Flex API (remove our e-commerce specific fields)
    const { price, image, ...flexProductData } = productData;
    console.log(
      "🚀 Sending to Flex:",
      JSON.stringify(flexProductData, null, 2)
    );

    // Make request to Flex API - using the exact endpoint from their docs
    const response = await fetch(`${flexBaseUrl}/v1/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${flexApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product: flexProductData, // Flex expects data wrapped in "product" key
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Flex API Error:", errorData);
      return NextResponse.json(
        { error: "Failed to create product in Flex", details: errorData },
        { status: response.status }
      );
    }

    const flexProduct: FlexProduct = await response.json();
    console.log("✅ Flex responded:", JSON.stringify(flexProduct, null, 2));

    return NextResponse.json({
      success: true,
      product: flexProduct,
      message: "Product created successfully in Flex",
    });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
