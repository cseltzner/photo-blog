import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuthContext } from "../../hooks/useAuthContext";
import DeleteModal from "../modal/DeleteModal";
import { useAlertContext } from "../../hooks/useAlertContext";
import { apiProxy } from "../../utils/apiProxy";

interface Props {
  imgId: string;
  imageThumbnail: string;
  image: string;
  width: number;
}

const GalleryImage = ({ imgId, image, imageThumbnail, width }: Props) => {
  const router = useRouter();
  const auth = useAuthContext();
  const { setAlert } = useAlertContext();

  const thumbnailStyle = {
    width,
    height: "auto",
    animation: "fade-in-thumbnail 1s ease-out",
  };

  const fullImageStyle = {
    animation: "fade-in-full-image 120ms ease-out",
  };

  const [fullImageOpen, setFullImageOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const onDeleteModalOpen = () => {
    setDeleteModalOpen(true);
  };

  const onClickThumbnail = () => {
    setFullImageOpen(true);
  };

  const onRemoveFullImage = () => {
    setFullImageOpen(false);
  };

  // I should refactor this to be passed in as a prop.
  // This is a low priority for now though
  const onDelete = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch(apiProxy.concat(`/photo/${imgId}`), {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      // If delete fails
      if (res.status !== 200) {
        setAlert({
          type: "error",
          title: "error",
          messages: [
            "An error occurred while deleting the photo. Please refresh and try again",
          ],
        });
        setDeleteModalOpen(false);
        setDeleteLoading(false);
        return;
      }

      setAlert({
        type: "success",
        title: "error",
        messages: ["Photo succesfully deleted!"],
      });
      setDeleteModalOpen(false);
      setDeleteLoading(false);
      setFullImageOpen(false);
      router.reload();
    } catch (err) {
      setAlert({
        type: "error",
        title: "error",
        messages: [
          "There was an error fetching the photo data. Please try again",
        ],
      });
      setDeleteModalOpen(false);
      setDeleteLoading(false);
      setFullImageOpen(false);
    }
  };

  // Document changes when full image is open
  useEffect(() => {
    if (fullImageOpen) {
      // Disable scrolling when full image is shown
      document.body.style.overflow = "hidden";
      // Set Esc key to minimize full image
      window.addEventListener("keydown", (e) => {
        if (e.key === "Esc" || e.key === "Escape") {
          onRemoveFullImage();
        }
      });
    } else {
      document.body.style.overflow = "visible";
      window.removeEventListener("keydown", (e) => {
        if (e.key === "Esc" || e.key === "Escape") {
          onRemoveFullImage();
        }
      });
    }
    return () => {
      document.body.style.overflow = "visible";
      window.removeEventListener("keydown", (e) => {
        if (e.key === "Esc" || e.key === "Escape") {
          onRemoveFullImage();
        }
      });
    };
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
                "fixed inset-0 h-screen w-screen bg-zinc-900 opacity-90 z-20"
              }
              onClick={() => onRemoveFullImage()}
            ></div>
            {/* Image positioned in middle of screen */}
            <div
              className={`min-w-[85vw] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-zinc-800 shadow-2xl z-30`}
            >
              <img src={image} alt="full" loading={"lazy"} />
              {/* Admin controls */}
              {auth.isLoggedIn && (
                <div className={"flex justify-around"}>
                  {/* Edit button */}
                  <button
                    className={
                      "text-white opacity-90 p-2 m-2 rounded-full hover:bg-zinc-700"
                    }
                    onClick={() => {
                      router.push(`/admin/edit/${imgId}`);
                    }}
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
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                  </button>
                  {/* Delete button */}
                  <button
                    className={
                      "text-red-400 opacity-90 p-2 m-2 rounded-full hover:bg-red-900"
                    }
                    onClick={() => onDeleteModalOpen()}
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
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            {/* Close button */}
            <div
              className="fixed top-12 z-30 right-12 cursor-pointer rounded-full p-2 text-white opacity-90 transition-all hover:bg-zinc-600"
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
          <DeleteModal
            onConfirm={() => onDelete()}
            onCancel={() => setDeleteModalOpen(false)}
            isOpen={deleteModalOpen}
            loading={deleteLoading}
            title={"Delete photo?"}
            body={"Are you sure you want to delete this photo?"}
          />
        </>
      )}
    </>
  );
};

export default GalleryImage;
