import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAlertContext } from "../../hooks/useAlertContext";
import Alert from "../../components/alert/Alert";
import { apiProxy } from "../../utils/apiProxy";
import Custom404 from "../404";
import moment from "moment/moment";
import Spinner from "../../components/spinner/Spinner";
import Link from "next/link";

const SingleFavoritePage = () => {
  const { alert, setAlert } = useAlertContext();
  const router = useRouter();
  const { photoId } = router.query;

  const [is404, setIs404] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState({
    id: "",
    img_url: "",
    title: "",
    description: "",
    categories: [],
    date_added: "",
  });

  // Update title
  useEffect(() => {
    document.title = `${image.title} | Seltzport`;
  }, []);

  useEffect(() => {
    const fetchPhoto = async () => {
      if (!photoId) return; // Without this the page will flash a 404 for a moment because router.query is not instant

      setLoading(true);

      try {
        const res = await fetch(apiProxy.concat(`/photo/${photoId}`), {
          method: "GET",
        });

        // If photo not found throw 404
        if (res.status !== 200) {
          setIs404(true);
          setLoading(false);
          return;
        }

        // If photo found
        const photo = await res.json();
        console.log(photo);

        // If photo does not have a title or description throw 404
        if (!photo?.title || !photo?.description) {
          setIs404(true);
          setLoading(false);
          return;
        }
        setImage({
          id: photo.id,
          img_url: photo.img_url,
          title: photo.title,
          description: photo.description,
          date_added: photo.date_added,
          categories: photo.categories,
        });
        setIs404(false);
        setLoading(false);
      } catch (err) {
        setAlert({
          type: "error",
          title: "error",
          messages: [
            "There was an error fetching the photo data. Please check your connection and try again",
          ],
        });
        setLoading(false);
      }
    };
    fetchPhoto();
  }, [photoId]);
  return (
    <>
      <Alert
        type={alert?.type}
        title={alert?.title}
        messages={alert?.messages}
      />
      {is404 && <Custom404 />}
      <div
        className={`relative w-full transition scale-0 h-0 ${
          loading && "scale-100 min-h-[36rem]"
        }`}
      >
        <Spinner size={24} />
      </div>

      <main
        className={`container mx-auto flex flex-col items-center px-4 transition opacity-0 scale-0 ${
          !loading && !is404 && image.img_url && "opacity-100 scale-100"
        }`}
      >
        <h1 className={"text-5xl mb-2 font-serif"}>{image.title}</h1>
        <h3 className={"text-xl mb-8 font-serif"}>
          {image.date_added && moment(image.date_added).format("MMMM DD YYYY")}
        </h3>
        <div className={"flex gap-8 mb-8 flex-wrap justify-center"}>
          {image.categories.map((category) => {
            return (
              <Link
                key={category}
                href={"/gallery/" + category.toLowerCase()}
                passHref={true}
              >
                <a
                  className={
                    "px-8 py-2 inline-block rounded-full bg-zinc-300 capitalize hover:bg-zinc-200"
                  }
                >
                  {category}
                </a>
              </Link>
            );
          })}
        </div>
        <a href={image.img_url} target={"_blank"} rel="noreferrer">
          <img
            src={image.img_url}
            className={
              "mb-12 border border-zinc-400 shadow hover:shadow-xl transition hover:scale-[101%]"
            }
          />
        </a>
        <p className={"text-xl mb-12 max-w-[50ch] "}>{image.description}</p>
      </main>
    </>
  );
};

export default SingleFavoritePage;
