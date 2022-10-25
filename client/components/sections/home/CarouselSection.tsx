import React from "react";
import Carousel from "../../carousel/Carousel";
import Spinner from "../../spinner/Spinner";

interface Props {
  carouselLoading: boolean;
  images: string[];
}

const CarouselSection = ({ carouselLoading, images }: Props) => {
  return (
    <section className={"relative"}>
      <div
        className={`transition-all duration-700 ${
          carouselLoading ? "opacity-0" : "opacity-1"
        }`}
      >
        <Carousel imgUrls={images} />
      </div>
      {carouselLoading && (
        <Spinner top={"50%"} left={"50%"} transform={"translate(-50%, -50%)"} />
      )}
    </section>
  );
};

export default CarouselSection;
