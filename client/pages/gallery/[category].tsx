import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { categories } from "../../resources/links";
import Alert from "../../components/alert/Alert";
import { useAlertContext } from "../../hooks/useAlertContext";
import Gallery from "../../components/gallery/Gallery";
import { apiProxy } from "../../utils/apiProxy";
import { transformLink } from "../../utils/transformLink";

const GalleryPage = () => {
  const imageWidth = 750;
  const imagesPerPage = 5;

  const [imgThumbnails, setImgThumbnails] = useState<Array<string>>([]);
  const [imgFull, setImgFull] = useState<Array<string>>([]);

  const router = useRouter();
  let category = (router.query.category as string) || "all";
  if (!categories.filter((cat) => cat.toLowerCase() === category)) {
    category = "all";
  }

  const { alert, setAlert } = useAlertContext();

  // Load gallery urls from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          apiProxy.concat(`/photos?category=${category}`),
          {
            method: "GET",
          }
        );
        const photos = await res.json();

        // Get all imageThumbnail urls
        const thumbnailUrls = photos.map((photo) =>
          transformLink(photo.img_url, imageWidth)
        );
        setImgThumbnails(thumbnailUrls);

        // Get all fullImage urls
        const fullUrls = photos.map((photo) => photo.img_url);
        setImgFull(fullUrls);
      } catch (err) {
        setAlert({
          type: "error",
          title: "error",
          messages: [
            "Connection error. Please check your internet and refresh",
          ],
        });
      }
    };
    fetchData();
  }, [router.query.category]);

  return (
    <div className={"container mx-auto px-2"}>
      <Alert
        title={alert?.title}
        type={alert?.type}
        messages={alert?.messages}
      />

      <h1
        className={"block border-b border-zinc-500 mb-12 mx-12 px-2 text-3xl"}
      >
        {category[0].toUpperCase() + category.substring(1)} Photos
      </h1>

      <Gallery
        imgThumbnailUrls={imgThumbnails}
        imgFullUrls={imgFull}
        imagesPerPage={imagesPerPage}
        imageWidth={imageWidth}
      />
      <div className={"mt-24"}></div>
    </div>
  );
};

export default GalleryPage;
