import { z } from "zod";
import { pathJoin } from "./utils";

export const BaseJSONSchema = z.object({
  name: z.string(),
  parent: z.string().nullable(),
  createdAt: z.date(),
  lastModified: z.date()
});
export type BaseJSONType = z.infer<typeof BaseJSONSchema>;

export const FileJSONSchema = BaseJSONSchema.extend({
  type: z.literal("file"),
  content: z.string()
});
export type FileJSONType = z.infer<typeof FileJSONSchema>;

export type FolderJSONType = {
  type: "folder";
  children: (FolderJSONType | FileJSONType)[];
} & BaseJSONType;

export const FolderJSONSchema = BaseJSONSchema.extend({
  type: z.literal("folder"),
  children: z.array(z.union([FileJSONSchema, z.lazy((): z.ZodType<FolderJSONType> => FolderJSONSchema)]))
});

export type NodeType = File | Folder;

class NodeBase {
  /**
   * The type of the node.
   */
  private _name: string;

  /**
   * Created date of the node.
   */
  createdAt: Date;

  /**
   * Last modified date of the node.
   */
  lastModified: Date;

  /**
   * Parent folder of the node.
   */
  private _parent: string | null = null;

  constructor(name: string, parent: string | null = null, createdAt?: Date, lastModified?: Date) {
    this._name = name;
    this._parent = parent;

    const now = new Date();
    this.createdAt = createdAt || now;
    this.lastModified = lastModified || now;
  }

  /**
   * Convert the node to a string representation.
   */
  toJSON(): BaseJSONType {
    return {
      name: this._name,
      parent: this._parent,
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
    this.lastModified = new Date();
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
    this.lastModified = new Date();
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

  constructor(name: string, content: string = "", parent: string | null = null, createdAt?: Date, lastModified?: Date) {
    super(name, parent, createdAt, lastModified);
    this.content = content;
  }

  /**
   * Create a file from a JSON representation.
   */
  static createFromJSON(json: FileJSONType): File {
    const { name, content, parent, createdAt, lastModified } = json;
    return new File(name, content, parent, createdAt, lastModified);
  }

  /**
   * Convert the file to a string representation.
   */
  toJSON(): FileJSONType {
    const baseObject = super.toJSON();
    return {
      ...baseObject,
      type: "file" as const,
      content: this._content
    };
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
    this.lastModified = new Date();
  }
}

export class Folder extends NodeBase {
  /**
   * The type of the node.
   */
  readonly type = "folder";

  /**
   * The children of the folder.
   *
   * This can be a file or a folder.
   */
  private _children: NodeType[] = [];

  constructor(
    name: string,
    children: NodeType[] = [],
    parent: string | null = null,
    createdAt?: Date,
    lastModified?: Date
  ) {
    super(name, parent, createdAt, lastModified);
    this.add(children);
  }

  /**
   * Create a folder from a JSON representation.
   */
  static createFromJSON(json: FolderJSONType): Folder {
    const { name, children, parent, createdAt, lastModified } = json;
    const folder = new Folder(name, [], parent, createdAt, lastModified);
    folder.children = children.map((child) => {
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
      type: "folder" as const,
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
   * Getter and setter for the children.
   */
  get children(): NodeType[] {
    return this._children;
  }

  set children(nodes: NodeType[]) {
    nodes.forEach((c) => (c.parent = pathJoin(this.parent || "", this.path)));
    this._children = nodes;
    this.lastModified = new Date();
  }

  /**
   * Find a node by its path.
   */
  get(path: string): NodeType | null {
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
