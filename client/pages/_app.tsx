import "../styles/globals.css";
import "../components/carousel/carousel.keyframes.css";
import "../components/spinner/spinner.keyframes.css";
import "../components/alert/Alert.keyframes.css";
import type { AppProps } from "next/app";
import Navbar from "../components/navbar/Navbar";
import { AuthContext } from "../context/AuthContext";
import { useAuthContextDefaults } from "../hooks/useAuthContext";
import { AlertContext } from "../context/AlertContext";
import Footer from "../components/footer/Footer";
import { useAlertContextDefaults } from "../hooks/useAlertContext";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <AlertContext.Provider value={useAlertContextDefaults()}>
        <AuthContext.Provider value={useAuthContextDefaults()}>
          {/* Container */}
          <div className={"text-black/90"}>
            <Navbar />
            <Component {...pageProps} />
            <Footer />
          </div>
        </AuthContext.Provider>
      </AlertContext.Provider>
    </>
  );
}
