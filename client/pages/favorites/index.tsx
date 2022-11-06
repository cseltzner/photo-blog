import React, { useEffect, useState } from "react";
import { apiProxy } from "../../utils/apiProxy";
import { useAlertContext } from "../../hooks/useAlertContext";
import Alert from "../../components/alert/Alert";
import Spinner from "../../components/spinner/Spinner";
import moment from "moment/moment";
import { transformLink } from "../../utils/transformLink";

const Index = () => {
  const { alert, setAlert } = useAlertContext();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(apiProxy.concat("/photos?favorite=true"));
        if (res.status !== 200) {
          throw new Error();
        }

        const photos = await res.json();
        photos.forEach((photo) => {
          photo.img_url = transformLink(photo.img_url, 400, 225);
        });

        setImages(photos);
        setLoading(false);
      } catch (err) {
        setAlert({
          type: "error",
          title: "error",
          messages: [
            "Failed to fetch photos. Check your internet connection and refresh the page",
          ],
        });
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className={"relative mb-12 container mx-auto"}>
      <Alert
        title={alert?.title}
        type={alert?.type}
        messages={alert?.messages}
      />
      {loading && <Spinner size={12} />}
      <h1 className={"font-serif border-b mb-8 text-3xl"}>
        Chase&apos;s Favorites
      </h1>
      <ul
        className={
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        }
      >
        {images.map((image) => {
          return (
            <li key={image.id}>
              <a href={`/favorites/${image.id}`} className={"group"}>
                <div className="flex flex-col items-center cursor-pointer">
                  <img src={image.img_url} alt="Favorite" loading={"lazy"} />
                  <p className={"text-sm sm:text-lg mt-3 opacity-70"}>
                    {moment(image.date_added).format("MMMM DD YYYY")}
                  </p>
                  <h4
                    className={
                      "font-serif text-xl sm:text-3xl group-hover:underline"
                    }
                  >
                    {image.title}
                  </h4>
                </div>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Index;
