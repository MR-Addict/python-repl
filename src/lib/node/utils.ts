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
