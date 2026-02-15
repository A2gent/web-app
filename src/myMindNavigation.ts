export function buildOpenInMyMindUrl(path: string): string {
  const trimmedPath = path.trim();
  return `/my-mind?openFile=${encodeURIComponent(trimmedPath)}`;
}

export function isSupportedFileTool(toolName: string): boolean {
  const normalized = toolName.trim().toLowerCase();
  return normalized === 'read' || normalized === 'write' || normalized === 'edit' || normalized === 'replace_lines';
}

export function extractToolFilePath(input: Record<string, unknown>): string | null {
  const value = input.path;
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}
