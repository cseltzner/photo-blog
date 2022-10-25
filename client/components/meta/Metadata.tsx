import React from "react";
import Head from "next/head";

const Metadata = () => {
  return (
    <Head>
      <title>Create Next App</title>
      <meta name="author" content="Chase Seltzner" />
      <meta name="description" content="Chase's personal photography blog" />
      <meta
        name="keywords"
        content="photography, blog, photographs, photo, picture"
      />
      <link rel="icon" href="/favicon.png" />
    </Head>
  );
};

export default Metadata;
