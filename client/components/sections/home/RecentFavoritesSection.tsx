import React from "react";
import TriplePhotoGallery from "../../triple-photo-gallery/TriplePhotoGallery";
import Link from "next/link";

const RecentFavoritesSection = () => {
  // @todo Remove when real data is accessed
  const placeholderImages = [
    {
      id: "0",
      src: "https://via.placeholder.com/600/92c952",
      date: "2022-03-25",
      title: "Fake title",
    },
    {
      id: "1",
      src: "https://via.placeholder.com/600/771796",
      date: "2022-12-05",
      title: "Fake title again",
    },
    {
      id: "2",
      src: "https://via.placeholder.com/600/24f355",
      date: "2022-03-25",
      title: "This is the third image",
    },
  ];
  // End placeholder data

  return (
    <section
      className={"container mx-auto flex flex-col items-center my-24 text-4xl"}
    >
      <h3 className={"font-serif mb-8"}>
        <span className={"italic"}>The Latest</span> Favorites
      </h3>
      <TriplePhotoGallery images={placeholderImages} />
      <Link href={"/favorites"} passHref={true}>
        <a
          className={
            "inline-block mt-4 lg:mt-8 px-4 py-3 text-xl border border-blue-500 text-blue-500 transition-all duration-300 hover:bg-blue-500 hover:text-white"
          }
        >
          View the favorites
        </a>
      </Link>
    </section>
  );
};

export default RecentFavoritesSection;
