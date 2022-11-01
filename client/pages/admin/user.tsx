import React from "react";
import { useAlertContext } from "../../hooks/useAlertContext";
import Alert from "../../components/alert/Alert";
import AddUser from "../../components/admin/AddUser";

const AddUserPage = () => {
  const { alert } = useAlertContext();

  return (
    <>
      <Alert
        type={alert?.type}
        title={alert?.title}
        messages={alert?.messages}
      />
      <AddUser />
    </>
  );
};

export default AddUserPage;
