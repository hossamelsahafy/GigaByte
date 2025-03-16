"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useProducts } from "../../../../context/ProductsContext.js";
import { IoMdCart } from "react-icons/io";
import { useCart } from "../../../../context/CartContext.js";

export default function ProductDetails() {
  const { productId } = useParams();
  const { products } = useProducts();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    if (productId && products.length > 0) {
      const foundProduct = products.find((p) => p.id === productId);
      setProduct(foundProduct);
      const imageUrls = foundProduct.images
        .map((imageItem) => {
          if (imageItem.image && imageItem.image.length > 0) {
            console.log(imageItem.image[0].cloudinaryUrl);

            return imageItem.image[0].cloudinaryUrl;
          }
          return null;
        })
        .filter((cloudinaryUrl) => cloudinaryUrl !== null); // Remove null values if any image doesn't have a valid URL

      if (imageUrls.length > 0) {
        setSelectedImage(imageUrls[0]);
      }
    }
  }, [productId, products]);

  if (!product) return <div className="text-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-[var(--background-color)] text-[var(--foreground-color)] flex items-center justify-center p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex md:flex-col flex-row  gap-2 bg-[var(--secondary-bg)] p-4 rounded-lg">
          {product.images.map((img, index) => {
            return (
              <Image
                key={index}
                src={img.image[0].cloudinaryUrl}
                alt={product.name}
                width={80}
                height={80}
                className="cursor-pointer rounded-lg object-cover w-20 h-20 hover:opacity-75"
                onClick={() => setSelectedImage(img.image[0].cloudinaryUrl)}
              />
            );
          })}
        </div>
        <div className="max-w-4xl w-full bg-[var(--card-bg)] shadow-lg rounded-2xl overflow-hidden p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[var(--secondary-bg)] p-4 rounded-lg flex items-center justify-center w-full">
            <Image
              src={selectedImage}
              alt={product.name}
              width={500}
              height={500}
              className="rounded-lg object-cover w-full h-80"
            />
          </div>
          <div className="flex flex-col space-y-4">
            <h1 className="text-3xl font-bold text-[var(--hover-color)]">
              {product.name}
            </h1>
            <p className="text-lg text-[var(--foreground-color)]">
              {product.description}
            </p>
            <p className="text-2xl font-semibold text-[var(--accent-color)]">
              ${product.price}
            </p>
            <button
              onClick={() => addToCart(product)}
              className="cursor-pointer bg-[var(--button-bg)] hover:bg-gradient-to-br from-[#0B0C10] via-[#1F2833] transition-all duration-300 text-[var(--white)] px-6 py-3 rounded-lg shadow-md flex text-center justify-center items-center gap-2"
            >
              Add to Cart
              <span>
                <IoMdCart className="text-xl " />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
