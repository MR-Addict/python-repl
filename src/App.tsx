import { NodeType } from "@/lib/node/node";
import { useAppContext } from "./contexts/App";

function Node({ node }: { node: NodeType }) {
  if (node.type === "file") {
    return <li>{`${node.path} (${node.content})`}</li>;
  }

  return (
    <li>
      <h2>{`${node.path}`}</h2>
      <ul className="ml-4">
        {node.children.map((child) => (
          <Node key={child.path} node={child} />
        ))}
      </ul>
    </li>
  );
}

export default function App() {
  const { root, updateRoot } = useAppContext();

  function handleClick() {
    updateRoot((root) => {
      console.log("Action clicked");
      const found = root.get("/folder3/folder1/file1.txt");
      if (found && found.type === "file") found.content = found.content + "-";
      return root;
    });
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <h1>File System</h1>

      <button type="button" className="w-fit py-2 px-3 bg-neutral-600 rounded-md" onClick={handleClick}>
        Action
      </button>

      <ul>
        <Node node={root} />
      </ul>
    </div>
  );
}
