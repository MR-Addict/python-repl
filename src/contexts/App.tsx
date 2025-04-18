"use client";

import { File, Folder } from "@/lib/node/node";
import { createContext, useContext, useState } from "react";

interface AppContextProps {
  root: Folder;
  updateRoot: (updater: (prevState: Folder) => Folder | void) => void;
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

  function updateRoot(updater: (root: Folder) => Folder | void) {
    setRoot((prev) => {
      const copied = new Folder(prev.path, null, prev.children, prev.lastModified);
      return updater(copied) || copied;
    });
  }

  return (
    <AppContext.Provider
      value={{
        root,
        updateRoot
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
