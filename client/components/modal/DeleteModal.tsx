import React from "react";
import Spinner from "../spinner/Spinner";

interface Props {
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
  loading: boolean;
  title: string;
  body: string;
}

const DeleteModal = (props: Props) => {
  return (
    <>
      {/* Modal backdrop */}
      <div
        className={`${
          props.isOpen ? "opacity-95" : "scale-0 opacity-0"
        } fixed inset-0 z-40 bg-gradient-to-tr from-gray-800 to-gray-900 transition-opacity duration-200`}
        id="modal-backdrop"
        onClick={() => props.onCancel()}
      />
      {/* Modal container */}
      <div
        className={`${
          props.isOpen ? "" : "scale-0 opacity-0"
        } fixed top-1/2 left-1/2 z-50 min-w-[80%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white pt-7 shadow-xl transition-all duration-200 sm:min-w-min`}
        id="modal"
      >
        {/* Modal content container */}
        <div className="flex flex-col items-center gap-4 px-8 sm:flex-row sm:items-start">
          {/* Modal icon */}
          <div className="rounded-full bg-red-200 p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          {/* Modal text */}
          <div className="flex flex-col items-center text-black sm:items-start">
            <h1 className="text-2xl text-opacity-90 font-bold">
              {props.title}
            </h1>
            <p className="mt-2 text-center text-lg opacity-90 sm:text-left">
              {props.body}
            </p>
          </div>
        </div>
        {/* Button container */}
        <div className="relative inset-x-0 bottom-0 mt-4 flex flex-col items-center gap-4 rounded-lg bg-gray-200 py-4 sm:flex-row-reverse sm:justify-start sm:px-8">
          <button
            className="relative flex w-11/12 shrink-0 cursor-pointer justify-center rounded bg-red-600 px-5 py-2 text-white shadow-sm hover:bg-red-700 hover:shadow-none active:opacity-100 active:shadow sm:w-fit"
            id="deactivate"
            onClick={() => props.onConfirm()}
          >
            {props.loading && <Spinner size={4} />}
            <p className={`${props.loading && "opacity-0"}`}>Delete</p>
          </button>
          <button
            className="flex w-11/12 shrink-0 cursor-pointer justify-center rounded border border-gray-400 bg-white px-4 py-2 text-gray-900 hover:bg-gray-100 hover:shadow-sm active:shadow-none sm:w-fit sm:px-3.5 sm:py-1.5"
            id="close-button"
            onClick={() => props.onCancel()}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default DeleteModal;
