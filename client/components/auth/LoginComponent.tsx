import React, { FormEvent, useEffect, useState } from "react";
import logo from "../../assets/logo/sp-icon-only.svg";
import Image from "next/image";
import Link from "next/link";
import { apiProxy } from "../../utils/apiProxy";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useAlertContext } from "../../hooks/useAlertContext";
import { useRouter } from "next/router";

const LoginComponent = () => {
  const [authInput, setAuthInput] = useState({
    username: "",
    password: "",
  });
  const auth = useAuthContext();
  const { setAlert } = useAlertContext();
  const router = useRouter();

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthInput({ ...authInput, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!authInput.username && !authInput.password) {
      setAlert({
        type: "error",
        title: "error",
        messages: [
          "You must provide your username!",
          "You must provide your password!",
        ],
      });
      return;
    }

    if (!authInput.username) {
      setAlert({
        type: "error",
        title: "Username required",
        messages: ["You must provide your username!"],
      });
      return;
    }

    if (!authInput.password) {
      setAlert({
        type: "error",
        title: "Password required",
        messages: ["You must provide your password!"],
      });
      return;
    }

    auth.setLoading(true);

    try {
      const body = JSON.stringify({
        username: authInput.username,
        password: authInput.password,
      });

      const res = await fetch(apiProxy.concat("/user/auth"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });

      // Handle error statuses

      // Server error
      if (res.status === 500) {
        setAlert({
          type: "error",
          title: "Error",
          messages: ["Server error. Please try again later"],
        });
        return;
      }

      // Invalid request body
      if (res.status === 400) {
        setAlert({
          type: "error",
          title: "error",
          messages: ["Please include all required fields"],
        });
        return;
      }

      // Invalid password
      if (res.status === 401) {
        setAlert({
          type: "error",
          title: "error",
          messages: ["The password you provided is not correct"],
        });
        return;
      }

      // User not found
      if (res.status === 404) {
        setAlert({
          type: "error",
          title: "error",
          messages: ["The username provided does not exist"],
        });
        return;
      }

      // Handle success state
      const token = await res.json();
      localStorage.setItem("token", token.token);
      auth.setIsLoggedIn(true);
      auth.setLoading(false);
      router.push("/");
      setAlert({
        type: "success",
        title: "Signed in",
        messages: ["You are now signed in!"],
      });
    } catch (e) {
      console.error(e);
      localStorage.removeItem("token");
      auth.setIsLoggedIn(false);
      auth.setLoading(false);
      setAlert({
        type: "error",
        title: "Authentication error",
        messages: [
          "An error occurred. Please check your internet and try again",
        ],
      });
    }
  };

  return (
    <>
      <div className="container mx-auto select-none text-xl flex flex-col items-center pt-8 pb-24 text-center">
        <div>
          <Image src={logo} alt="SeltzPort" className="img block w-32" />
        </div>
        <p className="mt-4 text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </p>
        <p className="mt-1 text-gray-600">
          Or
          <Link href="/" passHref={true}>
            <a className="text-blue-600 hover:opacity-90"> return to home</a>
          </Link>
        </p>
        <form className="mt-12 flex flex-col" onSubmit={(e) => onSubmit(e)}>
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={authInput.username}
            onChange={(e) => {
              onInputChange(e);
            }}
            className="block rounded-md rounded-b-none border border-gray-400 py-3  px-4 placeholder-gray-500"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={authInput.password}
            onChange={(e) => {
              onInputChange(e);
            }}
            className="block rounded-md rounded-t-none border border-t-0 border-gray-400 py-3 px-4  placeholder-gray-500"
          />
          <div className="mt-8 flex flex-col md:gap-24 items-center justify-between md:flex-row">
            <div className="text-md flex gap-2 text-gray-800">
              <input
                type="checkbox"
                name="remember"
                id="remember"
                className="w-4"
              />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a
              href="#"
              className="mt-4 text-left text-blue-600 md:mt-0 hover:opacity-90"
            >
              Forgot your password?
            </a>
          </div>
          <input
            type="submit"
            value="Sign in"
            className="m-0 mt-8 block w-full cursor-pointer rounded-lg bg-blue-600 py-3 text-xl text-white shadow hover:opacity-95 hover:shadow-sm active:opacity-100 active:shadow-lg"
          />
        </form>
      </div>
    </>
  );
};

export default LoginComponent;
