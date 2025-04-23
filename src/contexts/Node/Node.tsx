import React, { createContext, useContext, useState } from "react";

import "./init";
import { Folder } from "@/lib/node/node";
import { createRoot, storeRoot } from "./init";
import usePersistantState from "@/hooks/usePersistantState";

interface NodeContextProps {
  /**
   * The root folder of the file system.
   */
  root: Folder;

  /**
   * Make sure to use root as a reference, and then pass it to setRoot.
   */
  updateRoot: (root?: Folder) => void;

  /**
   * The currently active file.
   */
  activeFile: string | null;

  /**
   * Set the currently active file.
   */
  setActiveFile: React.Dispatch<React.SetStateAction<string | null>>;
}

const NodeContext = createContext<NodeContextProps>({
  root: new Folder({ name: "/" }),
  updateRoot: () => {},

  activeFile: null,
  setActiveFile: () => {}
});

export const NodeContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [root, setRoot] = useState<Folder>(createRoot());
  const [activeFile, setActiveFile] = usePersistantState<string | null>("active-file", null);

  storeRoot(root);

  function updateRoot(newRoot?: Folder) {
    newRoot = newRoot ?? root;
    const json = newRoot.toJSON();
    setRoot(Folder.createFromJSON(json));
  }

  return (
    <NodeContext.Provider
      value={{
        root,
        updateRoot,

        activeFile,
        setActiveFile
      }}
    >
      {children}
    </NodeContext.Provider>
  );
};

export const useNodeContext = () => useContext(NodeContext);
