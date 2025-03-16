"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import Link from "next/link";
import { useCategories } from "../context/categoriesContext";
const Page = () => {
  const { categories } = useCategories();

  return (
    <div id="collections" className="flex flex-col items-center mt-10 mb-10">
      <h2 className="font-[600] text-center lg:text-4xl text-2xl text-[var(--hover-color)] mb-6">
        Collections
      </h2>

      <div className="w-full max-w-7xl px-4">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={3}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 15,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
          }}
        >
          {categories.map((c, index) => (
            <SwiperSlide key={index}>
              <div className="group bg-[var(--button-bg)]  p-6 rounded-lg shadow-lg text-white w-full h-[400px] flex flex-col items-center relative overflow-hidden cursor-grab">
                <p className="text-xl font-[900] mb-4">{c.name}</p>

                <Link href={`/collections/${c.id}/products`} passHref>
                  <button className="z-100 mb-7 absolute bottom-0 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-300 bg-[var(--button-bg)] text-white px-6 py-2 rounded-lg hover:bg-gradient-to-br from-[#0B0C10] via-[#1F2833] mt-12">
                    View More
                  </button>
                </Link>

                <img
                  src={c.image.cloudinaryUrl}
                  alt={c.name}
                  width={400}
                  height={200}
                  className="absolute bottom-0 left-0 w-full h-[300px] object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Page;
