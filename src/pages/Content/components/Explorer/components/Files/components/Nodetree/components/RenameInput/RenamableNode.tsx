import { useEffect, useState } from "react";

import style from "./RenamableNode.module.css";
import { NodeType } from "@/lib/node/node";
import { validateName } from "@/lib/node/utils";
import { useNodeContext } from "@/contexts/Node/Node";
import { useClickOutside } from "@/hooks/useClickOutside";

interface Props {
  node: NodeType;
}

function RenameForm({ node }: Props) {
  const { root, setActiveFile, updateRoot } = useNodeContext();

  const [value, setValue] = useState(node.name);
  const [error, setError] = useState<string | null>(null);

  const ref = useClickOutside<HTMLFormElement>(handleExit);

  function handleExit() {
    node.renaming = false;
    updateRoot();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (error) return;
    if (value === node.name) return handleExit();

    node.name = value;
    node.renaming = false;
    updateRoot();
    setActiveFile(node.path);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    setValue(newValue);

    // Validate file name first
    let error = validateName(newValue, node.type);

    // Then check if the name already exists in the parent folder
    if (!error && node.parent) {
      const parent = root.get(node.parent);
      if (
        parent &&
        parent.type === "folder" &&
        parent.children.some((child) => child.name === newValue && child.name !== node.name)
      ) {
        error = `${node.type} name already exists`;
      }
    }

    // Set the error state
    setError(error);
  }

  useEffect(() => {
    const input = ref.current!.querySelector("input") as HTMLInputElement;
    input.focus();
    input.setSelectionRange(0, input.value.replace(/\.[^/.]+$/, "").length);
  }, []);

  return (
    <form className={style.form} ref={ref} onSubmit={handleSubmit}>
      <input type="text" value={value} onChange={handleChange} className={style.input} />
      {error && <p className={style.error}>{error}</p>}
    </form>
  );
}

export default function RenamableNode({ node }: Props) {
  if (!node.renaming)
    return (
      <span className="truncate" title={node.path}>
        {node.name}
      </span>
    );
  return <RenameForm node={node} />;
}
