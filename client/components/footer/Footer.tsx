import React from "react";
import Link from "next/link";
import { navGalleryLinks } from "../../resources/links";
import { useAuthContext } from "../../hooks/useAuthContext";
import { footerStrings as strings } from "../../strings/components/footer/footerStrings";

const Footer = () => {
  const auth = useAuthContext();

  return (
    <footer className={"bg-zinc-900 text-opacity-90 text-white relative"}>
      <div
        className={
          "container flex justify-around items-start py-12 mx-auto h-full flex"
        }
      >
        <div className="underline text-xl flex flex-col gap-8 text-lg justify-between">
          <Link href={strings.html_navHomeHref} passHref={true}>
            <a className={"hover:text-blue-300"}>{strings.html_navHome}</a>
          </Link>
          <Link href={strings.html_navFavoritesHref} passHref={true}>
            <a className={"hover:text-blue-300"}>{strings.html_navFavorites}</a>
          </Link>
          <Link href={strings.html_navAboutHref} passHref={true}>
            <a className={"hover:text-blue-300"}>{strings.html_navAbout}</a>
          </Link>
          <Link
            href={`${
              auth.isLoggedIn
                ? strings.html_navAdminUploadHref
                : strings.html_navAdminLoginHref
            }`}
            passHref={true}
          >
            <a className={"hover:text-blue-300"}>{strings.html_navAdmin}</a>
          </Link>
        </div>
        <div className={"flex flex-col flex-wrap"}>
          <Link href={strings.html_navGalleryHref} passHref={true}>
            <a className={"text-xl underline hover:text-blue-300"}>
              {strings.html_navGallery}
            </a>
          </Link>
          {navGalleryLinks.map((link) => {
            return (
              <Link key={link.href} href={link.href} passHref={true}>
                <a className={"text-lg hover:underline hover:text-blue-300"}>
                  {link.name}
                </a>
              </Link>
            );
          })}
        </div>
      </div>
      <div className={"container mx-auto flex justify-center pb-4"}>
        <div>{strings.html_copyright}</div>
      </div>
      <div className="absolute right-12 bottom-12 md:bottom-8">
        <a
          className={"fill-white hover:fill-blue-300 transition-all"}
          href={strings.html_githubHref}
          target={"_blank"}
          rel="noreferrer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-[24px] h-[24px] md:w-[48px] md:h-[48px]`}
            viewBox="0 0 24 24"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
