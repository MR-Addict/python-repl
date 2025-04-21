import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConfigProvider, theme } from "antd";

import "./main.css";
import App from "./App";
import { AppContextProvider } from "@/contexts/App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </ConfigProvider>
  </StrictMode>
);
