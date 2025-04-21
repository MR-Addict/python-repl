import { Editor as MonacoEditor } from "@monaco-editor/react";

export default function Editor() {
  return (
    <div className="flex-1 w-full">
      <MonacoEditor theme="vs-dark" />
    </div>
  );
}
