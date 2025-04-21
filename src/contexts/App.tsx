import React, { createContext, useContext, useState } from "react";

import "./loader";
import { createRoot } from "./loader";
import { Folder } from "@/lib/node/node";
import usePersistantState from "@/hooks/usePersistantState";

interface AppContextProps {
  /**
   * The root folder of the file system.
   */
  root: Folder;

  /**
   * Make sure to use root as a reference, and then pass it to setRoot.
   */
  updateRoot: (root: Folder) => void;

  /**
   * The currently active file.
   */
  activeFile: string | null;

  /**
   * Set the currently active file.
   */
  setActiveFile: React.Dispatch<React.SetStateAction<string | null>>;
}

const AppContext = createContext<AppContextProps>({
  root: new Folder("/"),
  updateRoot: () => {},

  activeFile: null,
  setActiveFile: () => {}
});

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [root, setRoot] = useState<Folder>(createRoot());
  const [activeFile, setActiveFile] = usePersistantState<string | null>("active-file", null);

  return (
    <AppContext.Provider
      value={{
        root,
        updateRoot: (root: Folder) => setRoot(new Folder(root.name, root.children, root.parent, root.lastModified)),

        activeFile,
        setActiveFile
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
