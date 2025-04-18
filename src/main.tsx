import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./main.css";
import App from "./App";
import { AppContextProvider } from "@/contexts/App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </StrictMode>
);
