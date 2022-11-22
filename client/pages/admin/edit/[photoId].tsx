import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAlertContext } from "../../../hooks/useAlertContext";
import { apiProxy } from "../../../utils/apiProxy";
import { categories } from "../../../resources/links";
import Spinner from "../../../components/spinner/Spinner";
import Alert from "../../../components/alert/Alert";
import { editImageStrings as strings } from "../../../strings/components/admin/editImageStrings";

const EditPhotoPage = () => {
  const router = useRouter();
  const { alert, setAlert } = useAlertContext();

  const photoId = router.query.photoId;

  const [photoSrc, setPhotoSrc] = useState("");
  const [categoriesChecked, setCategoriesChecked] = useState<number[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFront, setIsFront] = useState(false);
  const [title, setTitle] = useState("");
  const [titleValidity, setTitleValidity] = useState(true);
  const [description, setDescription] = useState("");
  const [descriptionValidity, setDescriptionValidity] = useState(true);
  const [loading, setLoading] = useState(false);

  // If photo is a favorite, title and description must be present
  const onFavoriteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.checked ? setIsFavorite(true) : setIsFavorite(false);
    if (e.target.checked && !title) {
      setTitleValidity(false);
    }
    if (e.target.checked && !description) {
      setDescriptionValidity(false);
    }
    if (!e.target.checked) {
      setTitleValidity(true);
      setDescriptionValidity(true);
    }
  };

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (isFavorite && !e.target.value) {
      setTitleValidity(false);
    } else {
      setTitleValidity(true);
    }
  };

  const onDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    if (isFavorite && !e.target.value) {
      setDescriptionValidity(false);
    } else {
      setDescriptionValidity(true);
    }
  };

  const onCheckChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.target.checked) {
      setCategoriesChecked((prevState) => prevState.concat(index));
    } else {
      setCategoriesChecked((prevState) =>
        prevState.filter((el) => el !== index)
      );
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const categoryArray: Array<string> = [];
    categoriesChecked.forEach((categoryChecked) => {
      categoryArray.push(categories[categoryChecked].toLowerCase());
    });

    const body = JSON.stringify({
      title: title,
      description: description,
      favorite: isFavorite,
      front_page: isFront,
      categories: categoryArray,
    });

    try {
      const res = await fetch(apiProxy.concat(`/photo/${photoId}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: body,
      });

      if (res.status === 404) {
        setAlert({
          type: "error",
          title: "error",
          messages: [strings.alert_imgNotFound],
        });
        setLoading(false);
        return;
      }

      // If successful upload
      if (res.status === 200) {
        setAlert({
          type: "success",
          title: "Photo updated",
          messages: [strings.alert_success],
        });
        setLoading(false);
        router.push("/gallery");
        return;
      }

      throw new Error();
    } catch (err) {
      setAlert({
        type: "error",
        title: "error",
        messages: [strings.alert_networkError],
      });
      setLoading(false);
    }
  };

  // Update title
  useEffect(() => {
    document.title = strings.html_pageTitle;
  }, []);

  // Check for authentication
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setAlert({
        type: "error",
        title: "error",
        messages: [strings.alert_unauthorized],
      });
      router.push("/");
      return;
    }
  }, []);

  // Fetch metadata
  useEffect(() => {
    if (!router.query.photoId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(apiProxy.concat(`/photo/${photoId}`), {
          method: "GET",
        });

        setLoading(false);
        // If error
        if (res.status !== 200) {
          setAlert({
            type: "error",
            title: "error",
            messages: [strings.alert_miscError],
          });
          router.back();
          return;
        }

        // If success
        const photo = await res.json();
        setPhotoSrc(photo.img_url);
        setTitle(photo.title);
        setDescription(photo.description);
        setIsFavorite(photo.favorite);
        setIsFront(photo.front_page);
        setTitleValidity(true);
        setDescriptionValidity(true);
        categories.forEach((category, index) => {
          if (photo.categories.includes(category.toLowerCase())) {
            setCategoriesChecked((prevState) => [...prevState, index]);
          }
        });
      } catch (err) {
        setAlert({
          type: "error",
          title: "error",
          messages: [strings.alert_networkError],
        });
      }
    };

    fetchData();
  }, [router.query.photoId]);
  return (
    <>
      <Alert
        type={alert?.type}
        title={alert?.title}
        messages={alert?.messages}
      />
      <div className="container mx-auto select-none text-xl flex flex-col items-center pt-8 pb-24 text-center">
        <div>
          <img src={photoSrc} alt={strings.html_imgEditPhotoAlt} />
        </div>
        <h1 className="mt-4 text-3xl font-extrabold text-gray-900">
          {strings.html_mainHeader}
        </h1>
        <form className="mt-12" onSubmit={(e) => onSubmit(e)}>
          {/* Categories */}
          <div>
            <h3 className={"text-start text-2xl"}>
              {strings.html_categoriesHeader}
            </h3>
            <ul className={"flex gap-4 mt-4"}>
              {categories.map((category, index) => {
                return (
                  <li
                    key={category}
                    data-testid={strings.html_categoriesListItemTestId}
                  >
                    <input
                      type="checkbox"
                      name={category}
                      id={category}
                      data-testid={strings.html_categoriesCheckboxTestId}
                      className={"hidden"}
                      checked={categoriesChecked.includes(index)}
                      onChange={(e) => onCheckChange(e, index)}
                    />
                    <label
                      htmlFor={category}
                      className={`${
                        categoriesChecked.includes(index)
                          ? "bg-blue-300 border-blue-300 hover:bg-blue-200"
                          : "hover:bg-zinc-100 border-zinc-400"
                      } text-base border  rounded-full px-4 py-2 transition`}
                    >
                      {category}
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
          {/* Favorite and Front Page checkboxes */}
          <div className="flex justify-around mt-16">
            {/* Favorite button */}
            <input
              type="checkbox"
              id={"Favorite"}
              className={"hidden"}
              onChange={(e) => onFavoriteChange(e)}
              checked={isFavorite}
            />
            <label
              htmlFor={"Favorite"}
              className={`${
                isFavorite
                  ? "bg-blue-300 hover:bg-blue-200"
                  : "hover:bg-zinc-200"
              } flex flex-col items-center rounded-full transition p-7`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10 opacity-[.95]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
              <p>{strings.html_favoriteLabel}</p>
            </label>
            {/* Front page button */}
            <input
              type="checkbox"
              id={"Front"}
              className={"hidden"}
              onChange={(e) =>
                e.target.checked ? setIsFront(true) : setIsFront(false)
              }
              checked={isFront}
            />
            <label
              htmlFor={"Front"}
              className={`${
                isFront ? "bg-blue-300 hover:bg-blue-200" : "hover:bg-zinc-200"
              } flex flex-col items-center rounded-full transition p-7`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10 opacity-[.95]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
                />
              </svg>
              <p>{strings.html_frontPageLabel}</p>
            </label>
          </div>
          {/* Title and description */}
          <div className={"mt-12"}>
            <div className={"flex flex-col items-start"}>
              <label htmlFor="title" className="self-start text-2xl">
                {strings.html_titleLabel}
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => onTitleChange(e)}
                className="mt-2 block w-full rounded-md border border-zinc-400 py-3 px-4 invalid:border-red-600"
              />
              <small
                className={`${
                  titleValidity ? "opacity-0" : "opacity-1"
                } mt-1 ml-0.5 inline-block text-lg text-red-600 transition`}
              >
                {strings.html_invalidTitleError}
              </small>
            </div>
            <div className={"flex flex-col items-start mt-6"}>
              <label htmlFor="description" className="self-start text-2xl">
                {strings.html_descriptionLabel}
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => onDescriptionChange(e)}
                className="mt-2 block w-full min-h-[200px] rounded-md border border-zinc-400 py-3 px-4 invalid:border-red-600"
              />
              <small
                className={`${
                  descriptionValidity ? "opacity-0" : "opacity-1"
                } mt-1 ml-0.5 inline-block text-lg text-red-600 transition`}
              >
                {strings.html_invalidDescriptionError}
              </small>
            </div>
          </div>
          {/*  Submit button  */}
          <button
            type="submit"
            className={
              "block relative w-full transition py-5 rounded-lg bg-blue-600 text-white shadow-sm cursor-pointer hover:shadow active:shadow-sm disabled:bg-zinc-300 disabled:opacity-80 disabled:cursor-not-allowed"
            }
            data-testid={strings.html_submitButtonTestId}
            disabled={loading || !titleValidity || !descriptionValidity}
          >
            {loading ? (
              <div className={"py-4"}>
                <Spinner size={12} />
              </div>
            ) : (
              strings.html_submitButton
            )}
          </button>
        </form>
      </div>
    </>
  );
};

export default EditPhotoPage;
