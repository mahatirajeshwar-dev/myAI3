import { Pinecone } from '@pinecone-database/pinecone';
import { PINECONE_TOP_K } from '@/config';
import { searchResultsToChunks, getSourcesFromChunks, getContextFromSources } from '@/lib/sources';
import { PINECONE_INDEX_NAME } from '@/config';

<<<<<<< HEAD
let pineconeInstance: Pinecone | null = null;

export function getPineconeClient() {
    if (!process.env.PINECONE_API_KEY) {
        return null;
    }
    if (!pineconeInstance) {
        pineconeInstance = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY,
        });
    }
    return pineconeInstance;
}

export function getPineconeIndex() {
    const client = getPineconeClient();
    if (!client) return null;
    return client.Index(PINECONE_INDEX_NAME);
}

export async function searchPinecone(
    query: string,
    filter?: Record<string, any>
): Promise<string> {
    const index = getPineconeIndex();
    if (!index) {
        return "< results > No vector database configured. </results>";
    }

    const searchOptions: any = {
=======
if (!process.env.PINECONE_API_KEY) {
    throw new Error('PINECONE_API_KEY is not set');
}

export const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});

export const pineconeIndex = pinecone.Index(PINECONE_INDEX_NAME);

export async function searchPinecone(
    query: string,
): Promise<string> {
    const results = await pineconeIndex.namespace('default').searchRecords({
>>>>>>> 2c0dfac5910032c84c5db1021f994e51ff0dadfd
        query: {
            inputs: {
                text: query,
            },
            topK: PINECONE_TOP_K,
        },
        fields: ['text', 'pre_context', 'post_context', 'source_url', 'source_description', 'source_type', 'order'],
<<<<<<< HEAD
    };

    if (filter) {
        searchOptions.filter = filter;
    }

    console.log('My Pinecone Index Name:', PINECONE_INDEX_NAME);
    const results = await index.namespace('docx-files').searchRecords(searchOptions);
    console.log('Heloooooooooooooooooo Pinecone Response:', JSON.stringify(results, null, 2));
=======
    });
>>>>>>> 2c0dfac5910032c84c5db1021f994e51ff0dadfd

    const chunks = searchResultsToChunks(results);
    const sources = getSourcesFromChunks(chunks);
    const context = getContextFromSources(sources);
    return `< results > ${context} </results>`;
}