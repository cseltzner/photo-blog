import React from "react";
import LoginComponent from "../../components/auth/LoginComponent";
import Alert from "../../components/alert/Alert";
import { useAlertContext } from "../../hooks/useAlertContext";

const Login = () => {
  const { alert } = useAlertContext();
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
