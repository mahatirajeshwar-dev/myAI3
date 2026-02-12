import { NextResponse } from 'next/server';
import { parseIngestionFile } from '@/lib/ingestion/file-parser';
import { ingestTextIntoPinecone } from '@/lib/ingestion/pinecone-ingest';

export const maxDuration = 60;

export async function POST(request: Request) {
  const formData = await request.formData();
  const files = formData.getAll('files').filter((value): value is File => value instanceof File);
  const namespace = (formData.get('namespace')?.toString() || 'default').trim();

  if (!files.length) {
    return NextResponse.json({ error: 'No files provided. Use form field name "files".' }, { status: 400 });
  }

  const uploaded: Array<{ name: string; chunks: number; fileType: string }> = [];
  const failed: Array<{ name: string; error: string }> = [];

  for (const file of files) {
    try {
      const parsed = await parseIngestionFile(file);
      const ingestResult = await ingestTextIntoPinecone({
        namespace,
        sourceName: file.name,
        sourceDescription: `Internal HR/SOP document: ${file.name}`,
        sourceUrl: `internal://${file.name}`,
        content: parsed.text,
      });

      uploaded.push({
        name: file.name,
        chunks: ingestResult.chunkCount,
        fileType: parsed.fileType,
      });
    } catch (error) {
      failed.push({
        name: file.name,
        error: error instanceof Error ? error.message : 'Failed to ingest file',
      });
    }
  }

  return NextResponse.json({
    namespace,
    total: files.length,
    uploaded,
    failed,
  });
}
