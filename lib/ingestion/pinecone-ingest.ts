import { nanoid } from 'nanoid';
<<<<<<< HEAD
import { getPineconeIndex } from '@/lib/pinecone';
=======
import { pineconeIndex } from '@/lib/pinecone';
>>>>>>> 2c0dfac5910032c84c5db1021f994e51ff0dadfd
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

<<<<<<< HEAD
  const index = getPineconeIndex();
  if (!index) {
    throw new Error('Pinecone index is not configured');
  }

  await index.namespace(namespace).upsertRecords(records);
=======
  await pineconeIndex.namespace(namespace).upsertRecords(records);
>>>>>>> 2c0dfac5910032c84c5db1021f994e51ff0dadfd

  return { chunkCount: chunks.length };
}
