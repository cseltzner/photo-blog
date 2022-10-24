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
      <div className={"relative group cursor-pointer p-2 hover:text-gray-800"}>
        {defaultHref ? (
          <Link href={defaultHref}>{children}</Link>
        ) : (
          <div>{children}</div>
        )}
        <ul
          className={
            "absolute text-black ml-1 mt-2 scale-0 group-hover:scale-100 transition-all ease-in-out origin-top from-zinc-100 to-zinc-50 via-zinc-50 bg-gradient-to-br rounded"
          }
        >
          {links.map((link, index) => {
            return (
              <li
                key={index}
                className={
                  "py-4 rounded px-8 from-zinc-200 to-zinc-300 hover:bg-gradient-to-r"
                }
              >
                <Link href={link.href}>{link.name}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default NavDropdown;
