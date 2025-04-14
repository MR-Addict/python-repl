import { z } from "zod";

export const FileSchema = z.object({
  /**
   * The type of the node.
   */
  type: z.literal("file"),

  /**
   * The name of the file.
   */
  name: z.string(),

  /**
   * The file path, starts with / and ends with the file name.
   */
  path: z.string(),

  /**
   * The file size, caculated in bytes.
   */
  size: z.number(),

  /**
   * The content of the file.
   */
  content: z.string(),

  /**
   * Created date of the file.
   * This is the date when the file was created.
   */
  createdAt: z.date(),

  /**
   * Last modified date of the file.
   * Whenever the file is modified, this date will be updated.
   */
  lastModified: z.date()
});

export type FileType = z.infer<typeof FileSchema>;

export const FolderSchema: z.ZodType<FolderType> = z.object({
  type: z.literal("folder"),
  name: z.string(),
  path: z.string(),
  children: z.array(z.union([FileSchema, z.lazy(() => FolderSchema)]))
});

export type FolderType = {
  /**
   * The type of the node.
   */
  type: "folder";

  /**
   * The name of the folder.
   */
  name: string;

  /**
   * The path of the folder, starts with / and ends with the folder name.
   */
  path: string;

  /**
   * The children of the folder.
   * This can be a file or a folder.
   */
  children: (FileType | FolderType)[];
};

export const NodeSchema = z.union([FileSchema, FolderSchema]);
export type NodeType = z.infer<typeof NodeSchema>;
