import React, { useEffect } from "react";
import mojoImage from "../../assets/contact/mojo.jpg";
import butterflyImage from "../../assets/contact/butterfly.jpg";
import Link from "next/link";
import { aboutStrings as strings } from "../../strings/pages/aboutStrings";

const AboutPage = () => {
  // Update title
  useEffect(() => {
    document.title = strings.html_pageTitle;
  }, []);

  return (
    <>
      <main
        className={
          "container mx-auto px-4 mt-4 mb-24 flex flex-col items-center"
        }
      >
        {/* Intro */}
        <h1 className={"text-3xl lg:text-4xl font-serif"}>
          {strings.html_mainHeader}
        </h1>
        <p className={"text-lg lg:text-xl mt-4 lg:mt-6 max-w-[60ch]"}>
          {strings.html_mainText}
        </p>

        {/* Image section */}
        <div
          className={
            "flex justify-center mt-16 border-zinc-600 border shadow-lg transition hover:scale-[100.3%]"
          }
        >
          {/* Bottom Left image */}
          <div className={"inline-block relative"}>
            <img src={mojoImage.src} alt={strings.html_img1Alt} />
            {/* Top Right image */}
            <div
              className={"absolute inset-0"}
              style={{
                clipPath: "polygon(0 0, 100% 0, 100% 100%)",
                objectFit: "fill",
              }}
            >
              <img src={butterflyImage.src} alt={strings.html_img2Alt} />
            </div>
          </div>
        </div>

        {/* For the photographers */}
        <h2 className={"mt-24 font-serif text-3xl"}>
          {strings.html_secondaryHeader}
        </h2>
        <p className={"mt-4 lg:mt-6 max-w-[60ch] text-lg lg:text-xl"}>
          {strings.html_secondaryText}
        </p>
        {/* For the developers */}
        <h2 className={"mt-24 font-serif text-3xl"}>
          {strings.html_tertiaryHeader}
        </h2>
        <p className={"mt-4 lg:mt-6 max-w-[60ch] text-lg lg:text-xl"}>
          {strings.html_tertiaryTextPar1}
        </p>
        <p className={"mt-4 lg:mt-6 max-w-[60ch] text-lg lg:text-xl"}>
          {strings.html_tertiaryTextPar2}
        </p>
        <Link href={strings.html_contactButtonHref} passHref={true}>
          <a
            className={
              "inline-block mt-8 lg:mt-16 px-4 py-3 text-xl border border-blue-500 text-blue-500 transition-all duration-300 hover:bg-blue-500 hover:text-white"
            }
          >
            {strings.html_contactButton}
          </a>
        </Link>
      </main>
    </>
  );
};

export default AboutPage;
