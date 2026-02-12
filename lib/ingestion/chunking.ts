export function chunkText(content: string, chunkSize = 1200, overlap = 200): string[] {
  const normalized = content.replace(/\r\n/g, '\n').trim();

  if (!normalized) {
    return [];
  }

  const chunks: string[] = [];
  let cursor = 0;

  while (cursor < normalized.length) {
    const end = Math.min(cursor + chunkSize, normalized.length);
    const slice = normalized.slice(cursor, end).trim();

    if (slice) {
      chunks.push(slice);
    }

    if (end === normalized.length) {
      break;
    }

    cursor = Math.max(end - overlap, cursor + 1);
  }

  return chunks;
}
