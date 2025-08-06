"use client";

import { useState } from "react";
import { CartItem } from "@/types/product";
import { createCheckoutSession } from "@/lib/api";

interface HeaderProps {
  cartItems: CartItem[];
}

export function Header({ cartItems }: HeaderProps) {
  const [showCart, setShowCart] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    setIsCheckingOut(true);

    try {
      // Load the price mapping via API call to avoid Turbopack issues
      const mappingResponse = await fetch("/api/flex/price-mapping");
      if (!mappingResponse.ok) {
        throw new Error("Price mapping not found. Run /api/flex/init first.");
      }

      const priceMapping = await mappingResponse.json();

      const line_items = cartItems.map((item) => {
        const priceId = priceMapping[item.name];
        if (!priceId) {
          throw new Error(
            `No price ID found for product: ${item.name}. Run /api/flex/init first.`
          );
        }
        return {
          price: priceId,
          quantity: item.quantity,
        };
      });

      const result = await createCheckoutSession(line_items);

      if (result.success && result.data?.redirect_url) {
        window.location.href = result.data.redirect_url;
      } else {
        alert(`Checkout failed: ${result.error}`);
        setIsCheckingOut(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error);
      alert(`Checkout failed: ${errorMessage}`);
      setIsCheckingOut(false);
    }
  };
  return (
    <header className="bg-white shadow-sm border-b relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              FlexHealth Store
            </h1>
            <span className="ml-2 text-sm text-gray-500">
              HSA/FSA Eligible Products
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-gray-700 hover:text-gray-900">
              <span className="sr-only">Search</span>
              🔍
            </button>
            <div className="relative">
              <button
                onClick={() => setShowCart(!showCart)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Cart ({cartCount})
              </button>

              {/* Cart Dropdown */}
              {showCart && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Shopping Cart
                    </h3>

                    {cartItems.length === 0 ? (
                      <p className="text-gray-500 text-sm">
                        Your cart is empty
                      </p>
                    ) : (
                      <>
                        <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                          {cartItems.map((item, index) => (
                            <div
                              key={`${item.name}-${index}`}
                              className="flex justify-between items-center py-2 border-b border-gray-100"
                            >
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-900">
                                  {item.name}
                                </h4>
                                <p className="text-xs text-gray-500">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                              <div className="text-sm font-medium text-gray-900">
                                ${(item.price * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-gray-200 pt-3">
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-semibold text-gray-900">
                              Total:
                            </span>
                            <span className="font-semibold text-gray-900">
                              ${cartTotal.toFixed(2)}
                            </span>
                          </div>

                          <button
                            onClick={handleCheckout}
                            disabled={isCheckingOut}
                            className="w-full bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                          >
                            {isCheckingOut
                              ? "Creating Checkout..."
                              : "Checkout with Flex 💳"}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay to close cart when clicking outside */}
      {showCart && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowCart(false)}
        />
      )}
    </header>
  );
}
