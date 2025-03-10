"use client";
import Link from "next/link";
import Image from "next/image";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const elements = [
    { name: "Home", link: "/" },
    { name: "Collections", link: "/#collections" },
    { name: "Top Selling", link: "/#top-selling" },
    { name: "About", link: "/about" },
    { name: "Contact Us", link: "/contact-us" },
  ];

  const collections = [
    { name: "New Laptops", link: "/new-laptops" },
    { name: "Used Laptops", link: "/used-laptops" },
    { name: "Accessories", link: "/accessories" },
  ];

  const socialMedia = [
    { name: "Facebook", icon: <FaFacebook />, link: "#" },
    { name: "Twitter", icon: <FaTwitter />, link: "#" },
    { name: "Instagram", icon: <FaInstagram />, link: "#" },
    { name: "LinkedIn", icon: <FaLinkedin />, link: "#" },
  ];

  return (
    <footer className="bg-[var(--slide-bar)] text-white py-10 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-center lg:items-start">
            <Image src="/Logo.png" width={200} height={100} alt="logo" />
            <p className="mt-4 text-center lg:text-left">
              Your one-stop shop for the latest laptops and accessories. Quality
              and affordability guaranteed.
            </p>
          </div>

          <div className="flex lg:my-0 mt-12 flex-col items-center lg:items-start">
            <h3 className="text-xl font-[600] mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {elements.map((e, index) => (
                <li key={index}>
                  <Link
                    href={e.link}
                    className="hover:text-[var(--hover-color)]"
                  >
                    {e.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center lg:items-start">
            <h3 className="text-xl font-[600] mb-4">Collections</h3>
            <ul className="space-y-2">
              {collections.map((c, index) => (
                <li key={index}>
                  <Link
                    href={c.link}
                    className="hover:text-[var(--hover-color)]"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center lg:items-start">
            <h3 className="text-xl font-[600] mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              {socialMedia.map((s, index) => (
                <Link
                  key={index}
                  href={s.link}
                  className="hover:text-[var(--hover-color)] text-2xl"
                >
                  {s.icon}
                </Link>
              ))}
            </div>
            <h3 className="text-xl font-[600] mt-6 mb-4">Contact Us</h3>
            <p>Email: gigabyte.info.010@gmail.com</p>
            <p>Phone: +201002750048</p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p>&copy; {new Date().getFullYear()} Hossam. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
