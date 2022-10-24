import React from "react";
import Image from "next/image";
import logo from "../../assets/sp-with-icon.svg";
import Link from "next/link";
import NavDropdown from "./NavDropdown";
import { navGalleryLinks } from "../../resources/links";

const Navbar = () => {
  return (
    <nav
      className={
        "text-[1.35rem] w-full py-8 flex flex-row justify-evenly items-center"
      }
    >
      {/*  Logo  */}
      <div className={"max-w-[225px] min-w-[200px] cursor-pointer"}>
        <Image src={logo} alt={"SeltzPort brand"} role={"navigation"} />
      </div>

      {/*  Hamburger icon when smaller than lg screens  */}
      <div className={"lg:hidden"}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </div>

      {/*  Navbar at lg screens */}
      {/*  Main links  */}
      <ul
        className={
          "-ml-6 flex-row gap-12 justify-between items-center hidden lg:flex"
        }
      >
        <li>
          <Link href={"/"} passHref={true}>
            <a className={"inline-block px-1 py-2 hover:text-gray-800"}>Home</a>
          </Link>
        </li>
        <li>
          <NavDropdown
            links={navGalleryLinks}
            defaultHref={navGalleryLinks[0].href}
          >
            Gallery
          </NavDropdown>
        </li>
        <li>
          <Link href={"/favorites"} passHref={true}>
            <a className={"inline-block px-1 py-2 hover:text-gray-800"}>
              Chase&apos;s favorites
            </a>
          </Link>
        </li>
        <li>
          <Link href={"/about"} passHref={true}>
            <a className={"inline-block px-1 py-2 hover:text-gray-800"}>
              About
            </a>
          </Link>
        </li>
      </ul>

      {/*  Contact  */}
      <Link href={"/contact"} passHref={true} className={"hidden lg:block"}>
        <a className={"hidden lg:inline-block px-1 py-2 hover:text-gray-800"}>
          Contact
        </a>
      </Link>
    </nav>
  );
};

export default Navbar;
