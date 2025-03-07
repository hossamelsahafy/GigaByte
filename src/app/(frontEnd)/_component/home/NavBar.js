"use client";
import Link from "next/link";
import { FaTimes } from "react-icons/fa";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import Image from "next/image";
import { useState } from "react";

const NavBar = ({ isOpen, setIsOpen, accountName, accountLink }) => {
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);

  const elements = [
    { name: "Home", link: "/" },
    { name: "Collections", link: "/collections", isDropdown: true },
    { name: "About", link: "/about" },
    { name: "Contact Us", link: "/contact-us" },
  ];

  const collections = [
    { name: "New Laptops", link: "/new-laptops" },
    { name: "Used Laptops", link: "/used-laptops" },
    { name: "Accessories", link: "/accessories" },
  ];

  return (
    <>
      <div className="hidden lg:flex flex-row justify-center gap-10 items-center">
        {elements.map((e, index) =>
          e.isDropdown ? (
            <div key={index} className="relative group ">
              <span className="hover:text-[var(--hover-color)] cursor-pointer font-[600] text-xl">
                {e.name}
              </span>
              <div className="absolute left-0 hidden bg-[#0f0c0c]  z-1000 group-hover:flex flex-col shadow-lg rounded-lg py-2 px-4 w-48">
                {collections.map((c, idx) => (
                  <Link
                    key={idx}
                    href={c.link}
                    className="block text-[var(--white)] hover:text-[var(--hover-color)] py-1"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Link
              key={index}
              href={e.link}
              className="hover:text-[var(--hover-color)] cursor-pointer font-[600] text-xl"
            >
              {e.name}
            </Link>
          )
        )}
      </div>

      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-full bg-opacity-90 bg-[var(--slide-bar)] text-white transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <button
          className="absolute top-4 right-4 text-2xl hover:text-[var(--hover-color)]"
          onClick={() => setIsOpen(false)}
        >
          <FaTimes />
        </button>

        <div className="flex flex-col items-center justify-center h-full gap-6 text-2xl font-[600] -mt-20">
          <Image src="/Logo.png" width={400} height={200} alt="logo" />

          {elements.map((e, index) =>
            e.isDropdown ? (
              <div
                key={index}
                className="flex flex-col items-center w-full ml-2 "
              >
                <button
                  className="hover:text-[var(--hover-color)] mb-5 flex items-center gap-0 "
                  onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}
                >
                  {e.name}
                  <div
                    className={`transition-transform duration-300  ${
                      isCollectionsOpen ? "rotate-90" : "rotate-0"
                    }`}
                  >
                    <FaChevronRight />
                  </div>
                </button>
                <div
                  className={`transition-all duration-500 overflow-hidden ${
                    isCollectionsOpen
                      ? "max-h-60 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    {collections.map((c, idx) => (
                      <Link
                        key={idx}
                        href={c.link}
                        className="text-lg hover:text-[var(--hover-color)]"
                        onClick={() => setIsOpen(false)}
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={index}
                href={e.link}
                className="hover:text-[var(--hover-color)] mb-5"
                onClick={() => setIsOpen(false)}
              >
                {e.name}
              </Link>
            )
          )}

          {accountName && accountLink && (
            <Link
              href={accountLink}
              className="hover:text-[var(--hover-color)]"
              onClick={() => setIsOpen(false)}
            >
              {accountName}
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default NavBar;
