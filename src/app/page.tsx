import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
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
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                Cart (0)
              </button>
            </div>
          </div>
        </div>
      </header>

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
            <ProductCard key={`${product.name}-${index}`} product={product} />
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            💡 About HSA/FSA Payments
          </h3>
          <p className="text-gray-700 text-sm">
            Health Savings Accounts (HSA) and Flexible Spending Accounts (FSA)
            let you use pre-tax dollars for qualified medical expenses, saving
            you 30-40% on average. Items marked with green badges are
            automatically approved, while yellow badges require a Letter of
            Medical Necessity from your doctor.
          </p>
        </div>
      </main>
    </div>
  );
}
