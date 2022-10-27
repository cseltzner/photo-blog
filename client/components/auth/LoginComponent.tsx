import React, { useState } from "react";
import logo from "../../assets/logo/sp-icon-only.svg";
import Image from "next/image";
import Link from "next/link";
import { apiProxy } from "../../utils/apiProxy";
import { useAuthContext } from "../../hooks/useAuthContext";

const LoginComponent = () => {
  const [authInput, setAuthInput] = useState({
    username: "",
    password: "",
  });
  const auth = useAuthContext();

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthInput({ ...authInput, [e.target.name]: e.target.value });
  };

  const onSubmit = async () => {
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

      // Handle invalid status's

      const token = await res.json();
      localStorage.setItem("token", token.token);
      auth.setIsLoggedIn(true);
      auth.setLoading(false);
    } catch (e) {
      console.error(e);
      auth.setIsLoggedIn(false);
      auth.setLoading(false);
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
        <form className="mt-12">
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={authInput.username}
            onChange={(e) => {
              onInputChange(e);
            }}
            className="block rounded-md rounded-b-none border border-gray-400 py-3 pl-4 pr-64 placeholder-gray-500"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={authInput.password}
            onChange={(e) => {
              onInputChange(e);
            }}
            className="block rounded-md rounded-t-none border border-t-0 border-gray-400 py-3 pl-4 pr-64 placeholder-gray-500"
          />
          <div className="mt-8 flex flex-col justify-between md:flex-row">
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
            type="button"
            onClick={() => onSubmit()}
            value="Sign in"
            className="m-0 mt-8 block w-full cursor-pointer rounded-lg bg-blue-600 py-3 text-xl text-white shadow hover:opacity-95 hover:shadow-sm active:opacity-100 active:shadow-lg"
          />
        </form>
      </div>
    </>
  );
};

export default LoginComponent;