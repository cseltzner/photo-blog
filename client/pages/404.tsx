import React, { useEffect } from "react";
import frogPhoto from "../assets/404/frog-compressed.jpg";
import Link from "next/link";

const Custom404 = () => {
  // Update title
  useEffect(() => {
    document.title = "Page not found | Seltzport";
  }, []);

  return (
    <div className={"flex items-center flex-col gap-4 px-8 py-8 text-4xl"}>
      <h1>Oops!</h1>
      <p>Page not found</p>
      <Link href={"/"}>
        <a className={"text-blue-700 underline text-3xl mb-2"}>Return home</a>
      </Link>
      <img
        src={frogPhoto.src}
        width={900}
        alt="Small frog sitting next to some purple flowers"
      />
    </div>
  );
};

export default Custom404;
