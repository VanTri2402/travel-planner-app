import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { KindeProvider } from "@kinde-oss/kinde-auth-react";
import App from "./App";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    {/* **V6.0 UPDATE:** Bọc bằng KindeProvider */}
    <KindeProvider
      domain={process.env.VITE_KINDE_DOMAIN}
      clientId={process.env.VITE_KINDE_CLIENT_ID}
      redirectUri={window.location.origin + "/callback"}
      logoutUri={window.location.origin}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </KindeProvider>
  </React.StrictMode>
);
