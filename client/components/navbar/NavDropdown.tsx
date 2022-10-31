import React, { CSSProperties } from "react";
import Link from "next/link";

interface Props {
  children: any;
  links: { href: string; name: string }[];
  defaultHref?: string;
}

const NavDropdown = ({ children, links, defaultHref }: Props) => {
  return (
    <>
      <div className={"relative group cursor-pointer p-2 hover:text-zinc-500"}>
        {defaultHref ? (
          <Link href={defaultHref} className={"w-full h-full"}>
            {children}
          </Link>
        ) : (
          <div>{children}</div>
        )}
        <ul
          className={
            "absolute z-10 text-black ml-1 mt-2 scale-0 group-hover:scale-100 transition-all ease-in-out origin-top from-zinc-100 to-zinc-50 via-zinc-50 bg-gradient-to-br rounded"
          }
        >
          {links.map((link, index) => {
            return (
              <Link key={index} href={link.href}>
                <li
                  className={
                    "py-4 rounded px-10 text-xl from-zinc-200 to-zinc-300 hover:bg-gradient-to-r"
                  }
                >
                  {link.name}
                </li>
              </Link>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default NavDropdown;
