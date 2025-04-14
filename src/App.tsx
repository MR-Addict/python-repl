import { useMemo } from "react";
import { NodeType } from "@/types/node";
import { addNode, createFile, createFolder, findNode, removeNode, updateNode } from "@/lib/file/node";

function Node({ node }: { node: NodeType }) {
  if (node.type === "file") {
    return <li>{node.path}</li>;
  }

  return (
    <li>
      <h2>{node.path}</h2>
      <ul className="ml-4">
        {node.children.map((child) => (
          <Node key={child.path} node={child} />
        ))}
      </ul>
    </li>
  );
}

export default function App() {
  const root = useMemo(() => {
    const file1 = createFile("/file1.txt");
    const file2 = createFile("/file2.txt");
    const file3 = createFile("/file3.txt");
    const file4 = createFile("/file4.txt");
    const folder = createFolder("/src", [file2, file1]);
    const root = createFolder("/", [file3, folder]);
    addNode(file4, folder);
    removeNode("/src/file1.txt", root);
    updateNode("/src/file2.txt", root, { name: "file2-updated.txt" });
    console.log({ file2, root });

    return root;
  }, []);

  return (
    <div className="p-4 flex flex-col gap-4">
      <h1>File System</h1>

      <ul>
        {root.children.map((node) => (
          <Node key={node.path} node={node} />
        ))}
      </ul>
    </div>
  );
}
