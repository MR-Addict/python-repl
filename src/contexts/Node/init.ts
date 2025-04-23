import * as monaco from "monaco-editor";
import { loader } from "@monaco-editor/react";

import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === "json") return new jsonWorker();
    if (label === "css" || label === "scss" || label === "less") return new cssWorker();
    if (label === "html" || label === "handlebars" || label === "razor") return new htmlWorker();
    if (label === "typescript" || label === "javascript") return new tsWorker();
    return new editorWorker();
  }
};

loader.config({ monaco });
loader.init();

import { Folder, File, FolderJSONSchema } from "@/lib/node/node";
import { useEffect } from "react";

function createDefaultRoot() {
  const root = new Folder({ name: "/" });
  const file1 = new File({ name: "main.py", content: "print('Hello, World!')" });
  const file2 = new File({ name: "utils.ts", content: "console.log('Hello, World!')" });
  const file3 = new File({ name: "README.md", content: "# Hello World\n\nThis is a README file." });
  const folder = new Folder({ name: "src" });
  folder.add([file1, file2]);
  root.add([file3, folder]);
  return root;
}

const storeKey = "persistant-state-root";

export function createRoot() {
  const root = localStorage.getItem(storeKey);
  if (root) {
    const parsedRoot = FolderJSONSchema.safeParse(JSON.parse(root));
    if (parsedRoot.success) return Folder.createFromJSON(parsedRoot.data);
    else return createDefaultRoot();
  } else return createDefaultRoot();
}

export function storeRoot(root: Folder) {
  useEffect(() => {
    const callback = () => localStorage.setItem(storeKey, JSON.stringify(root.toJSON()));
    const timer = setTimeout(callback, 500);
    return () => clearTimeout(timer);
  }, [root]);
}
