"use client";

import { useState } from "react";
import { ProductCard } from "./ProductCard";
import { products } from "@/data/products";
import { ProductToCreate, CartItem } from "@/types/product";
import { Header } from "./Header";
import { InfoSection } from "./InfoSection";

export function ProductGrid() {
  // Cart state - this is where we store which products are in the cart
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Function to add product to cart
  const addToCart = (product: ProductToCreate) => {
    setCartItems((prev) => {
      // Check if product already exists in cart
      const existingItemIndex = prev.findIndex(item => item.name === product.name);
      
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updated = [...prev];
        updated[existingItemIndex] = {
          ...updated[existingItemIndex],
          quantity: updated[existingItemIndex].quantity + 1,
        };
        return updated;
      } else {
        // Add new item with quantity 1
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with cart items */}
      <Header cartItems={cartItems} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Health & Wellness Products
          </h2>
          <p className="text-gray-600">
            Shop HSA/FSA eligible products for your health and wellness needs.
            Look for the green badges for auto-approved items, or yellow for
            items requiring a Letter of Medical Necessity.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard
              key={`${product.name}-${index}`}
              product={product}
              onAddToCart={addToCart}
            />
          ))}
        </div>

        {/* Info Section */}
        <InfoSection />
      </main>
    </div>
  );
}
