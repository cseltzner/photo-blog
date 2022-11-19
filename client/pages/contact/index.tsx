import React, { useEffect } from "react";
import { contactStrings as strings } from "../../strings/pages/contactStrings";

const Contact = () => {
  // Email encrypted with base64 to avoid crawlers spamming me (hopefully?)
  const emailBase64 = "Y2hhc2Uuc2VsdHoyMUBnbWFpbC5jb20=";

  // Update title
  useEffect(() => {
    document.title = strings.html_pageTitle;
  }, []);

  return (
    <main className={"max-w-[800px] mx-auto pb-24 px-4"}>
      <h1 className={"text-4xl font-serif border-b"}>
        {strings.html_mainHeader}
      </h1>
      <address className={"text-xl mt-12"}>
        {/* Email */}
        <div>
          <h2 className={"border-b mb-2 text-2xl"}>
            {strings.html_contactHeader1}
          </h2>
          <a
            href={`mailto:${atob(emailBase64)}`}
            className={"text-blue-700 hover:underline"}
          >
            {Buffer.from(emailBase64, "base64").toString()}
          </a>
        </div>
        {/* Github */}
        <div>
          <h2 className={"border-b mb-2 mt-12 text-2xl"}>
            {strings.html_contactHeader2}
          </h2>
          <a
            href={strings.html_githubLinkHref}
            target={"_blank"}
            rel="noreferrer"
            className={"text-blue-700 hover:underline"}
          >
            {strings.html_githubLink}
          </a>
        </div>
      </address>
    </main>
  );
};

export default Contact;
