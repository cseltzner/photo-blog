import "../styles/globals.css";
import "../components/carousel/carousel.keyframes.css";
import "../components/spinner/spinner.keyframes.css";
import type { AppProps } from "next/app";
import Navbar from "../components/navbar/Navbar";
import { AuthContext } from "../context/AuthContext";
import { useAuthContextDefaults } from "../hooks/useAuthContext";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <AuthContext.Provider value={useAuthContextDefaults()}>
        {/* Container */}
        <div>
          <Navbar />
          <Component {...pageProps} />
        </div>
      </AuthContext.Provider>
    </>
  );
}
