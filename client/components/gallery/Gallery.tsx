import React, { useCallback, useEffect, useRef, useState } from "react";
import GalleryImage from "./GalleryImage";

interface Props {
  imgIds: string[];
  imgThumbnailUrls: string[];
  imgFullUrls: string[];
  imagesPerPage: number;
  imageWidth: number;
}

const Gallery = ({
  imgIds,
  imgThumbnailUrls,
  imgFullUrls,
  imagesPerPage,
  imageWidth,
}: Props) => {
  const [images, setImages] = useState<string[]>([]);
  const [curPage, setCurPage] = useState(0);
  const [noMoreToLoad, setNoMoreToLoad] = useState(false);
  const [loading, setLoading] = useState(false);

  const loader = useRef(null);

  const loadImages = useCallback(
    (page: number) => {
      setLoading(true);
      setImages((prevState) => {
        let newArr = [...prevState];
        for (
          let i = page * imagesPerPage;
          i < page * imagesPerPage + imagesPerPage;
          i++
        ) {
          if (imgThumbnailUrls[i]) {
            newArr.push(imgThumbnailUrls[i]);
          }
        }
        setLoading(false);
        return newArr;
      });
    },
    [imgThumbnailUrls]
  );

  const onLoadHandler = () => {
    if (imgThumbnailUrls[curPage * imagesPerPage]) {
      setCurPage((prevState) => {
        loadImages(prevState + 1);
        return prevState + 1;
      });
    }
  };

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting) {
        onLoadHandler();
      }
    },
    [imgThumbnailUrls]
  );

  // Initial image load
  useEffect(() => {
    loadImages(0);
  }, [imgThumbnailUrls]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };
    const observer = new IntersectionObserver(handleObserver, options);
    if (loader.current) {
      observer.observe(loader.current);
    }
  }, [imgThumbnailUrls]);

  return (
    <>
      <div className={"flex gap-2 relative flex-wrap justify-center"}>
        {images.map((img, index) => {
          return (
            <GalleryImage
              key={img}
              imgId={imgIds[index]}
              imageThumbnail={imgThumbnailUrls[index]}
              image={imgFullUrls[index]}
              width={imageWidth}
            />
          );
        })}
        <div ref={loader} className={"absolute bottom-8"}></div>
      </div>
      <div>{noMoreToLoad && "No more to load"}</div>
    </>
  );
};

export default Gallery;
