import * as monaco from "monaco-editor";
import { loader } from "@monaco-editor/react";

import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === "json") {
      return new jsonWorker();
    }
    if (label === "css" || label === "scss" || label === "less") {
      return new cssWorker();
    }
    if (label === "html" || label === "handlebars" || label === "razor") {
      return new htmlWorker();
    }
    if (label === "typescript" || label === "javascript") {
      return new tsWorker();
    }
    return new editorWorker();
  }
};

loader.config({ monaco });
loader.init();

import { Folder, File } from "@/lib/node/node";
export function createRoot() {
  const root = new Folder("/");
  const file1 = new File("main.py", "print('Hello, World!')");
  const file2 = new File("utils.ts", "console.log('Hello, World!')");
  const file3 = new File("README.md", "# Hello World\n\nThis is a README file.");
  const folder = new Folder("src");
  folder.add([file1, file2]);
  root.add([file3, folder]);
  return root;
}
