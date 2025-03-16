"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useProducts } from "../../../context/ProductsContext.js";
import { useRouter } from "next/navigation";

const Products = () => {
  const router = useRouter();
  const { categoryId } = useParams();
  const { products } = useProducts();

  const filteredProducts = products.filter(
    (product) => product.category.id === categoryId
  );
  const handleNavigate = (product) => {
    router.push(`/collections/${categoryId}/products/${product.id}`);
  };
  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#c5c6c7] p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-[#ffcc29]">
        Our Products
      </h1>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-[#161b22] border border-[#3a3f4b] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col" // Added flex and flex-col
            >
              <div className="relative w-full aspect-w-16 aspect-h-9 flex items-center justify-center">
                <Image
                  src={product.images?.[0]?.image?.[0]?.cloudinaryUrl}
                  alt={product.name}
                  width={400}
                  height={200}
                  className="object-contain py-5 max-w-full max-h-full"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {product.name}
                </h3>
                <p className="text-[#ffcc29] text-lg mb-4">{product.price}</p>
                <div className="mt-auto">
                  <button
                    onClick={() => handleNavigate(product)}
                    className="w-full bg-[#2b313b] text-[#c5c6c7] py-2 px-4 rounded-md hover:bg-[#66fcf1] hover:text-[#0b0c10] transition-colors duration-300"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Products;
