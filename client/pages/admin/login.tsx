import React, { useEffect } from "react";
import LoginComponent from "../../components/auth/LoginComponent";
import Alert from "../../components/alert/Alert";
import { useAlertContext } from "../../hooks/useAlertContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useRouter } from "next/router";

const Login = () => {
  const { alert } = useAlertContext();
  const auth = useAuthContext();
  const router = useRouter();

  // Redirect user if already logged in
  useEffect(() => {
    if (auth.isLoggedIn) {
      router.push("/");
    }
  }, [auth.isLoggedIn]);

  return (
    <>
      <Alert
        type={alert?.type}
        title={alert?.title}
        messages={alert?.messages}
      />
      <LoginComponent />
    </>
  );
};

export default Login;
