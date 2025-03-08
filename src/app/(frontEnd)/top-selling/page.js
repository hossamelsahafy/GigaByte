"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Page = () => {
  const elemnts = [
    { name: "Controller", image: "/Controller.png", price: "400" },
    { name: "Headset", image: "/Headset.png", price: "250" },
    { name: "Keyboard", image: "/Keyboard.png", price: "300" },
    { name: "Mouse", image: "/Mouse.png", price: "150" },
    { name: "Monitor", image: "/Monitor.png", price: "500" },
  ];

  return (
    <div id="top-selling" className="mt-10">
      <div className="flex justify-center">
        <p className="text-2xl font-[600] text-left text-[var(--hover-color)] lg:text-4xl">
          Top Selling
        </p>
      </div>

      <div className="w-full flex justify-center">
        <div className="w-full max-w-7xl px-4 flex justify-center items-center mt-10 mb-20">
          <Swiper
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
            {elemnts.map((c, index) => (
              <SwiperSlide key={index}>
                <div className="bg-white p-4 group rounded-lg shadow-lg w-full h-auto flex flex-col items-center text-center relative overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-[200px] group object-contain rounded-t-lg"
                  />
                  <div className="flex flex-col items-center p-4">
                    <p className="text-xl font-semibold mb-2 text-gray-800">
                      {c.name}
                    </p>
                    <p className="text-lg font-bold text-gray-700 mb-2">
                      {c.price}EGP
                    </p>
                    <button className="bg-[var(--button-bg)] group opacity-0 hover:opacity-100 cursor-pointer text-white px-6 py-2 rounded-lg transition duration-300 hover:bg-gradient-to-br from-[#0B0C10] via-[#1F2833]">
                      Details
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
