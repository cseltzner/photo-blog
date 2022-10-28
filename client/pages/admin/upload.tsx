import React from "react";
import UploadImage from "../../components/admin/UploadImage";
import Alert from "../../components/alert/Alert";
import { useAlertContext } from "../../hooks/useAlertContext";

const Upload = () => {
  const { alert } = useAlertContext();
  return (
    <>
      <Alert
        type={alert?.type}
        title={alert?.title}
        messages={alert?.messages}
      />
      <UploadImage />
    </>
  );
};

export default Upload;
