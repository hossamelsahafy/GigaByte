"use client";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

const ContactSection = () => {
  return (
    <section className="bg-[var(--button-bg)] text-white py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl lg:text-4xl font-[600] mb-4">
              Have Questions or Need Assistance?
            </h2>
            <p className="text-lg mb-6">
              Our team is here to help! Whether you have questions about our
              products or need support, feel free to reach out. We&apos;re just
              a click away.
            </p>
            <Link
              href="/contact-us"
              className="inline-flex items-center bg-[#aaa] text-white px-8 py-3 rounded-lg hover:bg-gradient-to-br from-[#0B0C10] via-[#1F2833] transition-all duration-300"
            >
              Contact Us
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
