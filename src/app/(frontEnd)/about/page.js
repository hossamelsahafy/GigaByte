const Page = () => {
  return (
    <div className="min-h-screen bg-[#0B0C10] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-[var(--hover-color)]">
          About Us
        </h1>

        <div className="space-y-6 text-lg">
          <p>
            Welcome to{" "}
            <span className="font-semibold text-[var(--hover-color)]">
              Gigabyte
            </span>
            , your trusted partner in technology solutions! With over{" "}
            <span className="font-semibold">15 years of experience</span>, we
            have been dedicated to providing top-notch services and products to
            meet all your tech needs. Whether you're looking for the latest
            laptops, reliable PCs, or high-quality accessories, we’ve got you
            covered.
          </p>

          <div>
            <h2 className="text-2xl font-bold mb-4 text-[var(--hover-color)]">
              What We Offer
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <span className="font-semibold">New Laptops & PCs</span>:
                Explore our wide range of brand-new laptops and PCs from leading
                brands, designed to meet the demands of both personal and
                professional use.
              </li>
              <li>
                <span className="font-semibold">Used Laptops & PCs</span>: Get
                premium-quality, refurbished laptops and PCs at unbeatable
                prices, perfect for those seeking affordability without
                compromising performance.
              </li>
              <li>
                <span className="font-semibold">Accessories</span>: From
                keyboards and mice to chargers and adapters, we offer a
                comprehensive selection of accessories to enhance your computing
                experience.
              </li>
              <li>
                <span className="font-semibold">Repair Services</span>: Our
                expert technicians provide reliable repair services for laptops,
                PCs, and accessories. Whether it’s a hardware issue or software
                troubleshooting, we’ll have your device running smoothly in no
                time.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 text-[var(--hover-color)]">
              Why Choose Us?
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <span className="font-semibold">15 Years of Expertise</span>:
                With over a decade and a half in the industry, we bring
                unparalleled knowledge and experience to every product and
                service we offer.
              </li>
              <li>
                <span className="font-semibold">Quality Assurance</span>: We are
                committed to delivering only the best, ensuring that every
                product and repair meets the highest standards of quality.
              </li>
              <li>
                <span className="font-semibold">Customer-Centric Approach</span>
                : Your satisfaction is our priority. We strive to provide
                personalized solutions and exceptional customer service.
              </li>
              <li>
                <span className="font-semibold">Affordable Pricing</span>: We
                believe in offering premium products and services at competitive
                prices, making technology accessible to everyone.
              </li>
            </ul>
          </div>

          <p>
            At{" "}
            <span className="font-semibold text-[var(--hover-color)]">
              Gigabyte
            </span>
            , we are more than just a tech store – we are your partners in
            innovation. Let us help you stay connected, productive, and ahead of
            the curve. Visit us today and experience the difference!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
