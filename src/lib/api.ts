// Frontend API client for making requests to our Next.js API routes
import { ProductToCreate, FlexProduct, FlexPrice, CartItem } from "@/types/product";

// Response type for our API
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
};

// Function to create a product via our API route
export async function createProductInFlex(
  productData: ProductToCreate
): Promise<ApiResponse<FlexProduct>> {
  try {
    const response = await fetch("/api/flex/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || "Failed to create product",
        details: result.details,
      };
    }

    return {
      success: true,
      data: result.product,
    };
  } catch (error) {
    console.error("API Client Error:", error);
    return {
      success: false,
      error: "Network error - could not connect to API",
    };
  }
}

// Function to create a price via our API route
export async function createPriceInFlex(
  product_id: string,
  unit_amount: number
): Promise<ApiResponse<FlexPrice>> {
  try {
    const response = await fetch("/api/flex/prices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product_id, unit_amount }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || "Failed to create price",
        details: result.details,
      };
    }

    return {
      success: true,
      data: result.price,
    };
  } catch (error) {
    console.error("Price API Client Error:", error);
    return {
      success: false,
      error: "Network error - could not connect to API",
    };
  }
}

// Function to create a checkout session
export async function createCheckoutSession(
  line_items: { price: string; quantity: number }[]
): Promise<ApiResponse<{ redirect_url: string }>> {
  try {
    const response = await fetch("/api/flex/checkout/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ line_items }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || "Failed to create checkout session",
        details: result.details,
      };
    }

    return {
      success: true,
      data: { redirect_url: result.checkout_session.checkout_session.redirect_url },
    };
  } catch (error) {
    console.error("Checkout API Client Error:", error);
    return {
      success: false,
      error: "Network error - could not connect to API",
    };
  }
}
