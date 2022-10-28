import Head from "next/head";
import { useEffect, useState } from "react";
import { fetchTemplatePhotos } from "../utils/fetchTemplatePhotos";
import CarouselSection from "../components/sections/home/CarouselSection";
import Metadata from "../components/meta/Metadata";
import AboutSection from "../components/sections/home/AboutSection";
import RecentFavoritesSection from "../components/sections/home/RecentFavoritesSection";
import Alert from "../components/alert/Alert";
import { useAlertContext } from "../hooks/useAlertContext";

export default function Home() {
  const [carouselLoading, setCarouselLoading] = useState(true);
  const { alert, setAlert, removeAlert } = useAlertContext();

  // Remove this test image state when actual images are fetched
  const [testImages, setTestImages] = useState<any>();
  useEffect(() => {
    const fetchPhotos = async () => {
      const data = await fetchTemplatePhotos(10);
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
        <Alert
          title={alert?.title}
          type={alert?.type}
          messages={alert?.messages}
        />
        {/* Head metadata */}
        <Metadata />

        {/* Carousel section */}
        <CarouselSection
          carouselLoading={carouselLoading}
          images={testImages}
        />
        {/* About section */}
        <AboutSection />
        {/* Recent favorites section */}
        <RecentFavoritesSection />
      </div>
    </>
  );
}
