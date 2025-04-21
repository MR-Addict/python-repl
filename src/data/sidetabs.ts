import { IconType } from "react-icons";
import { VscFiles, VscSearch, VscSettingsGear } from "react-icons/vsc";

export type Sidetab = {
  key: "files" | "search" | "extensions";
  name: string;
  Icon: IconType;
};

export const sidetabs: Sidetab[] = [
  {
    key: "files",
    name: "Files",
    Icon: VscFiles
  },
  {
    key: "search",
    name: "Search",
    Icon: VscSearch
  },
  {
    key: "extensions",
    name: "Settings",
    Icon: VscSettingsGear
  }
];
