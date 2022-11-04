import React from "react";
import { useRouter } from "next/router";
import { useEffect } from "react";

// This page will be redirected to /gallery/all
// See next.config.js
const GalleryIndex = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/gallery/all");
  }, []);
  return <></>;
};

export default GalleryIndex;
