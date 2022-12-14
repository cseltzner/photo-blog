import React, { useEffect, useState } from "react";
import { categories } from "../../resources/links";
import { useRouter } from "next/router";
import { useAlertContext } from "../../hooks/useAlertContext";
import { apiProxy } from "../../utils/apiProxy";
import Spinner from "../spinner/Spinner";
import { uploadImageStrings as strings } from "../../strings/components/admin/uploadImageStrings";

const UploadImage = () => {
  const [file, setFile] = useState<File>(null);
  const [fileValidity, setFileValidity] = useState(true);
  const [categoriesChecked, setCategoriesChecked] = useState<number[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFront, setIsFront] = useState(false);
  const [title, setTitle] = useState("");
  const [titleValidity, setTitleValidity] = useState(true);
  const [description, setDescription] = useState("");
  const [descriptionValidity, setDescriptionValidity] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filesUploaded, setFilesUploaded] = useState<Array<string>>([]);

  const { setAlert } = useAlertContext();
  const router = useRouter();

  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Max filesize ~10mb
    if (e.target.files[0] && e.target.files[0].size > strings.maxFileSize) {
      setFileValidity(false);
      return;
    }
    setFile(e.target.files[0]);
    setFileValidity(true);
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

  const clearInputs = () => {
    setFile(null);
    setFileValidity(true);
    setCategoriesChecked([]);
    setIsFavorite(false);
    setIsFront(false);
    setTitle("");
    setTitleValidity(true);
    setDescription("");
    setDescriptionValidity(true);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    const categoryArray: Array<string> = [];
    categoriesChecked.forEach((categoryChecked) => {
      categoryArray.push(categories[categoryChecked].toLowerCase());
    });
    formData.append("categories", JSON.stringify(categoryArray));

    formData.append("favorite", JSON.stringify(isFavorite));
    formData.append("front_page", JSON.stringify(isFront));
    formData.append("title", title);
    formData.append("description", description);

    try {
      const res = await fetch(apiProxy.concat("/photo"), {
        method: "POST",
        headers: {
          // "Content-Type": "multipart/form-data",
          Authorization: localStorage.getItem("token"),
        },
        body: formData,
      });

      // Handle fail status codes
      if (res.status === 400) {
        setAlert({
          type: "error",
          title: "error",
          messages: [strings.alert_badRequest],
        });
        setLoading(false);
        return;
      }

      if (res.status === 500) {
        setAlert({
          type: "error",
          title: "error",
          messages: [strings.alert_serverError],
        });
        setLoading(false);
        return;
      }

      // If successful upload
      if (res.status === 200) {
        setAlert({
          type: "success",
          title: strings.alert_photoUploadTitle,
          messages: [strings.alert_photoUpload],
        });
        clearInputs();
        const { url } = await res.json();
        setFilesUploaded((prev) => [...prev, url]);
        setLoading(false);
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

  // Redirect when unauthenticated
  useEffect(() => {
    /**
     * To check if user is logged in, I am checking if there is a
     * token in localstorage. Using the AuthContext will always
     * have a default "loading" state of false and a "loggedIn"
     * state of false, which will immediately redirect the user.
     * For now, I will assume if the user has a token they will
     * be logged in and I will let my backend deal with any
     * invalid tokens
     */
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      setAlert({
        type: "error",
        title: "error",
        messages: [strings.alert_unauthorized],
      });
    }
  }, []);

  return (
    <>
      <div className="container mx-auto px-4 select-none text-xl flex flex-col items-center pt-8 pb-24 text-center">
        <div>
          <svg
            role="presentation"
            aria-label={strings.html_imgLabel}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-24 h-24 opacity-90"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
            />
          </svg>
        </div>
        <h1 className="mt-4 text-3xl font-extrabold text-gray-900">
          {strings.html_mainHeader}
        </h1>
        <form className="mt-12" onSubmit={(e) => onSubmit(e)}>
          <label
            htmlFor="file-upload"
            className="mb-8 flex flex-col items-center mx-auto inline-block cursor-pointer py-8 md:py-12 border border-zinc-800 rounded shadow-sm hover:bg-zinc-50 hover:shadow active:shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            <p>{strings.html_uploadHint}</p>
          </label>
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            id="file-upload"
            className="hidden"
            onChange={(e) => {
              onFileSelected(e);
            }}
          />
          <p className={`mb-4 self-start ${!fileValidity && "text-red-600"}`}>
            {file && fileValidity && `File - ${file.name}`}
            {!file && strings.html_noFileError}
            {!fileValidity && strings.html_fileSizeTooLargeError}
          </p>
          {/* Categories */}
          <div>
            <h3 className={"text-start text-2xl"}>
              {strings.html_categoriesHeader}
            </h3>
            <ul className={"flex flex-wrap justify-center gap-4 mt-4"}>
              {categories.map((category, index) => {
                return (
                  <li key={category}>
                    <input
                      type="checkbox"
                      data-testid={strings.html_categoriesListItemTestId}
                      name={category}
                      id={category}
                      checked={categoriesChecked.includes(index)}
                      className={"hidden"}
                      onChange={(e) => onCheckChange(e, index)}
                    />
                    <label
                      htmlFor={category}
                      data-testid={strings.html_categoriesLabelTestId}
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
          <div className="flex justify-around mt-6 md:mt-16">
            {/* Favorite button */}
            <input
              type="checkbox"
              id={"Favorite"}
              className={"hidden"}
              checked={isFavorite}
              onChange={(e) => onFavoriteChange(e)}
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
              checked={isFront}
              onChange={(e) =>
                e.target.checked ? setIsFront(true) : setIsFront(false)
              }
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
          <div className={"mt-6 md:mt-12"}>
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
                role="alert"
                className={`${
                  titleValidity ? "opacity-0 h-0" : "opacity-1 h-full"
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
                role="alert"
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
              "block relative w-full transition mt-8 py-5 rounded-lg bg-blue-600 text-white shadow-sm cursor-pointer hover:shadow active:shadow-sm disabled:bg-zinc-300 disabled:opacity-80 disabled:cursor-not-allowed"
            }
            disabled={
              loading ||
              !file ||
              !fileValidity ||
              !titleValidity ||
              !descriptionValidity
            }
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

        {/*  Files uploaded this session  */}
        {filesUploaded.length > 0 && (
          <div className={"mt-8"}>
            <h3 className={"text-2xl mt-4 pt-8 border-t-2"}>
              {strings.html_filesUploadedText}
            </h3>
            <ul>
              {filesUploaded.map((url) => {
                return (
                  <li
                    key={url}
                    className={"mt-8 text-blue-800 hover:underline"}
                    data-testid={strings.html_sessionUploadLiTestId}
                  >
                    <a href={url} target={"_blank"} rel="noreferrer">
                      {url}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default UploadImage;
