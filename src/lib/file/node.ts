import { FileType, FolderType, NodeType } from "@/types/node";
import { concatParentPath, calculateSize, getNodeName, sortNodes } from "./utils";

/**
 * Create a file object.
 *
 * @param path The file path, it should start with "/".
 * @param content The content of the file.
 * @param createdAt The date when the file was created.
 * @param lastModified The date when the file was last modified.
 * @returns The file object.
 */
export function createFile(path: string, content: string = "", createdAt?: Date, lastModified?: Date): FileType {
  const type = "file";
  const name = getNodeName(path);
  const now = new Date();
  const size = calculateSize(content);
  createdAt = createdAt || now;
  lastModified = lastModified || now;
  return { type, name, path, size, content, createdAt, lastModified };
}

/**
 * Create a folder object.
 *
 * @param path The folder path, it should start with "/".
 * @param children The children of the folder, it can be an array of files or folders.
 * @returns The folder object.
 */
export function createFolder(path: string, children: NodeType[] = []): FolderType {
  const type = "folder";
  const name = getNodeName(path);
  children = children.map((child) => concatParentPath(child, path));
  children = sortNodes(children);
  return { type, name, path, children };
}

/**
 * Find a node by its path.
 *
 * @param path The path of the node, it should start with "/".
 * @param folder The folder object to search in.
 * @returns The node object if found, otherwise null.
 */
export function findNode(path: string, folder: FolderType): NodeType | null {
  for (const node of folder.children) {
    if (node.path === path) return node;
    if (node.type === "folder") {
      const childNode = findNode(path, node);
      if (childNode) return childNode;
    }
  }
  return null;
}

/**
 * Add a node to a folder.
 *
 * @param node The node object, it can be a file or a folder.
 * @param folder The folder object to add the node to.
 * @returns The folder object with the node added to its children.
 */
export function addNode(node: NodeType, folder: FolderType): FolderType {
  const existingNode = findNode(node.path, folder);
  if (existingNode) return folder; // Node already exists, do nothing
  folder.children.push(concatParentPath(node, folder.path));
  folder.children = sortNodes(folder.children);
  return folder;
}

/**
 * Remove a node from a folder.
 *
 * @param path The path of the node to remove, it should start with "/".
 * @param folder The folder object to remove the node from.
 * @returns The folder object with the node removed from its children.
 */
export function removeNode(path: string, folder: FolderType): FolderType {
  const index = folder.children.findIndex((node) => node.path === path);
  // Remove the node from the children array
  if (index !== -1) folder.children.splice(index, 1);
  else {
    for (const child of folder.children) {
      if (child.type === "folder") {
        removeNode(path, child); // Recursively remove the node from the children of the folder
      }
    }
  }
  return folder;
}

/**
 * Update a node's data.
 *
 * @param path The path of the node to update, it should start with "/".
 * @param folder The folder object to update the node in.
 * @param data The new data to update the node with.
 * @returns The folder object with the updated node.
 */
export function updateNode(path: string, folder: FolderType, data: Partial<NodeType>): FolderType {
  const found = findNode(path, folder);
  if (found) {
    Object.assign(found, data); // Update the node with the new data
    if (data.type === "file" && found.type === "file") {
      found.lastModified = new Date(); // Update the last modified date
    }
  }
  return folder;
}
