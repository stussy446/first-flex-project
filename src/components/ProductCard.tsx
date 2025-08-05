import Image from "next/image";
import { ProductToCreate } from "@/types/product";

interface ProductCardProps {
  product: ProductToCreate;
}

export function ProductCard({ product }: ProductCardProps) {
  // Helper function to get eligibility badge
  const getEligibilityBadge = () => {
    switch (product.hsa_fsa_eligibility) {
      case "eligible":
        return (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
            HSA/FSA
          </span>
        );
      case "lomn_required":
        return (
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
            LOMN
          </span>
        );
      case "not_eligible":
        return (
          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full font-medium">
            Not Eligible
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square bg-gray-100 flex items-center justify-center p-4">
        <Image
          src={product.image}
          alt={product.name}
          width={120}
          height={120}
          className="dark:invert"
        />
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 text-sm">
            {product.name}
          </h3>
          {getEligibilityBadge()}
        </div>

        <p className="text-gray-600 text-xs mb-3">{product.description}</p>

        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">
            ${product.price}
          </span>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
            Add to Cart
          </button>
        </div>

        <span className="text-xs text-gray-500 mt-1 block">
          {String(product.metadata?.category || "")}
        </span>
      </div>
    </div>
  );
}
