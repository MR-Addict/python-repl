import style from "./Nodetree.module.css";
import RenamableNode from "./components/RenameInput/RenamableNode";

import { sortNodes } from "@/lib/node/utils";
import { useNodeContext } from "@/contexts/Node/Node";
import { File, Folder, NodeType } from "@/lib/node/node";
import { AiOutlineFileText, AiOutlineFolder, AiOutlineFolderOpen } from "react-icons/ai";

function FileNode({ node, level }: { node: File; level?: number }) {
  const { activeFile, setActiveFile, updateRoot } = useNodeContext();

  function handleClick() {
    setActiveFile(node.path);
    updateRoot();
  }

  return (
    <li data-type="file" data-level={level} className={style.node} style={{ "--level": level } as React.CSSProperties}>
      <div role="button" tabIndex={0} onClick={handleClick} data-active={activeFile === node.path}>
        <span>
          <AiOutlineFileText />
        </span>
        <RenamableNode node={node} />
      </div>
    </li>
  );
}

function FolderNode({ node, level }: { node: Folder; level?: number }) {
  const { updateRoot } = useNodeContext();

  function handleExpand() {
    node.expand = !node.expand;
    updateRoot();
  }

  return (
    <li
      data-type="folder"
      data-level={level}
      className={style.node}
      style={{ "--level": level } as React.CSSProperties}
    >
      <div role="button" tabIndex={0} onClick={handleExpand}>
        <span>{node.expand ? <AiOutlineFolderOpen /> : <AiOutlineFolder />}</span>
        <RenamableNode node={node} />
      </div>

      <ul data-expand={node.expand}>
        {sortNodes(node.children).map((child) => (
          <Node key={child.name} node={child} level={(level ?? 0) + 1} />
        ))}
      </ul>
    </li>
  );
}

function Node({ node, level }: { node: NodeType; level?: number }) {
  if (node.type === "file") return <FileNode node={node as File} level={level} />;
  return <FolderNode node={node} level={level} />;
}

export default function Nodetree() {
  const { root } = useNodeContext();

  return (
    <ul>
      {sortNodes(root.children).map((child) => (
        <Node key={child.name} node={child} level={1} />
      ))}
    </ul>
  );
}
