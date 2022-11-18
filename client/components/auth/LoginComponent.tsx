import React, { FormEvent, useEffect, useState } from "react";
import logo from "../../assets/logo/sp-icon-only.svg";
import Image from "next/image";
import Link from "next/link";
import { apiProxy } from "../../utils/apiProxy";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useAlertContext } from "../../hooks/useAlertContext";
import { useRouter } from "next/router";
import { loginComponentStrings as strings } from "../../strings/components/auth/loginComponentStrings";

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

  // Sets fake login token
  const onDemoAdminClicked = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.setItem("token", strings.demoToken);
    auth.setIsLoggedIn(true);
    router.push("/");
    setAlert({
      type: "success",
      title: strings.alert_demoLoginSuccessTitle,
      messages: [strings.alert_demoSignIn],
    });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!authInput.username && !authInput.password) {
      setAlert({
        type: "error",
        title: "error",
        messages: [strings.alert_usernameNeeded, strings.alert_passwordNeeded],
      });
      return;
    }

    if (!authInput.username) {
      setAlert({
        type: "error",
        title: "error",
        messages: [strings.alert_usernameNeeded],
      });
      return;
    }

    if (!authInput.password) {
      setAlert({
        type: "error",
        title: "Password required",
        messages: [strings.alert_passwordNeeded],
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
          messages: [strings.alert_serverError],
        });
        return;
      }

      // Invalid request body
      if (res.status === 400) {
        setAlert({
          type: "error",
          title: "error",
          messages: [strings.alert_invalidBodyError],
        });
        return;
      }

      // Invalid password
      if (res.status === 401) {
        setAlert({
          type: "error",
          title: "error",
          messages: [strings.alert_invalidPasswordError],
        });
        return;
      }

      // User not found
      if (res.status === 404) {
        setAlert({
          type: "error",
          title: "error",
          messages: [strings.alert_invalidUsernameError],
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
        title: strings.alert_loginSuccessTitle,
        messages: [strings.alert_loginSuccess],
      });
    } catch (e) {
      console.error(e);
      localStorage.removeItem("token");
      auth.setIsLoggedIn(false);
      auth.setLoading(false);
      setAlert({
        type: "error",
        title: "Authentication error",
        messages: [strings.alert_authenticationError],
      });
    }
  };

  return (
    <>
      <div className="container mx-auto select-none text-xl flex flex-col items-center pt-8 pb-24 text-center">
        <div>
          <Image
            src={logo}
            alt={strings.html_logoAlt}
            className="img block w-32"
          />
        </div>
        <h1 className="mt-4 text-3xl font-extrabold text-gray-900">
          {strings.html_header}
        </h1>
        <p className="mt-1 text-gray-600">
          {strings.html_or}
          <Link href="/" passHref={true}>
            <a className="text-blue-600 hover:opacity-90">
              {strings.html_returnHome}
            </a>
          </Link>
        </p>
        <form className="mt-12 flex flex-col" onSubmit={(e) => onSubmit(e)}>
          <input
            type="text"
            placeholder={strings.html_usernamePlaceholder}
            name="username"
            value={authInput.username}
            onChange={(e) => {
              onInputChange(e);
            }}
            className="block rounded-md rounded-b-none border border-gray-400 py-3  px-4 placeholder-gray-500"
          />
          <input
            type="password"
            placeholder={strings.html_passwordPlaceholder}
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
              <label htmlFor="remember">{strings.html_checkboxLabel}</label>
            </div>
            <a
              className="mt-4 text-left text-blue-600 md:mt-0 hover:opacity-90 cursor-pointer"
              onClick={(e) => {
                onDemoAdminClicked(e);
              }}
              title={strings.html_demoAdminTitle}
            >
              {strings.html_demoAdminText}
            </a>
          </div>
          <input
            type="submit"
            value={strings.html_signInButton}
            className="m-0 mt-8 block w-full cursor-pointer rounded-lg bg-blue-600 py-3 text-xl text-white shadow hover:opacity-95 hover:shadow-sm active:opacity-100 active:shadow-lg"
          />
        </form>
      </div>
    </>
  );
};

export default LoginComponent;
