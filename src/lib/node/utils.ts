import { NodeType } from "./node";

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
 * @param nodes The nodes to sort, it can be an array of NodeType.
 * @returns The sorted nodes, it will be sorted by type and then by name.
 */
export function sortNodes(nodes: NodeType[]) {
  return nodes.sort((a, b) => b.type.localeCompare(a.type) || a.name.localeCompare(b.name));
}
