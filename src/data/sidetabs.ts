import { z } from "zod";
import { IconType } from "react-icons";
import { VscFiles, VscSettingsGear } from "react-icons/vsc";

export const sidetabKeys = ["files", "search", "extensions"] as const;
export const SidetabKeySchema = z.enum(sidetabKeys);
export type SidetabKeyType = z.infer<typeof SidetabKeySchema>;

export type Sidetab = {
  key: SidetabKeyType;
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
    key: "extensions",
    name: "Settings",
    Icon: VscSettingsGear
  }
];
