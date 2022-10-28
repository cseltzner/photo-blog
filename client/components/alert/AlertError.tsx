import React from "react";

interface Props {
  messages: string[];
  onClose: () => void;
}

const AlertError = ({ messages, onClose }: Props) => {
  return (
    <>
      <div className="relative mx-auto text-lg flex w-10/12 flex-col rounded-lg bg-red-50 p-4 shadow-lg opacity-[.95]">
        <div className="absolute top-0 bottom-0 left-0 w-1 rounded-tl rounded-bl bg-red-600"></div>
        <div className="flex items-start gap-6">
          <div className="w-4 text-red-600" id="alert-close">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <h4 className="mb-1 font-bold text-red-900">
              {/* There was an error with your submission */}
              {/* Or */}
              {/* There were 2 errors with your submission */}
              There {messages.length === 1 ? "was an" : "were"}{" "}
              {messages.length !== 1 && messages.length}{" "}
              {messages.length === 1 ? "error" : "errors"} with your submission
            </h4>
            <ul className="list-disc text-red-800">
              {messages.map((message, index) => {
                return (
                  <li key={index} className={"ml-8"}>
                    {message}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        {/* Close icon */}
        <div
          className={
            "absolute right-4 top-4 p-2 text-red-800 rounded-full cursor-pointer hover:bg-red-100"
          }
          onClick={() => onClose()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
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
  );
};

export default AlertError;
