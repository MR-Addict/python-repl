import { pathJoin } from "./utils";

class NodeBase {
  /**
   * The type of the node.
   */
  private _name: string;

  /**
   * Created date of the node.
   */
  readonly createdAt = new Date();

  /**
   * Last modified date of the node.
   */
  lastModified: Date;

  /**
   * Parent folder of the node.
   */
  private _parent: Folder | null = null;

  constructor(name: string, parent: Folder | null = null, lastModified = new Date()) {
    this._name = name;
    this._parent = parent;
    this.lastModified = lastModified;
  }

  /**
   * Getter for the node path.
   */
  get path(): string {
    const parts: string[] = [this._name];
    let current: Folder | null = this._parent;

    while (current) {
      parts.unshift(current._name);
      current = current._parent;
    }

    return pathJoin(...parts);
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
  get parent(): Folder | null {
    return this._parent;
  }

  set parent(value: Folder | null) {
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
  private _content: string;

  constructor(name: string, content: string = "", parent: Folder | null = null, lastModified?: Date) {
    super(name, parent, lastModified);
    this._content = content;
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
  children: NodeType[];

  constructor(name: string, children: NodeType[] = [], parent: Folder | null = null, lastModified?: Date) {
    super(name, parent, lastModified);
    this.children = children;
    children.forEach((c) => (c.parent = this));
  }

  /**
   * Getter for the folder size, calculated dynamically from the children.
   */
  get size(): number {
    return this.children.reduce((acc, child) => acc + (child.type === "file" ? child.size : child.size), 0);
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
    this.children.push(...nodes);
    nodes.forEach((c) => (c.parent = this));
    this.lastModified = new Date();
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

export type NodeType = File | Folder;
