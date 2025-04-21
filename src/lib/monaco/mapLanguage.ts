import * as monaco from "monaco-editor";

export default function mapLanguage(fileName: string): string | null {
  const lastDotIndex = fileName.lastIndexOf(".");
  if (!fileName || lastDotIndex === -1) return null;

  // Get the file extension from the file name
  const extension = fileName.slice(lastDotIndex).toLowerCase();

  // Search through registered languages
  const languages = monaco.languages.getLanguages();
  for (const lang of languages) {
    if (lang.extensions?.some((e) => e === extension)) {
      return lang.id;
    }
  }

  return null;
}
