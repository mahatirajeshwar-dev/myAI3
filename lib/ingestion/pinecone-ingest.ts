import { nanoid } from 'nanoid';
import { pineconeIndex } from '@/lib/pinecone';
import { chunkText } from '@/lib/ingestion/chunking';

export async function ingestTextIntoPinecone(input: {
  namespace?: string;
  sourceName: string;
  sourceDescription: string;
  sourceUrl: string;
  content: string;
}) {
  const namespace = input.namespace ?? 'default';
  const chunks = chunkText(input.content);

  if (!chunks.length) {
    return { chunkCount: 0 };
  }

  const records = chunks.map((chunk, index) => ({
    _id: nanoid(),
    text: chunk,
    pre_context: index > 0 ? chunks[index - 1].slice(-240) : '',
    post_context: index < chunks.length - 1 ? chunks[index + 1].slice(0, 240) : '',
    source_name: input.sourceName,
    source_description: input.sourceDescription,
    source_url: input.sourceUrl,
    source_type: 'internal_policy_doc',
    order: index,
  }));

  await pineconeIndex.namespace(namespace).upsertRecords(records);

  return { chunkCount: chunks.length };
}
