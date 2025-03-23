"use client";
import Link from "next/link";
import { FaTimes } from "react-icons/fa";
import Image from "next/image";
import { useState, useEffect } from "react";

const NavBar = ({ isOpen, setIsOpen, accountName, accountLink }) => {
  const elements = [
    { name: "Home", link: "/" },
    { name: "Collections", link: "/#collections" },
    { name: "Top Selling", link: "/#top-selling" },
    { name: "About", link: "/about" },
    { name: "Contact Us", link: "/contact-us" },
  ];
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  return (
    <>
      <div className="hidden lg:flex flex-row justify-center gap-10 items-center">
        {elements.map((e, index) => (
          <Link
            key={index}
            href={e.link}
            className="hover:text-[var(--hover-color)] cursor-pointer font-[600] text-xl"
          >
            {e.name}
          </Link>
        ))}
      </div>

      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-full bg-opacity-90 bg-[var(--slide-bar)] text-white transform ${
          isOpen ? "translate-x-0 overflow-hidden" : "-translate-x-full"
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

          {elements.map((e, index) => (
            <Link
              key={index}
              href={e.link}
              className="hover:text-[var(--hover-color)] mb-5"
              onClick={() => setIsOpen(false)}
            >
              {e.name}
            </Link>
          ))}

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
