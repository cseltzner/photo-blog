import React, { useEffect, useState } from "react";
import Image from "next/image";
import logo from "../../assets/logo/sp-with-icon.svg";
import Link from "next/link";
import NavDropdown from "./NavDropdown";
import { navAdminLinks, navGalleryLinks } from "../../resources/links";
import NavMenu from "./NavMenu";
import { useAuthContext } from "../../hooks/useAuthContext";

const Navbar = () => {
  // State
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Context
  const auth = useAuthContext();

  const onMenuButtonClick = () => {
    setSidebarOpen(true);
  };

  const onMenuCloseButtonClick = () => {
    setSidebarOpen(false);
  };

  // Hide sidebar when screen is larger than lg breakpoint
  useEffect(() => {
    window.addEventListener("resize", () => {
      if (document.body.offsetWidth >= 1024) {
        setSidebarOpen(false);
      }
    });
    return () => {
      // Remove event listener on unmount
      window.removeEventListener("resize", () => {
        if (document.body.offsetWidth >= 1024) {
          setSidebarOpen(false);
        }
      });
    };
  }, []);

  return (
    <nav
      className={
        "container mx-auto text-[1.35rem] lg:text-2xl w-full py-12 flex flex-row justify-between items-center"
      }
      id="top-nav"
    >
      {/*  Logo  */}
      <div className={"max-w-[225px] min-w-[200px] cursor-pointer"}>
        <Image src={logo} alt={"SeltzPort brand"} role={"navigation"} />
      </div>

      {/*  Hamburger icon when smaller than lg screens  */}
      <div
        className={
          "group lg:hidden relative cursor-pointer p-4 transition-all rounded-full hover:bg-blue-50 "
        }
        onClick={() => onMenuButtonClick()}
      >
        <div
          className={
            "absolute left-0 transition-all duration-300 ease-in-out -translate-x-[200%] opacity-0 group-hover:-translate-x-[120%] group-hover:opacity-90"
          }
        >
          Menu
        </div>
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
      {/*  Navigation menu on small screens  */}
      <NavMenu
        onCloseHandler={() => onMenuCloseButtonClick()}
        isOpen={sidebarOpen}
      />

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

      {/*  Admin tab (if logged in)  */}
      {auth.isLoggedIn && (
        <div className={"hidden lg:inline-block"}>
          <NavDropdown links={navAdminLinks}>Admin</NavDropdown>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
