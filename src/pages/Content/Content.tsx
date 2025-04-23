import { z } from "zod";
import { Splitter } from "antd";
import { useEffect } from "react";

import useDimensions from "@/hooks/useDimensions";
import usePersistantState from "@/hooks/usePersistantState";
import { useAppContext } from "@/contexts/App/App";

import Editor from "./components/Editor/Editor";
import Explorer from "./components/Explorer/Explorer";

const PanelSizeSchema = z.object({ explorer: z.number() });
type PanelSizeType = z.infer<typeof PanelSizeSchema>;
const defaultPanelSize: PanelSizeType = { explorer: 300 };

export default function Content() {
  const { ui, setUI } = useAppContext();

  const [ref, dimensions] = useDimensions();
  const [panelSize, setPanelSize] = usePersistantState("panel-size", defaultPanelSize, PanelSizeSchema);

  useEffect(() => {
    if (dimensions.width <= 768 && dimensions.width > 0) {
      setUI((prev) => ({ ...prev, sidetab: { ...prev.sidetab, open: false } }));
    }
  }, [dimensions]);

  return (
    <div ref={ref} className="w-full">
      <Splitter onResize={(sizes) => setPanelSize((prev) => ({ ...prev, explorer: sizes[0] }))}>
        <Splitter.Panel size={ui.sidetab.open ? panelSize.explorer : 0} min={200} max={400}>
          <Explorer />
        </Splitter.Panel>
        <Splitter.Panel>
          <Editor />
        </Splitter.Panel>
      </Splitter>
    </div>
  );
}
