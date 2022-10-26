import React, { useEffect, useState } from "react";
import CarouselItem from "./CarouselItem";

interface Props {
  imgUrls: string[];
  height?: number;
  autoScroll?: boolean;
  autoScrollTimeMs?: number;
}

const Carousel = ({ imgUrls, height, autoScroll, autoScrollTimeMs }: Props) => {
  const [itemIndex, setItemIndex] = useState(0);
  const [animateForward, setAnimateForward] = useState<boolean | null>(null);

  // Auto scroll effect
  useEffect(() => {
    if (autoScroll) {
      const interval = setInterval(() => {
        if (imgUrls) {
          shiftNext();
        }
      }, autoScrollTimeMs || 5000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [imgUrls, itemIndex]);

  const shiftPrev = () => {
    if (itemIndex === 0) {
      setItemIndex(imgUrls.length - 1);
    } else {
      setItemIndex((prevIndex) => prevIndex - 1);
    }
    setAnimateForward(false);
  };

  const shiftNext = () => {
    if (itemIndex === imgUrls.length - 1) {
      setItemIndex(0);
    } else {
      setItemIndex((prevIndex) => prevIndex + 1);
    }
    setAnimateForward(true);
  };

  return (
    <>
      <div
        style={{ height: `${height}px` ? height : "auto" }}
        className={"flex justify-center group relative w-full overflow-hidden"}
      >
        {imgUrls &&
          imgUrls.map((img, index) => {
            return (
              <>
                <CarouselItem
                  imageUrl={img}
                  show={index === itemIndex}
                  animateForward={animateForward}
                  key={index}
                />
              </>
            );
          })}

        {/* Carousel controls */}
        {/* Next button */}
        <div
          role={"button"}
          className={
            "absolute right-0 px-12 cursor-pointer active:bg-none opacity-50 group-hover:opacity-90 group-hover:scale-[115%] transition-all duration-300 ease-out flex items-center text-black h-full"
          }
          onClick={() => shiftNext()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </div>
        {/*  Prev button */}
        <div
          role={"button"}
          className={
            "absolute left-0 px-12 cursor-pointer flex opacity-50 group-hover:opacity-90 group-hover:scale-[115%] transition-all duration-300 ease-out items-center text-black h-full"
          }
          onClick={() => shiftPrev()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </div>
      </div>
    </>
  );
};

export default Carousel;
