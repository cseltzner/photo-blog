import React, { useEffect } from "react";
import UploadImage from "../../components/admin/UploadImage";
import Alert from "../../components/alert/Alert";
import { useAlertContext } from "../../hooks/useAlertContext";

const Upload = () => {
  const { alert } = useAlertContext();

  // Update title
  useEffect(() => {
    document.title = "Upload image | Seltzport";
  }, []);

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
