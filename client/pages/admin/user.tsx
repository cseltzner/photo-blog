import React, { useEffect } from "react";
import { useAlertContext } from "../../hooks/useAlertContext";
import Alert from "../../components/alert/Alert";
import AddUser from "../../components/admin/AddUser";
import { addUserStrings as strings } from "../../strings/components/admin/addUserStrings";

const AddUserPage = () => {
  const { alert } = useAlertContext();

  // Update title
  useEffect(() => {
    document.title = strings.html_pageTitle;
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
