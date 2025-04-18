"use client";

import { File, Folder } from "@/lib/node/node";
import React, { createContext, useContext, useState } from "react";

interface AppContextProps {
  /**
   * The root folder of the file system.
   */
  root: Folder;

  /**
   * Make sure to use root as a reference, and then pass it to setRoot.
   */
  updateRoot: (root: Folder) => void;
}

const AppContext = createContext<AppContextProps>({
  root: new Folder("/"),
  updateRoot: () => {}
});

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [root, setRoot] = useState<Folder>(() => {
    const file1 = new File("file1.txt", "Hello World");
    const file2 = new File("file2.txt", "Hello World");
    const file3 = new File("file3.txt", "Hello World");
    const file4 = new File("file4.txt", "Hello World");

    const folder1 = new Folder("folder1");
    const folder2 = new Folder("folder2");
    const folder3 = new Folder("folder3");

    const root = new Folder("/");

    folder1.add([file1, file2]);
    folder2.add([file3, file4]);
    folder3.add([folder1, folder2]);
    root.add([folder3]);

    return root;
  });

  return (
    <AppContext.Provider
      value={{
        root,
        updateRoot: (root: Folder) => setRoot(new Folder(root.name, root.children, root.parent, root.lastModified))
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
