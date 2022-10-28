import React, { useEffect, useState } from "react";
import { categories } from "../../resources/links";
import { useRouter } from "next/router";
import { useAlertContext } from "../../hooks/useAlertContext";

const UploadImage = () => {
  const [file, setFile] = useState<File>(null);
  const [categoriesChecked, setCategoriesChecked] = useState<number[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFront, setIsFront] = useState(false);
  const [title, setTitle] = useState("");
  const [titleValidity, setTitleValidity] = useState(true);
  const [description, setDescription] = useState("");
  const [descriptionValidity, setDescriptionValidity] = useState(true);

  const { setAlert } = useAlertContext();
  const router = useRouter();

  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files[0]);
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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //  Submit form
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
        messages: [
          "You must be logged in as an administrator to upload a photo!",
        ],
      });
    }
  }, []);

  return (
    <>
      <div className="container mx-auto select-none text-xl flex flex-col items-center pt-8 pb-24 text-center">
        <div>
          <svg
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
          Upload photo
        </h1>
        <form className="mt-12" onSubmit={(e) => onSubmit(e)}>
          <label
            htmlFor="file-upload"
            className="mb-8 flex flex-col items-center mx-auto inline-block cursor-pointer px-12 p-12 border border-zinc-800 rounded shadow-sm hover:bg-zinc-50 hover:shadow active:shadow-sm"
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
            <p>Upload</p>
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
          <p className="mb-4 self-start">
            {file ? `File - ${file.name}` : "No file selected..."}
          </p>
          {/* Categories */}
          <div>
            <h3 className={"text-start text-2xl"}>Categories</h3>
            <div className={"flex gap-4 mt-4"}>
              {categories.map((category, index) => {
                return (
                  <>
                    <input
                      key={category}
                      type="checkbox"
                      name={category}
                      id={category}
                      className={"hidden"}
                      onChange={(e) => onCheckChange(e, index)}
                    />
                    <label
                      htmlFor={category}
                      className={`${
                        categoriesChecked.includes(index)
                          ? "bg-blue-200 border-blue-300 hover:bg-blue-100"
                          : "hover:bg-zinc-100 border-zinc-400"
                      } text-base border  rounded-full px-4 py-2 transition`}
                    >
                      {category}
                    </label>
                  </>
                );
              })}
            </div>
          </div>
          {/* Favorite and Front Page checkboxes */}
          <div className="flex justify-around mt-16">
            {/* Favorite button */}
            <input
              type="checkbox"
              id={"Favorite"}
              className={"hidden"}
              onChange={(e) => onFavoriteChange(e)}
            />
            <label
              htmlFor={"Favorite"}
              className={`${
                isFavorite
                  ? "bg-blue-100 hover:bg-blue-50"
                  : "hover:bg-zinc-100"
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
              <p>Favorite</p>
            </label>
            {/* Front page button */}
            <input
              type="checkbox"
              id={"Front"}
              className={"hidden"}
              onChange={(e) =>
                e.target.checked ? setIsFront(true) : setIsFront(false)
              }
            />
            <label
              htmlFor={"Front"}
              className={`${
                isFront ? "bg-blue-100 hover:bg-blue-50" : "hover:bg-zinc-100"
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
              <p>Front page</p>
            </label>
          </div>
          {/* Title and description */}
          <div className={"mt-12"}>
            <div className={"flex flex-col items-start"}>
              <label htmlFor="title" className="self-start text-2xl">
                Title
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
                Favorite photos must have a title
              </small>
            </div>
            <div className={"flex flex-col items-start mt-6"}>
              <label htmlFor="description" className="self-start text-2xl">
                Description
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
                Favorite photos must have a description
              </small>
            </div>
          </div>
          {/*  Submit button  */}
          <button
            type="submit"
            className={
              "block w-full py-5 rounded-lg bg-blue-600 text-white shadow-sm cursor-pointer hover:shadow active:shadow-sm disabled:bg-zinc-300 disabled:opacity-80 disabled:cursor-not-allowed"
            }
            disabled={!file || !titleValidity || !descriptionValidity}
          >
            Add Photo
          </button>
        </form>
      </div>
    </>
  );
};

export default UploadImage;
