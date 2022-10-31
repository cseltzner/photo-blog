import React, { useEffect, useState } from "react";

interface Props {
  imageThumbnail: string;
  image: string;
  width: number;
}

const GalleryImage = ({ image, imageThumbnail, width }: Props) => {
  const thumbnailStyle = {
    width,
    height: "auto",
    animation: "fade-in-thumbnail 1s ease-out",
  };

  const fullImageStyle = {
    animation: "fade-in-full-image 120ms ease-out",
  };

  const [fullImageOpen, setFullImageOpen] = useState(false);

  const onClickThumbnail = () => {
    setFullImageOpen(true);
  };

  const onRemoveFullImage = () => {
    setFullImageOpen(false);
  };

  // Document changes when full image is open
  useEffect(() => {
    if (fullImageOpen) {
      // Disable scrolling when full image is shown
      document.body.style.overflow = "hidden";
      // Set Esc key to minimize full image
      window.addEventListener("keydown", () => {
        onRemoveFullImage();
      });
    } else {
      document.body.style.overflow = "visible";
      window.removeEventListener("keydown", () => {
        onRemoveFullImage();
      });
    }
  }, [fullImageOpen]);

  return (
    <>
      {image && (
        <img
          className={
            "cursor-pointer border border-zinc-900 shadow transition-all hover:scale-[101%] hover:shadow-lg"
          }
          style={thumbnailStyle}
          src={imageThumbnail}
          alt={"Gallery item"}
          onClick={() => onClickThumbnail()}
        />
      )}
      {fullImageOpen && (
        <>
          <div style={fullImageStyle}>
            {/* Backdrop */}
            <div
              className={
                "fixed inset-0 h-screen w-screen bg-zinc-900 opacity-90 z-40"
              }
              onClick={() => onRemoveFullImage()}
            ></div>
            {/* Image positioned in middle of screen */}
            <div
              className={`min-w-[85vw] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-zinc-800 shadow-2xl z-50`}
            >
              <img src={image} alt="full" />
            </div>
            {/* Close button */}
            <div
              className="fixed top-12 right-12 cursor-pointer rounded-full p-2 text-white opacity-90 transition-all hover:bg-zinc-600"
              onClick={() => {
                onRemoveFullImage();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default GalleryImage;
