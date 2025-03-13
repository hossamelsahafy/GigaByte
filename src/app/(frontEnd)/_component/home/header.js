"use client";
import Image from "next/image";
import { CiSearch } from "react-icons/ci";
import { IoMdCart } from "react-icons/io";
import { FaBars } from "react-icons/fa6";
import { MdAccountCircle } from "react-icons/md";
import Link from "next/link";
import NavBar from "./NavBar";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { useCart } from "../../context/CartContext";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { name } = useAuth();
  const { cartItems } = useCart();

  const right = [
    {
      name: "Search",
      Icon: <CiSearch />,
    },
    {
      name: name,
      Icon: <MdAccountCircle />,
      link: name === "Account" ? "/account" : "/auth",
    },
    {
      name: "Cart",
      Icon: (
        <div className="relative">
          <IoMdCart />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {cartItems.length}
            </span>
          )}
        </div>
      ),
      link: name === "Account" ? "/cart" : "/auth",
    },
  ];

  const acc = right.find((r) => r.name === name) || { name: "", link: "#" };

  return (
    <>
      <div className="flex flex-row items-center justify-around p-5 w-full -mt-14 mx-auto">
        <div className="hidden lg:flex justify-start font-[600]">
          <p>EGP</p>
        </div>

        <div className="flex lg:hidden cursor-pointer font-[600] text-3xl">
          <FaBars
            className="hover:text-[var(--hover-color)]"
            onClick={() => setIsOpen(true)}
          />
          <div className="absolute flex flex-row right-0 gap-2">
            {right.map((r, index) => (
              <ul key={index}>
                <li className="font-[600] text-3xl mr-2 hover:text-[var(--hover-color)]">
                  {r.link ? (
                    <Link href={r.link}>{r.Icon || r.name}</Link>
                  ) : (
                    r.Icon || r.name
                  )}
                </li>
              </ul>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <Image
            src={"/Logo.png"}
            alt="Logo"
            width={200}
            height={100}
            className="h-40 w-200 object-contain lg:ml-40"
          />
        </div>

        <div className="hidden lg:flex font-[600] justify-end gap-5 cursor-pointer relative">
          {right.map((r, index) => (
            <div
              key={index}
              className="flex items-center hover:text-[var(--hover-color)] relative"
            >
              <Link href={r.link || "#"} className="flex items-center gap-1">
                <span>{r.name}</span>
                {r.Icon && <span className="text-2xl ml-1">{r.Icon}</span>}
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="-mt-14">
        <NavBar
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          accountName={acc.name}
          accountLink={acc.link}
        />
      </div>
    </>
  );
};

export default Header;
