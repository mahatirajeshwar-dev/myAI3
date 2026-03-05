import { tool } from "ai";
import { z } from "zod";
import { searchPinecone } from "@/lib/pinecone";
<<<<<<< HEAD
import { PINECONE_INDEX_NAME } from "@/config";
=======
>>>>>>> 2c0dfac5910032c84c5db1021f994e51ff0dadfd

export const vectorDatabaseSearch = tool({
    description: 'Search the vector database for information',
    inputSchema: z.object({
        query: z.string().describe('The query to search the vector database for. Optimally is a hypothetical answer for similarity search.'),
<<<<<<< HEAD
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


=======
    }),
    execute: async ({ query }) => {
        return await searchPinecone(query);
    },
});

>>>>>>> 2c0dfac5910032c84c5db1021f994e51ff0dadfd
