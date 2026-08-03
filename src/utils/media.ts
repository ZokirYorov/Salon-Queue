export function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null
  if (path.startsWith('https')) return path
  return path
}
