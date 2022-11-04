import React from "react";
import bgImage from "../../../assets/home/leaf-compressed.jpg";
import Link from "next/link";

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
      <h3 className={"text-4xl lg:text-5xl mb-8 font-serif"}>Chase Seltzner</h3>
      <div className={"bg-black bg-opacity-20 mx-auto py-1 shadow-2xl"}>
        <p className={"mb-6 max-w-[70ch] mx-auto"}>
          I&apos;m Chase, an aspiring web developer and amateur photographer. I
          custom built this site using some of the most exciting new web
          frameworks today, including NextJS, TailwindCSS, and Express (okay,
          that one is not very new). All of the styling and animations on this
          site are custom-made by me with love.
        </p>
        <p className={"mb-6 max-w-[70ch] mx-auto"}>
          I primarily photograph nature and wildlife with my FujiFilm camera and
          a lovely 55-200mm lens. Photography is the perfect excuse to step
          outside and enjoy the fresh air. The vast majority of photos on this
          site are straight out of camera JPEGs with very minor tweaks to
          exposure and cropping.
        </p>
      </div>
      <Link href={"/about"} passHref={true}>
        <a
          className={
            "text-2xl underline inline-block mt-2 italic hover:text-blue-300"
          }
        >
          Read more about me
        </a>
      </Link>
    </section>
  );
};

export default AboutSection;
