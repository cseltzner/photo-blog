import "../styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "../components/navbar/Navbar";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Container */}
      <div className="container mx-auto">
        <Navbar />
        <Component {...pageProps} />
      </div>
    </>
  );
}
