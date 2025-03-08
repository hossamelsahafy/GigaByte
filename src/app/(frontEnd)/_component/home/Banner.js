const Banner = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-around items-center gap-5 h-full w-full bg-gradient-to-br from-[#0B0C10] via-[#1F2833] to-[#2C3E50] mt-10 p-8">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-white text-center lg:text-center">
          <p
            className="text-[var(--hover-color)] text-lg lg:text-2xl font-semibold relative uppercase inline-block
                after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] 
                after:bg-[var(--hover-color)]"
          >
            Creating a feature now!
          </p>
          <div className="text-center lg:text-center flex flex-col items-center mt-2">
            <p className="text-xl md:text-2xl lg:text-3xl font-bold flex flex-col md:flex-row items-center justify-center">
              Best
              <span className="text-[var(--hover-color)] md:inline block md:ml-2">
                Laptops!
              </span>
            </p>
            <p className="text-sm  lg:text-lg flex flex-col  items-center justify-center mt-2">
              Our extensive collection of
              <span className="md:inline block md:ml-2">
                men’s and women’s!
              </span>
            </p>
            <div className="flex justify-center mt-5">
              <button className="px-6 py-3 bg-[var(--button-bg)] text-white cursor-pointer rounded-xl hover:bg-gradient-to-br from-[#0B0C10] via-[#1F2833] to-[#2C3E50] transition-all duration-300">
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 lg:scale-125">
        <img
          src="/Banner.png"
          alt="Banner"
          className="w-full h-auto max-w-md"
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center lg:text-center lg:items-center lg:justify-center px-4">
        <div className="text-center lg:text-center mt-8 lg:mt-0">
          <p className="text-white text-lg md:text-xl lg:text-2xl font-bold">
            Great deals every weekend!
          </p>
          <p className="text-[var(--hover-color)] text-xl md:text-2xl lg:text-3xl font-bold mt-2">
            From 8500EGP
          </p>
        </div>
      </div>
    </div>
  );
};

export default Banner;
