import React from "react";
import moment from "moment";

interface Props {
  images?: {
    id: string;
    src: string;
    date: string;
    title: string;
  }[];
}

const TriplePhotoGallery = ({ images }: Props) => {
  return (
    <div className={"flex gap-8 text-center"}>
      {/* Item 1 */}
      <a href={`/favorites/${images[0] && images[0].id}`}>
        <div className="flex flex-col items-center cursor-pointer">
          <img src={images[0] && images[0].src} alt="Recent favorite" />
          <p className={"text-lg mt-3 opacity-70"}>
            {moment(images[0] && images[0].date).format("MMMM DD YYYY")}
          </p>
          <h4 className={"font-serif text-3xl mt-1"}>
            {images[0] && images[0].title}
          </h4>
        </div>
      </a>
      {/* Item 2 */}
      <a href={`/favorites/${images[1] && images[1].id}`}>
        <div className="flex flex-col items-center cursor-pointer">
          <img src={images[1] && images[1].src} alt="Recent favorite" />
          <p className={"text-lg mt-3 opacity-70"}>
            {moment(images[1] && images[1].date).format("MMMM DD YYYY")}
          </p>
          <h4 className={"font-serif text-3xl mt-1"}>
            {images[1] && images[1].title}
          </h4>
        </div>
      </a>
      {/* Item 3 */}
      <a href={`/favorites/${images[2] && images[2].id}`}>
        <div className="flex flex-col items-center cursor-pointer">
          <img src={images[2] && images[2].src} alt="Recent favorite" />
          <p className={"text-lg mt-3 opacity-70"}>
            {moment(images[2] && images[2].date).format("MMMM DD YYYY")}
          </p>
          <h4 className={"font-serif text-3xl mt-1"}>
            {images[2] && images[2].title}
          </h4>
        </div>
      </a>
    </div>
  );
};

export default TriplePhotoGallery;
