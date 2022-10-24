import "../styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "../components/navbar/Navbar";
import { AuthContext } from "../context/AuthContext";
import { useAuthContextDefaults } from "../hooks/useAuthContext";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <AuthContext.Provider value={useAuthContextDefaults()}>
        {/* Container */}
        <div className="container mx-auto">
          <Navbar />
          <Component {...pageProps} />
        </div>
      </AuthContext.Provider>
    </>
  );
}
