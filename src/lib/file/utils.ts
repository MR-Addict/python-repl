import { NodeType } from "@/types/node";

/**
 * Get the file name from a path.
 *
 * @param path The path of the file or folder, it should start with "/".
 * @returns The name of the file or folder.
 */
export function getNodeName(path: string): string {
  return path.split("/").pop() || "";
}

/**
 * Calculate the size of a file in bytes.
 *
 * @param content The content of the file.
 * @returns The size of the file in bytes.
 */
export function calculateSize(content: string): number {
  return new Blob([content]).size;
}

/**
 * Join multiple paths into a single path.
 *
 * @param paths The paths to join, it can be an array of strings.
 * @returns The joined path, it will start with "/" and each path will be separated by "/".
 */
export function pathJoin(...paths: string[]): string {
  return paths.reduce((acc, path) => {
    if (path.startsWith("/")) path = path.slice(1);
    if (acc.endsWith("/")) acc = acc.slice(0, -1);
    return `${acc}/${path}`;
  }, "");
}

/**
 *
 * @param node The node object, it can be a file or a folder.
 * @param parentPath The parent path of the node, it should start with "/".
 * @returns The node object with the updated path.
 */
export function concatParentPath(node: NodeType, parentPath: string): NodeType {
  node.path = pathJoin(parentPath, node.name);
  if (node.type === "folder") node.children.forEach((child) => concatParentPath(child, node.path));
  return node;
}

/**
 *
 * @param nodes The array of nodes, it can be an array of files or folders.
 * @returns The sorted array of nodes, the folders will be at the top and the files will be at the bottom.
 */
export function sortNodes(nodes: NodeType[]): NodeType[] {
  function _sortNodes(nodes: NodeType[]): NodeType[] {
    return nodes.sort((a, b) => {
      if (a.type === "folder" && b.type === "file") return -1;
      if (a.type === "file" && b.type === "folder") return 1;
      return a.name.localeCompare(b.name);
    });
  }

  return _sortNodes(
    nodes.map((node) => {
      if (node.type === "folder") node.children = sortNodes(node.children);
      return node;
    })
  );
}
