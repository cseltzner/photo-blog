import Head from "next/head";
import { useEffect, useState } from "react";
import { fetchTemplatePhotos } from "../utils/fetchTemplatePhotos";
import CarouselSection from "../components/sections/home/CarouselSection";

export default function Home() {
  const [carouselLoading, setCarouselLoading] = useState(true);

  // Remove this test image state when actual images are fetched
  const [testImages, setTestImages] = useState<any>();
  useEffect(() => {
    const fetchPhotos = async () => {
      const data = await fetchTemplatePhotos(20);
      const photos: Array<string> = [];
      data.forEach((img) => photos.push(img.url));
      setTestImages(photos);
    };
    fetchPhotos()
      .then(() => setCarouselLoading(false))
      .catch(console.error);
  }, []);
  // End test images

  return (
    <>
      <div>
        <Head>
          <title>Create Next App</title>
          <meta name="author" content="Chase Seltzner" />
          <meta
            name="description"
            content="Chase's personal photography blog"
          />
          <meta
            name="keywords"
            content="photography, blog, photographs, photo, picture"
          />
          <link rel="icon" href="/favicon.png" />
        </Head>

        {/* Carousel section */}
        <CarouselSection
          carouselLoading={carouselLoading}
          images={testImages}
        />
      </div>
    </>
  );
}
