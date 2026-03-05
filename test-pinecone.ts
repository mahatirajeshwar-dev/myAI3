
import { Pinecone } from '@pinecone-database/pinecone';
import * as dotenv from 'dotenv';
dotenv.config();

async function test() {
    console.log('Testing Pinecone connection...');
    console.log('API Key:', process.env.PINECONE_API_KEY ? 'Present' : 'Missing');
    console.log('Index Name:', process.env.PINECONE_INDEX_NAME);

    try {
        const pc = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY!,
        });
        const index = pc.Index(process.env.PINECONE_INDEX_NAME!);
        const stats = await index.describeIndexStats();
        console.log('Connection Successful!');
        console.log('Stats:', JSON.stringify(stats, null, 2));
    } catch (error) {
        console.error('Connection Failed!');
        console.error(error);
    }
}

test();
