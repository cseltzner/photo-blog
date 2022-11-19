import React from "react";
import bgImage from "../../../assets/home/leaf-compressed.jpg";
import Link from "next/link";
import { aboutSectionStrings as strings } from "../../../strings/components/sections/aboutSectionStrings";

const AboutSection = () => {
  return (
    <section
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.6)), url(${bgImage.src})`,
      }}
      className={
        "py-24 px-4 md:px-12 mt-24 bg-cover text-white text-center text-xl lg:text-xl leading-8 lg:leading-9"
      }
    >
      <h3 className={"text-4xl lg:text-5xl mb-8 font-serif"}>
        {strings.html_mainHeader}
      </h3>
      <div className={"bg-black bg-opacity-20 mx-auto py-1 shadow-2xl"}>
        <p className={"mb-6 max-w-[70ch] mx-auto"}>{strings.html_paragraph1}</p>
        <p className={"mb-6 max-w-[70ch] mx-auto"}>{strings.html_paragraph2}</p>
      </div>
      <Link href={"/about"} passHref={true}>
        <a
          className={
            "text-2xl underline inline-block mt-2 italic hover:text-blue-300"
          }
        >
          {strings.html_aboutButton}
        </a>
      </Link>
    </section>
  );
};

export default AboutSection;
