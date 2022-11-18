import React, { useEffect, useState } from "react";
import { apiProxy } from "../utils/apiProxy";

// Example component to test mock service worker. Delete later
const TestComponent = () => {
  const [number, setNumber] = useState("0");

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(apiProxy.concat("/example"));
      const data = await res.json();
      setNumber(data.number || "0");
    };
    fetchData();
  }, []);
  return <>{number && <button>{number}</button>}</>;
};

export default TestComponent;
