import React, { useEffect, useState } from "react";
import TriplePhotoGallery from "../../triple-photo-gallery/TriplePhotoGallery";
import Link from "next/link";
import { apiProxy } from "../../../utils/apiProxy";
import { useAlertContext } from "../../../hooks/useAlertContext";
import { transformLink } from "../../../utils/transformLink";
import { recentFavoritesSectionStrings as strings } from "../../../strings/components/sections/recentFavoritesSectionStrings";

const RecentFavoritesSection = () => {
  const photoLimit = 3;
  const photoWidth = 450;
  const photoHeight = 254;

  const { setAlert } = useAlertContext();

  const [images, setImages] = useState([]);
  // Fetch recent favorite photos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          apiProxy.concat(`/photos/latestfavorite?limit=${photoLimit}`),
          {
            method: "GET",
          }
        );
        if (res.status !== 200) {
          setAlert({
            type: "error",
            title: "error",
            messages: [strings.alert_networkError],
          });
          return;
        }
        const photos = await res.json();
        photos.forEach((photo) => {
          if (photo.img_url) {
            photo.img_url = transformLink(
              photo.img_url,
              photoWidth,
              photoHeight
            );
          }
        });
        setImages(photos);
      } catch (err) {}
    };
    fetchData();
  }, []);

  return (
    <section
      className={
        "container mx-auto px-4 flex flex-col items-center my-24 text-4xl"
      }
    >
      <h3 className={"font-serif mb-12 lg:text-5xl"}>
        <span className={"italic"}>{strings.html_mainHeaderSpan}</span>
        {strings.html_mainHeaderPostSpan}
      </h3>
      <TriplePhotoGallery images={images} />
      <Link href={"/favorites"} passHref={true}>
        <a
          className={
            "inline-block mt-4 lg:mt-16 px-4 py-3 text-xl border border-blue-500 text-blue-500 transition-all duration-300 hover:bg-blue-500 hover:text-white"
          }
        >
          {strings.html_favoritesLinkText}
        </a>
      </Link>
    </section>
  );
};

export default RecentFavoritesSection;
