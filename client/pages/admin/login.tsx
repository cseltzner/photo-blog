import React from "react";
import LoginComponent from "../../components/auth/LoginComponent";
import Alert from "../../components/alert/Alert";

const Login = () => {
  return (
    <>
      <Alert
        type={"error"}
        title={"Login success"}
        messages={[
          "You have been successfully logged in",
          "You have failed to log in",
        ]}
      />
      <LoginComponent />
    </>
  );
};

export default Login;
