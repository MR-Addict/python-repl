import { useState } from "react";

import style from "./Nodetree.module.css";
import { sortNodes } from "@/lib/node/utils";
import { useAppContext } from "@/contexts/App";
import { File, Folder, NodeType } from "@/lib/node/node";
import { AiOutlineFileText, AiOutlineFolder, AiOutlineFolderOpen } from "react-icons/ai";

function FileNode({ node, level }: { node: File; level?: number }) {
  const { activeFile, setActiveFile } = useAppContext();

  const handleClick = () => {
    setActiveFile(node.path);
  };

  return (
    <li data-type="file" data-level={level} className={style.node} style={{ "--level": level } as React.CSSProperties}>
      <button type="button" onClick={handleClick} data-active={activeFile === node.path}>
        <span>
          <AiOutlineFileText />
        </span>
        <span>{node.name}</span>
      </button>
    </li>
  );
}

function FolderNode({ node, level }: { node: Folder; level?: number }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <li
      data-type="folder"
      data-level={level}
      className={style.node}
      style={{ "--level": level } as React.CSSProperties}
    >
      <button type="button" onClick={() => setIsOpen((prev) => !prev)}>
        <span>{isOpen ? <AiOutlineFolderOpen /> : <AiOutlineFolder />}</span>
        <span>{node.name}</span>
      </button>

      <ul data-open={isOpen}>
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
  const { root } = useAppContext();

  return (
    <ul>
      {sortNodes(root.children).map((child) => (
        <Node key={child.name} node={child} level={1} />
      ))}
    </ul>
  );
}
