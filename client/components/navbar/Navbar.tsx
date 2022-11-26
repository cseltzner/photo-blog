import React, { useEffect, useState } from "react";
import Image from "next/image";
import logo from "../../assets/logo/sp-with-icon.svg";
import Link from "next/link";
import NavDropdown from "./NavDropdown";
import { navAdminLinks, navGalleryLinks } from "../../resources/links";
import NavMenu from "./NavMenu";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useRouter } from "next/router";
import { useAlertContext } from "../../hooks/useAlertContext";
import { apiProxy } from "../../utils/apiProxy";
import { navbarStrings as strings } from "../../strings/components/navbar/navbarStrings";

const Navbar = () => {
  // State
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Context
  const auth = useAuthContext();
  const alert = useAlertContext();

  const router = useRouter();

  const onMenuButtonClick = () => {
    setSidebarOpen(true);
  };

  const onMenuCloseButtonClick = () => {
    setSidebarOpen(false);
  };

  const onLogOut = () => {
    localStorage.removeItem("token");
    auth.setIsLoggedIn(false);
    router.push("/");
    alert.setAlert({
      type: "success",
      title: strings.alert_logoutSuccessTitle,
      messages: [strings.alert_logoutSuccess],
    });
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

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuthorized = async () => {
      auth.setLoading(true);
      const token = localStorage.getItem("token");

      // If user has a demo token, act like they are validated client-side
      if (token === strings.demoToken) {
        auth.setIsLoggedIn(true);
        auth.setLoading(false);
        return;
      }

      // Check if user has a real auth token
      if (token) {
        const res = await fetch(apiProxy.concat("/user"), {
          method: "GET",
          headers: {
            Authorization: token,
          },
        });
        const status = res.status;

        if (status === 401) {
          auth.setIsLoggedIn(false);
          auth.setLoading(false);
          return;
        }

        if (status === 200) {
          auth.setIsLoggedIn(true);
          auth.setLoading(false);
          return;
        }

        auth.setIsLoggedIn(false);
        auth.setLoading(false);
      }
    };
    checkAuthorized().catch(console.error);
  }, []);

  return (
    <nav
      className={
        "container mx-auto text-[1.35rem] lg:text-2xl w-full py-12 px-4 flex flex-row justify-between items-center"
      }
      id="top-nav"
      aria-label={"full screen navigation bar"}
    >
      {/*  Logo  */}
      <Link href={"/"} passHref>
        <a>
          <div
            className={
              "max-w-[225px] min-w-[200px] mr-6 cursor-pointer hover:opacity-90"
            }
          >
            <Image src={logo} alt={strings.html_logoAlt} role={"navigation"} />
          </div>
        </a>
      </Link>

      {/*  Hamburger icon when smaller than lg screens  */}
      <div
        className={
          "group lg:hidden relative cursor-pointer p-4 transition-all rounded-full hover:bg-blue-50 "
        }
        onClick={() => onMenuButtonClick()}
        aria-label={"Navigation Menu Open button"}
      >
        <div
          className={
            "absolute left-0 outline-none transition-all duration-300 ease-in-out -translate-x-[200%] opacity-0 group-hover:-translate-x-[120%] group-hover:opacity-90"
          }
        >
          {strings.html_hamburgerButtonText}
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
        onLogout={() => onLogOut()}
      />

      {/*  Navbar at lg screens */}
      {/*  Main links  */}
      <ul
        className={
          "-ml-6 flex-row gap-12 justify-between items-center hidden lg:flex"
        }
        aria-label={strings.html_mainNavigationLinksLabel}
      >
        <li>
          <Link href={strings.html_navHomeHref} passHref={true}>
            <a className={"inline-block px-1 py-2 hover:text-zinc-500"}>
              {strings.html_navHome}
            </a>
          </Link>
        </li>
        <li>
          <NavDropdown
            links={navGalleryLinks}
            defaultHref={navGalleryLinks[0].href}
          >
            {strings.html_navGallery}
          </NavDropdown>
        </li>
        <li>
          <Link href={strings.html_navFavoritesHref} passHref={true}>
            <a className={"inline-block px-1 py-2 hover:text-zinc-500"}>
              {strings.html_navFavorites}
            </a>
          </Link>
        </li>
        <li>
          <Link href={strings.html_navAboutHref} passHref={true}>
            <a className={"inline-block px-1 py-2 hover:text-zinc-500"}>
              {strings.html_navAbout}
            </a>
          </Link>
        </li>
      </ul>

      {/*  Contact  */}
      <Link
        href={strings.html_navContactHref}
        passHref={true}
        className={"hidden lg:block"}
      >
        <a className={"hidden lg:inline-block px-1 py-2 hover:text-zinc-500"}>
          {strings.html_navContact}
        </a>
      </Link>

      {/*  Admin tab (if logged in)  */}
      {auth.isLoggedIn && (
        <div
          className={"hidden lg:flex gap-8"}
          aria-label={strings.html_adminNavigationLabel}
        >
          <NavDropdown links={navAdminLinks}>
            {strings.html_navAdmin}
          </NavDropdown>
          <button
            onClick={() => {
              onLogOut();
            }}
          >
            {strings.html_navLogout}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
