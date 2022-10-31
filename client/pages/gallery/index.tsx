import React from "react";
import { useRouter } from "next/router";

const Index = () => {
  const router = useRouter();
  router.push("/gallery/all");
  return <></>;
};

export default Index;
