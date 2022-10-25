import React, { useEffect } from "react";
import { navAdminLinks, navGalleryLinks } from "../../resources/links";
import Link from "next/link";
import NavMenuDropdown from "./NavMenuDropdown";
import { useAuthContext } from "../../hooks/useAuthContext";

interface Props {
  onCloseHandler: () => void;
  isOpen: boolean;
}

const NavMenu = ({ onCloseHandler, isOpen }: Props) => {
  const auth = useAuthContext();

  // Escape key exits menu
  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Esc" || e.key === "Escape") {
        onCloseHandler();
      }
    });
    // Remove event listener on unmount
    window.removeEventListener("keydown", (e) => {
      if (e.key === "Esc" || e.key === "Escape") {
        onCloseHandler();
      }
    });
  }, []);

  return (
    <>
      {/* Black backdrop */}
      <div
        className={`${
          isOpen ? "scale-100 opacity-90" : "scale-0 opacity-0"
        } fixed flex flex-col justify-center items-center inset-0 transition-opacity duration-500 bg-black z-10`}
      >
        {/* Close button */}
        <div
          role={"button"}
          aria-label={"close navigation menu"}
          className={
            "absolute top-12 right-12 p-4 rounded-full text-white cursor-pointer transition hover:bg-zinc-900"
          }
          onClick={() => onCloseHandler()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        {/*  Main navigation links  */}
        <div
          className={
            "text-white py-4 text-4xl  transition-all hover:text-zinc-400"
          }
        >
          <Link href={"/"} passHref={true}>
            <a>Home</a>
          </Link>
        </div>
        {/* Gallery */}
        <NavMenuDropdown links={navGalleryLinks}>Gallery</NavMenuDropdown>
        <div
          className={
            "text-white py-4 text-4xl transition-all hover:text-zinc-400"
          }
        >
          <Link href={"/"} passHref={true}>
            <a> Chase&apos;s favorites</a>
          </Link>
        </div>
        <div
          className={
            "text-white py-4 text-4xl  transition-all hover:text-zinc-400"
          }
        >
          <Link href={"/"} passHref={true}>
            <a>About</a>
          </Link>
        </div>
        {auth.isLoggedIn && (
          <NavMenuDropdown links={navAdminLinks}>Admin</NavMenuDropdown>
        )}
      </div>
    </>
  );
};

export default NavMenu;
