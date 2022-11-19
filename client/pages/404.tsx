import React, { useEffect } from "react";
import frogPhoto from "../assets/404/frog-compressed.jpg";
import Link from "next/link";
import { _404Strings as strings } from "../strings/pages/404Strings";

const Custom404 = () => {
  // Update title
  useEffect(() => {
    document.title = strings.html_pageTitle;
  }, []);

  return (
    <div className={"flex items-center flex-col gap-4 px-8 py-8 text-4xl"}>
      <h1>{strings.html_mainHeader}</h1>
      <p>{strings.html_mainText}</p>
      <Link href={strings.html_returnLinkHref}>
        <a className={"text-blue-700 underline text-3xl mb-2"}>
          {strings.html_returnLink}
        </a>
      </Link>
      <img src={frogPhoto.src} width={900} alt={strings.html_imgAlt} />
    </div>
  );
};

export default Custom404;
