"use client";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { IoMdCart } from "react-icons/io";
import Image from "next/image";
import { useCart } from "../context/CartContext.js";
import { useProducts } from "../context/ProductsContext";

const Page = () => {
  const { products } = useProducts();
  const [randomProducts, setRandomProducts] = useState([]);
  const { addToCart } = useCart();

  const getRandomProducts = () => {
    if (!products || products.length === 0) return [];
    return [...products].sort(() => Math.random() - 0.5).slice(0, 5);
  };

  useEffect(() => {
    setRandomProducts(getRandomProducts());

    const interval = setInterval(() => {
      setRandomProducts(getRandomProducts());
    }, 180000); // Refresh every 3 minutes

    return () => clearInterval(interval);
  }, [products]);

  return (
    <div
      id="top-selling"
      className="mt-10"
      style={{ backgroundColor: "var(--background-color)" }}
    >
      <div className="flex justify-center">
        <p className="text-2xl font-semibold text-[var(--hover-color)] lg:text-4xl">
          Top Selling
        </p>
      </div>

      <div className="w-full flex justify-center">
        <div className="w-full max-w-7xl px-4 flex justify-center items-center mt-10 mb-20">
          <Swiper
            className="w-full"
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={3}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 10 },
              768: { slidesPerView: 2, spaceBetween: 15 },
              1024: { slidesPerView: 3, spaceBetween: 20 },
            }}
          >
            {randomProducts.map((product, index) => (
              <SwiperSlide key={index} className="max-w-[505px]">
                <div className="bg-[var(--card-bg)] p-4 group rounded-lg shadow-lg flex flex-col items-center text-center relative overflow-hidden border border-[var(--border-color)]">
                  <Image
                    src={product.images[0].image[0].cloudinaryUrl}
                    alt={product.name}
                    width={400}
                    height={200}
                    className="w-full h-[200px] scale-110 mt-10 object-contain rounded-t-lg"
                  />
                  <div className="flex flex-col items-center p-4">
                    <p className="text-xl font-semibold mt-5 text-[var(--foreground-color)]">
                      {product.name}
                    </p>
                    <p className="text-lg font-bold text-[var(--accent-color)] mb-2">
                      {product.price}EGP
                    </p>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-[var(--button-bg)] opacity-0  group-hover:opacity-100 cursor-pointer text-[var(--white)] px-6 py-2 rounded-lg transition duration-300]"
                    >
                      Add To Cart <IoMdCart className="inline-block text-xl" />
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default Page;
