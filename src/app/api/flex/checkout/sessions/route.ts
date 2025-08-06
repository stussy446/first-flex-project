import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { line_items } = await request.json();
    
    if (!line_items || !Array.isArray(line_items) || line_items.length === 0) {
      return NextResponse.json(
        { error: "line_items array is required" },
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

    // Get the current URL for success/cancel redirects
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const host = request.headers.get('host');
    const baseUrl = `${protocol}://${host}`;

    // Create checkout session in Flex
    const response = await fetch(`${flexBaseUrl}/v1/checkout/sessions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${flexApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        checkout_session: {
          line_items,
          success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${baseUrl}/checkout/cancel`,
          mode: "payment",
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Flex Checkout API Error:", errorData);
      return NextResponse.json(
        { error: "Failed to create checkout session", details: errorData },
        { status: response.status }
      );
    }

    const checkoutSession = await response.json();
    console.log("✅ Checkout session created:", JSON.stringify(checkoutSession, null, 2));

    return NextResponse.json({
      success: true,
      checkout_session: checkoutSession,
      message: "Checkout session created successfully",
    });
  } catch (error) {
    console.error("Checkout Session API Route Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}