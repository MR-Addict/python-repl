import { useMemo } from "react";
import MonacoEditor from "@monaco-editor/react";

import { useAppContext } from "@/contexts/App";
import mapLanguage from "@/lib/monaco/mapLanguage";

export default function Editor() {
  const { root, activeFile, updateRoot } = useAppContext();

  const file = useMemo(() => {
    if (!activeFile) return null;
    const file = root.get(activeFile);
    if (file && file.type == "file") return file;
    return null;
  }, [activeFile, root]);

  function handleChange(value: string | undefined) {
    if (value === undefined || !file) return;
    file.content = value;
    updateRoot(root);
  }

  if (!file) return null;

  return (
    <div className="relative w-full h-full text-base">
      <MonacoEditor
        theme="vs-dark"
        className="absolute inset-0 w-full h-full"
        language={mapLanguage(file?.name ?? "plaintext") ?? "plaintext"}
        path={file?.path}
        value={file?.content}
        onChange={handleChange}
        options={{ renderWhitespace: "all", tabSize: 2 }}
      />
    </div>
  );
}
