import * as monaco from "monaco-editor";
import { loader } from "@monaco-editor/react";
loader.config({ monaco });

import { Folder, File } from "@/lib/node/node";
export function createRoot() {
  const root = new Folder("/");
  const file1 = new File("main.py", "print('Hello, World!')");
  const file2 = new File("utils.txt", "This is a utility file.");
  const file3 = new File("README.md", "# Hello World\n\nThis is a README file.");
  const folder = new Folder("src");
  folder.add([file1, file2]);
  root.add([file3, folder]);
  return root;
}
