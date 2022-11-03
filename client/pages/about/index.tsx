import React from "react";
import mojoImage from "../../assets/contact/mojo.jpg";
import butterflyImage from "../../assets/contact/butterfly.jpg";

const AboutPage = () => {
  return (
    <>
      <main
        className={
          "container mx-auto px-1 mt-4 mb-24 flex flex-col items-center"
        }
      >
        {/* Intro */}
        <h1 className={"text-3xl lg:text-4xl font-serif"}>About Chase</h1>
        <p className={"text-lg mt-4 max-w-[60ch]"}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid
          deserunt dicta distinctio ea, eaque laboriosam modi nobis quae quam
          quisquam! Assumenda illo perspiciatis porro quaerat reiciendis
          repellat repellendus, sunt temporibus totam ut veniam vero vitae
          voluptate. Assumenda atque aut fuga itaque necessitatibus neque
          nesciunt non reprehenderit suscipit vero. Harum, iusto!
        </p>

        {/* Image section */}
        <div
          className={
            "flex justify-center mt-16 border-zinc-600 border shadow-lg transition hover:scale-[100.3%]"
          }
        >
          {/* Bottom Left image */}
          <div className={"inline-block relative"}>
            <img
              src={mojoImage.src}
              alt="Pomeranian walking toward the camera with the sun toward his back"
            />
            {/* Top Right image */}
            <div
              className={"absolute inset-0"}
              style={{
                clipPath: "polygon(0 0, 100% 0, 100% 100%)",
                objectFit: "fill",
              }}
            >
              <img
                src={butterflyImage.src}
                alt="Yellow and black butterfly surrounded by colorful flowers"
              />
            </div>
          </div>
        </div>

        {/* For the photographers */}
        <h2 className={"mt-24 font-serif text-3xl"}>For the photographers</h2>
        <p className={"mt-4 max-w-[60ch] text-lg"}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore odio
          quidem reiciendis! At corporis doloremque dolorum eaque eveniet magni
          maiores molestiae nulla provident quaerat reprehenderit tempora
          temporibus tenetur vel voluptates, voluptatibus voluptatum? Alias
          aliquam hic natus nesciunt quidem voluptate voluptatibus?
        </p>
        {/* For the developers */}
        <h2 className={"mt-24 font-serif text-3xl"}>For the developers</h2>
        <p className={"mt-4 max-w-[60ch] text-lg"}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Earum,
          itaque neque! Aperiam, ea incidunt ipsam laboriosam necessitatibus sed
          tempora voluptate.Lorem ipsum dolor sit amet, consectetur adipisicing
          elit. Earum, itaque neque! Aperiam, ea incidunt ipsam laboriosam
          necessitatibus sed tempora voluptate.
        </p>
      </main>
    </>
  );
};

export default AboutPage;
