import React from "react";

const Contact = () => {
  // Email encrypted with base64 to avoid crawlers spamming me (hopefully?)
  const emailBase64 = "Y2hhc2Uuc2VsdHoyMUBnbWFpbC5jb20=";

  return (
    <main className={"max-w-[800px] mx-auto pb-24"}>
      <h1 className={"text-4xl font-serif border-b"}>Contact me</h1>
      <address className={"text-xl mt-12"}>
        {/* Email */}
        <div>
          <h2 className={"border-b mb-2 text-2xl"}>Email</h2>
          <a
            href={`mailto:${atob(emailBase64)}`}
            className={"text-blue-700 hover:underline"}
          >
            {atob(emailBase64)}
          </a>
        </div>
        {/* Github */}
        <div>
          <h2 className={"border-b mb-2 mt-12 text-2xl"}>Github</h2>
          <a
            href={"https://www.github.com/cseltzner"}
            target={"_blank"}
            rel="noreferrer"
            className={"text-blue-700 hover:underline"}
          >
            Github link
          </a>
        </div>
      </address>
    </main>
  );
};

export default Contact;
