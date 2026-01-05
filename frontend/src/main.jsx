import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

// 🔥 Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="497539352238-72t7n9p5le45dmo7pl88ohfcaq7mdmnk.apps.googleusercontent.com">
    <>
      <App />

      {/* 🔔 Toast Container (global) */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </>
  </GoogleOAuthProvider>
);
