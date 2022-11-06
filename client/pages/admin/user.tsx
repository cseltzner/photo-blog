import React, { useEffect } from "react";
import { useAlertContext } from "../../hooks/useAlertContext";
import Alert from "../../components/alert/Alert";
import AddUser from "../../components/admin/AddUser";

const AddUserPage = () => {
  const { alert } = useAlertContext();

  // Update title
  useEffect(() => {
    document.title = "Add user | Seltzport";
  }, []);

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
