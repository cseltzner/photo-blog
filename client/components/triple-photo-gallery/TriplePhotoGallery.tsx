import React from "react";
import moment from "moment";
import { recentFavoritesSectionStrings as strings } from "../../strings/components/sections/recentFavoritesSectionStrings";

interface Props {
  images?: {
    id: string;
    img_url: string;
    date_added: string;
    title: string;
  }[];
}

const TriplePhotoGallery = ({ images }: Props) => {
  return (
    <div className={"flex gap-4 sm:gap-8 text-center px-2"}>
      {/* Item 1 */}
      <a href={`/favorites/${images[0] && images[0].id}`} className={"group"}>
        <div className="flex flex-col items-center cursor-pointer">
          <img src={images[0] && images[0].img_url} alt={strings.html_imgAlt} />
          <p className={"text-sm sm:text-lg mt-3 opacity-70"}>
            {moment(images[0] && images[0].date_added).format("MMMM DD YYYY")}
          </p>
          <h4
            className={
              "font-serif text-xl sm:text-3xl mt-1 group-hover:underline"
            }
          >
            {images[0] && images[0].title}
          </h4>
        </div>
      </a>
      {/* Item 2 */}
      <a href={`/favorites/${images[1] && images[1].id}`} className={"group"}>
        <div className="flex flex-col items-center cursor-pointer">
          <img src={images[1] && images[1].img_url} alt={strings.html_imgAlt} />
          <p className={"text-sm sm:text-lg mt-3 opacity-70"}>
            {moment(images[1] && images[1].date_added).format("MMMM DD YYYY")}
          </p>
          <h4
            className={
              "font-serif text-xl sm:text-3xl mt-1  group-hover:underline"
            }
          >
            {images[1] && images[1].title}
          </h4>
        </div>
      </a>
      {/* Item 3 */}
      <a href={`/favorites/${images[2] && images[2].id}`} className={"group"}>
        <div className="flex flex-col items-center cursor-pointer">
          <img src={images[2] && images[2].img_url} alt={strings.html_imgAlt} />
          <p className={"text-sm sm:text-lg mt-3 opacity-70"}>
            {moment(images[2] && images[2].date_added).format("MMMM DD YYYY")}
          </p>
          <h4
            className={
              "font-serif text-xl sm:text-3xl mt-1  group-hover:underline"
            }
          >
            {images[2] && images[2].title}
          </h4>
        </div>
      </a>
    </div>
  );
};

export default TriplePhotoGallery;
