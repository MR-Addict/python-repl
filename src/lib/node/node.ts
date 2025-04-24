import { z } from "zod";
import { pathJoin } from "./utils";

// =========================================================
// Type definitions for the JSON representation of the nodes
// =========================================================

// Base schema
export const BaseJSONSchema = z.object({
  name: z.string(),
  parent: z.string().nullable(),
  renaming: z.boolean(),
  createdAt: z.string(),
  lastModified: z.string()
});
export type BaseJSONType = z.infer<typeof BaseJSONSchema>;

// File schema
const FileJSONBaseSchema = z.object({
  content: z.string()
});
type FileJSONBaseType = z.infer<typeof FileJSONBaseSchema>;
export const FileJSONSchema = BaseJSONSchema.merge(FileJSONBaseSchema).extend({ type: z.literal("file") });
export type FileJSONType = z.infer<typeof FileJSONSchema>;

// Folder schema
type FolderJSONBaseType = { children: NodeType[]; expand: boolean };
export interface FolderJSONType extends BaseJSONType {
  type: "folder";
  expand: boolean;
  children: (FolderJSONType | FileJSONType)[];
}

export const FolderJSONSchema = BaseJSONSchema.extend({
  type: z.literal("folder"),
  expand: z.boolean(),
  children: z.array(z.union([FileJSONSchema, z.lazy((): z.ZodType<FolderJSONType> => FolderJSONSchema)]))
});

export type NodeType = File | Folder;

// ===============================
// Class definitions for the nodes
// ===============================

type BaseProps = Partial<Omit<BaseJSONType, "name">> & { name: string };
type FileProps = BaseProps & Partial<FileJSONBaseType>;
type FolderProps = BaseProps & Partial<FolderJSONBaseType>;

class NodeBase {
  /**
   * The type of the node.
   */
  private _name: string;

  /**
   * Created date of the node.
   */
  createdAt: string;

  /**
   * Last modified date of the node.
   */
  lastModified: string;

  /**
   * Parent folder of the node.
   */
  private _parent: string | null = null;

  /**
   * Rename flag for the node.
   */
  renaming: boolean = false;

  constructor(props: BaseProps) {
    this._name = props.name;
    this._parent = props.parent ?? null;
    this.renaming = props.renaming ?? false;

    const now = new Date().toISOString();
    this.createdAt = props.createdAt ?? now;
    this.lastModified = props.lastModified ?? now;
  }

  /**
   * Convert the node to a string representation.
   */
  toJSON(): BaseJSONType {
    return {
      name: this._name,
      parent: this._parent,
      renaming: this.renaming,
      createdAt: this.createdAt,
      lastModified: this.lastModified
    };
  }

  /**
   * Getter for the node path.
   */
  get path(): string {
    return this._parent ? pathJoin(this._parent, this._name) : this._name;
  }

  /**
   * Getter and setter for the name.
   *
   * Updates the lastModified date whenever the name is changed.
   */
  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
    this.lastModified = new Date().toISOString();
  }

  /**
   * Getter and setter for the parent.
   *
   * Updates the lastModified date whenever the parent is changed.
   */
  get parent(): string | null {
    return this._parent;
  }

  set parent(value: string | null) {
    this._parent = value;
    this.lastModified = new Date().toISOString();
  }
}

export class File extends NodeBase {
  /**
   * The type of the node.
   */
  readonly type = "file";

  /**
   * The content of the file.
   */
  private _content: string = "";

  constructor(props: FileProps) {
    super(props);
    this.content = props.content ?? "";
  }

  /**
   * Create a file from a JSON representation.
   */
  static createFromJSON(json: FileJSONType): File {
    return new File(json);
  }

  /**
   * Convert the file to a string representation.
   */
  toJSON(): FileJSONType {
    const baseObject = super.toJSON();
    return { ...baseObject, type: "file", content: this._content };
  }

  /**
   * Getter for the file size, calculated dynamically from the content.
   */
  get size(): number {
    return new Blob([this._content]).size;
  }

  /**
   * Getter and setter for the content.
   *
   * Updates the lastModified date whenever the content is changed.
   */
  get content(): string {
    return this._content;
  }

  set content(value: string) {
    this._content = value;
    this.lastModified = new Date().toISOString();
  }
}

export class Folder extends NodeBase {
  /**
   * The type of the node.
   */
  readonly type = "folder";

  /**
   * Expand flag for the folder.
   */
  private _expand: boolean = false;

  /**
   * The children of the folder.
   *
   * This can be a file or a folder.
   */
  private _children: NodeType[] = [];

  constructor(props: FolderProps) {
    super(props);
    this.expand = props.expand ?? false;
    this.children = props.children ?? [];
  }

  /**
   * Create a folder from a JSON representation.
   */
  static createFromJSON(json: FolderJSONType): Folder {
    const folder = new Folder({ ...json, children: [] });
    folder.children = json.children.map((child) => {
      if (child.type === "file") return File.createFromJSON(child);
      return Folder.createFromJSON(child);
    });
    return folder;
  }

  /**
   * Convert the folder to a string representation.
   */
  toJSON(): FolderJSONType {
    const baseObject = super.toJSON();
    return {
      ...baseObject,
      type: "folder",
      expand: this.expand,
      children: this._children.map((child) => child.toJSON())
    };
  }

  /**
   * Getter for the folder size, calculated dynamically from the children.
   */
  get size(): number {
    return this.children.reduce((acc, child) => acc + (child.type === "file" ? child.size : child.size), 0);
  }

  /**
   * Getter and setter for the expand flag.
   */
  get expand(): boolean {
    return this._expand;
  }

  set expand(value: boolean) {
    this._expand = value;
    this.lastModified = new Date().toISOString();
  }

  /**
   * Getter and setter for the children.
   */
  get children(): NodeType[] {
    return this._children;
  }

  set children(nodes: NodeType[]) {
    nodes.forEach((c) => (c.parent = pathJoin(this.parent || "", this.path)));
    this._children = nodes;
    this.lastModified = new Date().toISOString();
  }

  /**
   * Find a node by its path.
   */
  get(path: string): NodeType | null {
    if (this.path === path) return this;
    for (const node of this.children) {
      if (node.path === path) return node;
      if (node.type === "folder") {
        const childNode = node.get(path);
        if (childNode) return childNode;
      }
    }
    return null;
  }

  /**
   * Add nodes to the folder.
   */
  add(nodes: NodeType | NodeType[]): void {
    if (!Array.isArray(nodes)) nodes = [nodes];
    this.children = [...this.children, ...nodes];
  }

  /**
   * Remove nodes from the folder.
   */
  remove(nodes: string | string[]): void {
    function _recursive(nodes: string[], children: NodeType[]): NodeType[] {
      return children.reduce((acc, child) => {
        if (nodes.includes(child.path)) return acc;
        if (child.type === "folder") child.children = _recursive(nodes, child.children);
        acc.push(child);
        return acc;
      }, [] as NodeType[]);
    }

    if (!Array.isArray(nodes)) nodes = [nodes];
    this.children = _recursive(nodes, this.children);
  }
}
