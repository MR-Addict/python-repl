"use client";

import { FolderType } from "@/types/node";
import { createFolder } from "@/lib/file/node";
import { createContext, useContext, useState } from "react";

interface AppContextProps {
  root: FolderType;
}

const AppContext = createContext<AppContextProps>({
  root: createFolder("/")
});

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [root, setRoot] = useState<FolderType>(createFolder("/"));

  return (
    <AppContext.Provider
      value={{
        root
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
