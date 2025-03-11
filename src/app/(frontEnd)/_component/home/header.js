"use client";
import Image from "next/image";
import { CiSearch } from "react-icons/ci";
import { IoMdCart } from "react-icons/io";
import { FaBars } from "react-icons/fa6";
import { MdAccountCircle } from "react-icons/md";
import { useState } from "react";
import Link from "next/link";
import NavBar from "./NavBar";
import { useSession, signOut } from "next-auth/react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();

  const handleSignOut = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/auth";
  };

  const right = [
    {
      name: "Search",
      Icon: <CiSearch />,
    },
    {
      name: session ? "Profile" : "Account",
      Icon: <MdAccountCircle />,
      link: session ? "/profile" : "/auth",
    },
    {
      name: "Cart",
      Icon: <IoMdCart />,
      link: session ? "/cart" : "/auth",
    },
    ...(session
      ? [
          {
            name: "Sign Out",
            Icon: null,
            link: null,
            onClick: handleSignOut,
          },
        ]
      : []),
  ];

  const acc = right.find((r) => r.name === (session ? "Profile" : "Account"));

  if (status === "loading") {
    return <div>Loading...</div>;
  }

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
                  ) : r.onClick ? (
                    <button onClick={r.onClick}>{r.name}</button>
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

        <div className="hidden lg:flex font-[600] justify-end gap-5 cursor-pointer">
          {right.map((r, index) => (
            <div
              key={index}
              className="flex items-center hover:text-[var(--hover-color)]"
            >
              {r.link ? (
                <Link href={r.link}>{r.name}</Link>
              ) : r.onClick ? (
                <button onClick={r.onClick}>{r.name}</button>
              ) : (
                r.name
              )}
              {r.Icon && <span className="text-2xl ml-2">{r.Icon}</span>}
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
