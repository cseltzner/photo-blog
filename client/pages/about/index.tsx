import React from "react";
import mojoImage from "../../assets/contact/mojo.jpg";
import butterflyImage from "../../assets/contact/butterfly.jpg";
import Link from "next/link";

const AboutPage = () => {
  return (
    <>
      <main
        className={
          "container mx-auto px-4 mt-4 mb-24 flex flex-col items-center"
        }
      >
        {/* Intro */}
        <h1 className={"text-3xl lg:text-4xl font-serif"}>About Chase</h1>
        <p className={"text-lg lg:text-xl mt-4 lg:mt-6 max-w-[60ch]"}>
          Hi, I&apos;m Chase Seltzner, an aspiring web developer and amateur
          photographer. I received my Bachelor&apos;s of Science in Biology and
          Economics at the University of Wisconsin, Madison, and my love of
          learning an endless amount of new ideas eventually led me into the
          field of web development. My love of nature led me to pick up my first
          real camera in early 2022, and I have not stopped snapping since.
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
        <p className={"mt-4 lg:mt-6 max-w-[60ch] text-lg lg:text-xl"}>
          All of the photographs on my site were taken with my one and only
          FujiFilm X-T30 II. Most the images were taken using a Fuji 55-200mm,
          18-55mm, or the lovely 27mm. I shoot almost exclusively in JPEG with
          the Astia film simulation, and perform very minor edits to exposure
          and contrast in Lightroom or Darktable. As a newer photographer I
          prefer the experience of getting the shot right in camera and
          minimizing the amount of post-processing needed, which is why FujiFilm
          is the perfect fit for me.
        </p>
        {/* For the developers */}
        <h2 className={"mt-24 font-serif text-3xl"}>For the developers</h2>
        <p className={"mt-4 lg:mt-6 max-w-[60ch] text-lg lg:text-xl"}>
          I wanted to create this site to get more experience with the fullstack
          development process, and the related technologies. My goal for this
          site was to get more experience with the Postgres, Express,
          React/NextJS, and TailwindCSS stack. I am also using Cloudinary as a
          CDN for my uploaded photos. Beyond those frameworks, my philosophy
          with this site was to use as few non-security related libraries as
          possible, which means that all of the styling and animation on this
          site is custom, as well as the basic server and client side logic.
          <br />
          <br />
          This site&apos;s design was inspired from various photographer&apos;s
          sites as well as some very clean WordPress sites, but ultimately all
          styling was custom created by me with TailwindCSS. I want to credit
          Heroicons for their wonderful free icons, and all of the animals who
          stood still while I was taking photos of them.
        </p>
        <Link href={"/contact"} passHref={true}>
          <a
            className={
              "inline-block mt-8 lg:mt-16 px-4 py-3 text-xl border border-blue-500 text-blue-500 transition-all duration-300 hover:bg-blue-500 hover:text-white"
            }
          >
            How to contact me
          </a>
        </Link>
      </main>
    </>
  );
};

export default AboutPage;
