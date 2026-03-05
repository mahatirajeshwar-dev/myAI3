import { tool } from "ai";
import { z } from "zod";
import { searchPinecone } from "@/lib/pinecone";
import { PINECONE_INDEX_NAME } from "@/config";

export const vectorDatabaseSearch = tool({
    description: 'Search the vector database for information',
    inputSchema: z.object({
        query: z.string().describe('The query to search the vector database for. Optimally is a hypothetical answer for similarity search.'),
        accessLevel: z.string().optional().describe('The minimum access level required for the documents (e.g., employee, manager, admin).'),
    }),
    execute: async ({ query, accessLevel }) => {
        try {
            const filter = accessLevel ? { access_level: { $lte: accessLevel } } : undefined;
            console.log('>>> Tool Executing: vectorDatabaseSearch');
            console.log('>>> Query:', query);
            console.log('>>> Filter:', JSON.stringify(filter));
            console.log('>>> Index Name:', PINECONE_INDEX_NAME);

            const result = await searchPinecone(query, filter);

            console.log('>>> Search complete. Result length:', result.length);
            return result;
        } catch (error) {
            console.error('>>> Tool Execution Error:', error);
            throw error;
        }
    },
});


