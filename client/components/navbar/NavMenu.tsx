import React, { useEffect } from "react";
import { navAdminLinks, navGalleryLinks } from "../../resources/links";
import Link from "next/link";
import NavMenuDropdown from "./NavMenuDropdown";
import { useAuthContext } from "../../hooks/useAuthContext";
import { navMenuStrings as strings } from "../../strings/components/navbar/navMenuStrings";

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
            "text-white py-2 text-3xl sm:text-4xl  transition-all hover:text-zinc-400"
          }
        >
          <Link href={strings.html_navHomeHref} passHref={true}>
            <a onClick={() => onCloseHandler()}>{strings.html_navHome}</a>
          </Link>
        </div>
        {/* GallerySection */}
        <NavMenuDropdown
          links={navGalleryLinks}
          onClose={() => onCloseHandler()}
        >
          {strings.html_navGallery}
        </NavMenuDropdown>
        {/* Chase's favorites */}
        <div
          className={
            "text-white py-2 text-3xl sm:text-4xl transition-all hover:text-zinc-400"
          }
        >
          <Link href={strings.html_navFavoritesHref} passHref={true}>
            <a onClick={() => onCloseHandler()}>{strings.html_navFavorites}</a>
          </Link>
        </div>
        {/* About */}
        <div
          className={
            "text-white py-2 text-3xl sm:text-4xl  transition-all hover:text-zinc-400"
          }
        >
          <Link href={strings.html_navAboutHref} passHref={true}>
            <a onClick={() => onCloseHandler()}>{strings.html_navAbout}</a>
          </Link>
        </div>
        {/* Contact */}
        <div
          className={
            "text-white py-2 text-3xl sm:text-4xl  transition-all hover:text-zinc-400"
          }
        >
          <Link href={strings.html_navContactHref} passHref={true}>
            <a onClick={() => onCloseHandler()}>{strings.html_navContact}</a>
          </Link>
        </div>
        z {/* Admin tab */}
        {auth.isLoggedIn && (
          <NavMenuDropdown
            links={navAdminLinks}
            onClose={() => onCloseHandler()}
          >
            {strings.html_navAdmin}
          </NavMenuDropdown>
        )}
        {/* Log out */}
        {auth.isLoggedIn && (
          <div className="text-white py-2 text-3xl sm:text-4xl  transition-all hover:text-zinc-400">
            <button
              onClick={() => {
                onLogout();
                onCloseHandler();
              }}
            >
              {strings.html_navLogout}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default NavMenu;
