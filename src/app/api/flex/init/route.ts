import { NextRequest, NextResponse } from "next/server";
import { products } from "@/data/products";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
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

    console.log("🚀 Starting Flex initialization...");
    const results = [];
    const priceMapping: Record<string, string> = {};

    for (const product of products) {
      try {
        console.log(`📦 Creating product: ${product.name}`);
        
        // Remove price and image fields for Flex API
        const { price, image, ...flexProductData } = product;

        // Create product in Flex
        const productResponse = await fetch(`${flexBaseUrl}/v1/products`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${flexApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product: flexProductData,
          }),
        });

        if (!productResponse.ok) {
          const errorData = await productResponse.text();
          console.error(`❌ Failed to create product ${product.name}:`, errorData);
          results.push({
            product: product.name,
            status: "failed",
            error: errorData,
          });
          continue;
        }

        const flexProduct = await productResponse.json();
        console.log(`✅ Product created: ${flexProduct.product_id}`);

        // Create price for the product
        console.log(`💰 Creating price for ${product.name}: $${price}`);
        console.log(`🔑 Using product_id: ${flexProduct.product_id}`);
        
        const pricePayload = {
          price: {
            product: flexProduct.product_id,
            description: `Price for ${product.name}`,
            unit_amount: Math.round(price * 100), // Convert to cents
          },
        };
        console.log(`📦 Price payload:`, JSON.stringify(pricePayload, null, 2));
        
        const priceResponse = await fetch(`${flexBaseUrl}/v1/prices`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${flexApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(pricePayload),
        });

        if (!priceResponse.ok) {
          const errorData = await priceResponse.text();
          console.error(`❌ Failed to create price for ${product.name}:`, errorData);
          results.push({
            product: product.name,
            product_id: flexProduct.product_id,
            status: "product_created_price_failed",
            error: errorData,
          });
          continue;
        }

        const flexPrice = await priceResponse.json();
        console.log(`✅ Price created: ${flexPrice.price_id}`);

        // Store the mapping for checkout
        priceMapping[product.name] = flexPrice.price_id;

        results.push({
          product: product.name,
          product_id: flexProduct.product_id,
          price_id: flexPrice.price_id,
          price: price,
          status: "success",
        });

        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        console.error(`❌ Error processing ${product.name}:`, error);
        results.push({
          product: product.name,
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    // Save the price mapping to a JSON file
    const mappingPath = path.join(process.cwd(), 'src/data/price-mapping.json');
    fs.writeFileSync(mappingPath, JSON.stringify(priceMapping, null, 2));

    console.log("🎉 Flex initialization completed!");
    console.log("💾 Price mapping saved to:", mappingPath);
    console.log("Results:", JSON.stringify(results, null, 2));

    return NextResponse.json({
      success: true,
      message: "Flex initialization completed",
      results,
      priceMapping,
      note: "Price mapping saved to src/data/price-mapping.json",
    });
  } catch (error) {
    console.error("Initialization Error:", error);
    return NextResponse.json(
      { error: "Internal server error during initialization" },
      { status: 500 }
    );
  }
}