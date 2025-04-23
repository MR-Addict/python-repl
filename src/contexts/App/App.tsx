import React, { createContext, useContext } from "react";

import usePersistantState from "@/hooks/usePersistantState";
import { AppContextProps, defaultUIConfig, UIConfigSchema } from "./type";

const AppContext = createContext<AppContextProps>({
  ui: defaultUIConfig,
  setUI: () => {}
});

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [ui, setUI] = usePersistantState("ui-config", defaultUIConfig, UIConfigSchema);

  return (
    <AppContext.Provider
      value={{
        ui,
        setUI
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
