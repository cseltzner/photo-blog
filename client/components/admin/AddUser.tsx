import React, { useState } from "react";
import Spinner from "../spinner/Spinner";
import { useAlertContext } from "../../hooks/useAlertContext";
import { apiProxy } from "../../utils/apiProxy";
import { useRouter } from "next/router";

const AddUser = () => {
  const [inputData, setInputData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [role, setRole] = useState("admin"); // "user" role not currently in use, it may be in use at a later date
  const [loading, setLoading] = useState(false);

  const { setAlert } = useAlertContext();
  const router = useRouter();

  // Restores inputs to default state (not currently used)
  const clearInputs = () => {
    setInputData({
      username: "",
      password: "",
      confirmPassword: "",
    });
  };

  // On submit handler
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (inputData.password !== inputData.confirmPassword) {
      setAlert({
        type: "error",
        title: "error",
        messages: ["Your passwords do not match!"],
      });
      return;
    }

    setLoading(true);

    const body = JSON.stringify({
      username: inputData.username,
      password: inputData.password,
      role: role,
    });

    try {
      const res = await fetch(apiProxy.concat("/user"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: body,
      });

      // Handle error status
      if (res.status === 401) {
        setAlert({
          type: "error",
          title: "error",
          messages: ["Unauthorized. Log in and try again"],
        });
        setLoading(false);
        return;
      }

      if (res.status === 409) {
        setAlert({
          type: "error",
          title: "error",
          messages: [
            `User with username '${inputData.username}' already exists`,
          ],
        });
        setLoading(false);
        return;
      }

      // Handle other errors (eg. server errors)
      if (res.status !== 200) {
        console.log(await res.json());
        setAlert({
          type: "error",
          title: "error",
          messages: ["An error occurred. Try again later"],
        });
        setLoading(false);
        return;
      }

      // Handle success
      setLoading(false);
      setAlert({
        type: "success",
        title: "User created",
        messages: ["User successfully created!"],
      });
      router.push("/");
    } catch (err) {
      setAlert({
        type: "error",
        title: "error",
        messages: [
          "Connection error. Please check your internet connection and try again",
        ],
      });
      setLoading(false);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

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
            className="w-24 h-24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
            />
          </svg>
        </div>
        <h1 className="mt-4 text-3xl font-extrabold text-gray-900">Add user</h1>
        <form className="w-full max-w-[500px]" onSubmit={(e) => onSubmit(e)}>
          {/* Username and password inputs */}
          <div className={"mt-12"}>
            {/* Username input */}
            <div className={"flex flex-col items-start"}>
              <label htmlFor="username" className="self-start text-2xl">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={inputData.username}
                onChange={(e) => onInputChange(e)}
                className="mt-2 block w-full rounded-md border border-zinc-400 py-3 px-4 invalid:border-red-600"
              />
            </div>
            <div className={"mt-8"}>
              {/* Password input */}
              <div className={"flex flex-col items-start"}>
                <label htmlFor="password" className="self-start text-2xl">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={inputData.password}
                  onChange={(e) => onInputChange(e)}
                  className="mt-2 block w-full rounded-md border border-zinc-400 py-3 px-4 invalid:border-red-600"
                />
              </div>
            </div>
            {/* Password confirmation input */}
            <div className={"flex flex-col items-start mt-8"}>
              <label htmlFor="confirmPassword" className="self-start text-2xl">
                Confirm password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={inputData.confirmPassword}
                onChange={(e) => onInputChange(e)}
                className="mt-2 block w-full rounded-md border border-zinc-400 py-3 px-4 invalid:border-red-600"
              />
            </div>
          </div>
          {/*  Submit button  */}
          <button
            type="submit"
            className={
              "block relative w-full transition py-5 mt-12 rounded-lg bg-blue-600 text-white shadow-sm cursor-pointer hover:shadow active:shadow-sm disabled:bg-zinc-300 disabled:opacity-80 disabled:cursor-not-allowed"
            }
            disabled={
              loading ||
              !inputData.username ||
              !inputData.password ||
              !inputData.confirmPassword
            }
          >
            {loading ? (
              <div className={"py-4"}>
                <Spinner size={12} />
              </div>
            ) : (
              "Add user"
            )}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddUser;
