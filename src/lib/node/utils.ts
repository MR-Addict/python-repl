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

/**
 * Validate the name of a file or folder.
 *
 * @param name The name to validate, it can be a string.
 * @param type The type of the name, it can be "file" or "folder".
 * @returns The error message if the name is invalid, otherwise null.
 */
export function validateName(name: string, type: "file" | "folder") {
  const disallowedCharacters = ["/", "?", "*", ">", "<", "|", '"', "'", "`", "\\", ":"];

  if (!name) return `${type} name cannot be empty`;
  if (name.length > 255) return `${type} name too long`;
  if (name.endsWith(".")) return `${type} name cannot end with a dot`;

  for (const char of disallowedCharacters) {
    if (name.includes(char)) return `${type} name cannot contain "${char}"`;
  }

  return null;
}
