import React, { CSSProperties, useState } from "react";
import Link from "next/link";

interface Props {
  children: any;
  links: { href: string; name: string }[];
  onClose: () => void;
}

const NavMenuDropdown = ({ children, links, onClose }: Props) => {
  const [isActive, setIsActive] = useState(false);
  return (
    <>
      <div
        className={`${
          isActive && "my-4"
        } text-4xl text-center relative group cursor-pointer pt-2 text-white`}
      >
        <div
          className={`${isActive && "text-blue-500"}`}
          onClick={() => setIsActive((prev) => !prev)}
        >
          {children}
        </div>
        <ul
          className={`max-h-0 mt-3 ${
            isActive && "max-h-[1000px] scale-100 opacity-100"
          } opacity-0 scale-0 transition-all duration-700 ease-in-out origin-top`}
        >
          {links.map((link, index) => {
            return (
              <li
                key={index}
                className={"py-2 hover:text-zinc-400"}
                onClick={() => onClose()}
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

export default NavMenuDropdown;
