import React from "react";

interface Props {
  title: string;
  messages: string[];
}

const AlertSuccess = ({ title, messages }: Props) => {
  return (
    <>
      <div className="relative mx-auto text-lg flex flex-col rounded-lg bg-green-50 p-4 shadow-lg opacity-[.95]">
        <div className="absolute top-0 bottom-0 left-0 w-1 rounded-tl rounded-bl bg-green-400"></div>
        <div className="flex items-start gap-6">
          <div className="mt-[2px] w-4 text-green-400" id="alert-close">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <h4 className="mb-1 font-bold text-green-800">{title}</h4>
            {messages.map((message, index) => {
              return (
                <p key={index} className={"text-green-700"}>
                  {message}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default AlertSuccess;