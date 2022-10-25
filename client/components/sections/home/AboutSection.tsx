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
        "py-24 px-12 mt-24 bg-cover text-white text-center text-xl leading-8"
      }
    >
      <h3 className={"text-5xl mb-8"}>Chase Seltzner</h3>
      <p className={"mb-6"}>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi harum
        ipsa maiores mollitia pariatur perferendis quo rem voluptates
        voluptatibus. Aliquam assumenda beatae consequatur deleniti, distinctio
        dolor ducimus eos exercitationem itaque minima neque nisi odit provident
        quas ratione rem totam voluptatem.
      </p>
      <p className={"mb-6"}>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda
        corporis excepturi harum minus neque nobis officiis reiciendis
        similique! A ab alias aliquid atque cupiditate excepturi non odit porro
        voluptas voluptatum.
      </p>
      <Link href={"/about"} passHref={true}>
        <a className={"text-2xl underline italic"}>Read more about me</a>
      </Link>
    </section>
  );
};

export default AboutSection;
