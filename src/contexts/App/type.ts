import { z } from "zod";
import { SidetabKeySchema } from "@/data/sidetabs";

export const UIConfigSchema = z.object({
  /**
   * The configuration for the side tab.
   */
  sidetab: z.object({
    /**
     * Whether the side tab is open or not.
     */
    open: z.boolean(),

    /**
     * The currently active side tab.
     */
    tab: SidetabKeySchema
  })
});

export type UIConfigType = z.infer<typeof UIConfigSchema>;

export const defaultUIConfig: UIConfigType = {
  sidetab: {
    open: true,
    tab: "files"
  }
};

export interface AppContextProps {
  /**
   * The UI configuration.
   */
  ui: UIConfigType;

  /**
   * Set the UI configuration.
   */
  setUI: React.Dispatch<React.SetStateAction<UIConfigType>>;
}
