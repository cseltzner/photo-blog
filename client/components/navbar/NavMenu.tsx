import React, { useEffect } from "react";
import { navAdminLinks, navGalleryLinks } from "../../resources/links";
import Link from "next/link";
import NavMenuDropdown from "./NavMenuDropdown";
import { useAuthContext } from "../../hooks/useAuthContext";

interface Props {
  onCloseHandler: () => void;
  isOpen: boolean;
  onLogout: () => void;
}

const NavMenu = ({ onCloseHandler, isOpen, onLogout }: Props) => {
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
        {/* Home */}
        <div
          className={
            "text-white py-4 text-4xl  transition-all hover:text-zinc-400"
          }
        >
          <Link href={"/"} passHref={true}>
            <a onClick={() => onCloseHandler()}>Home</a>
          </Link>
        </div>
        {/* GallerySection */}
        <NavMenuDropdown
          links={navGalleryLinks}
          onClose={() => onCloseHandler()}
        >
          Gallery
        </NavMenuDropdown>
        {/* Chase's favorites */}
        <div
          className={
            "text-white py-4 text-4xl transition-all hover:text-zinc-400"
          }
        >
          <Link href={"/favorites"} passHref={true}>
            <a onClick={() => onCloseHandler()}> Chase&apos;s favorites</a>
          </Link>
        </div>
        {/* About */}
        <div
          className={
            "text-white py-4 text-4xl  transition-all hover:text-zinc-400"
          }
        >
          <Link href={"/about"} passHref={true}>
            <a onClick={() => onCloseHandler()}>About</a>
          </Link>
        </div>
        {/* Contact */}
        <div
          className={
            "text-white py-4 text-4xl  transition-all hover:text-zinc-400"
          }
        >
          <Link href={"/contact"} passHref={true}>
            <a onClick={() => onCloseHandler()}>Contact</a>
          </Link>
        </div>
        z {/* Admin tab */}
        {auth.isLoggedIn && (
          <NavMenuDropdown
            links={navAdminLinks}
            onClose={() => onCloseHandler()}
          >
            Admin
          </NavMenuDropdown>
        )}
        {/* Log out */}
        {auth.isLoggedIn && (
          <div className="text-white py-4 text-4xl  transition-all hover:text-zinc-400">
            <button
              onClick={() => {
                onLogout();
                onCloseHandler();
              }}
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default NavMenu;
