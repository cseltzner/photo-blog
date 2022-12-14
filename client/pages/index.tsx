import { useEffect, useState } from "react";
import CarouselSection from "../components/sections/home/CarouselSection";
import Metadata from "../components/meta/Metadata";
import AboutSection from "../components/sections/home/AboutSection";
import RecentFavoritesSection from "../components/sections/home/RecentFavoritesSection";
import Alert from "../components/alert/Alert";
import { useAlertContext } from "../hooks/useAlertContext";
import { apiProxy } from "../utils/apiProxy";
import { transformLink } from "../utils/transformLink";
import { indexStrings as strings } from "../strings/pages/indexStrings";

export default function Home() {
  const [carouselLoading, setCarouselLoading] = useState(true);
  const { alert, setAlert } = useAlertContext();

  const [carouselImages, setCarouselImages] = useState<Array<string>>([]);

  // Get carousel images
  useEffect(() => {
    const queryImages = async () => {
      setCarouselLoading(true);
      try {
        const res = await fetch(apiProxy.concat("/photos?front_page=true"), {
          method: "GET",
        });
        if (res.status !== 200) {
          setAlert({
            type: "error",
            title: "error",
            messages: [strings.alert_serverError],
          });
        }

        const images: Array<any> = await res.json();
        if (images.length < 1) {
          setAlert({
            type: "error",
            title: "error",
            messages: [strings.alert_noImagesFound],
          });
          return;
        }

        const imageUrls = images.map((image) => {
          // Resize and return image urls
          return transformLink(image.img_url, 1280, 720);
        });

        setCarouselImages(imageUrls);
        setCarouselLoading(false);
      } catch (err) {
        setAlert({
          type: "error",
          title: "error",
          messages: [strings.alert_networkError],
        });
        setCarouselLoading(false);
      }
    };
    queryImages();
  }, []);

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
          images={carouselImages}
        />
        {/* About section */}
        <AboutSection />
        {/* Recent favorites section */}
        <RecentFavoritesSection />
      </div>
    </>
  );
}
