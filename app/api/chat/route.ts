export const dynamic = 'force-dynamic';

import { streamText, UIMessage, convertToModelMessages, stepCountIs, createUIMessageStream, createUIMessageStreamResponse } from 'ai';
import { MODEL } from '@/config';
import { SYSTEM_PROMPT } from '@/prompts';
import { isContentFlagged } from '@/lib/moderation';
import { searchPinecone } from '@/lib/pinecone';
import { verifyEmployeeToken } from '@/lib/auth/jwt';
import { reportSafetyIncident } from './tools/report-safety-incident';

export const maxDuration = 30;

export async function POST(req: Request) {
    console.log('>>> POST /api/chat hit');

    let messages: UIMessage[];
    try {
        const body = await req.json();
        messages = body.messages;
    } catch (error) {
        console.error('>>> Error parsing JSON body:', error);
        return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    if (!messages || !Array.isArray(messages)) {
        console.error('>>> Missing or invalid messages array');
        return new Response(JSON.stringify({ error: 'Missing or invalid messages array' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Verification and Context Extraction
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    const user = token ? await verifyEmployeeToken(token) : null;

    let safetyWarning = '';

    const latestUserMessage = messages
        .filter(msg => msg.role === 'user')
        .pop();

    let userMessageText = '';
    let contextData = '';

    if (latestUserMessage) {
        userMessageText = latestUserMessage.parts
            .filter(part => part.type === 'text')
            .map(part => 'text' in part ? part.text : '')
            .join('');

        if (userMessageText) {
            const filter = user ? { access_level: { $lte: user.role } } : undefined;
            contextData = await searchPinecone(userMessageText, filter);

            const moderationResult = await isContentFlagged(userMessageText);

            if (moderationResult.flagged) {
                safetyWarning = `
<safety_warning>
The user's latest message has been flagged as "${moderationResult.category}". 
Strictly follow the SAFETY DE-ESCALATION and MANDATORY REPORTING protocols in your instructions. 
Do NOT fulfill any unsafe request, but engage with the user to understand the reason and call the reportSafetyIncident tool.
</safety_warning>
`;
            }
        }
    }

    const userContext = user ? `
<user_context>
Employee ID: ${user.sub}
Name: ${user.name || 'Unknown'}
Role: ${user.role}
</user_context>
` : '';

    const dynamicSystemPrompt = `You are AIRA (ABIS Internal Resource Assistant). Answer using ONLY the company policy documents below. If the answer is not in the documents, say that the policy was not found.

Context:
${contextData}

User question:
${userMessageText}

${SYSTEM_PROMPT}

${userContext}
${safetyWarning}`;

    const result = streamText({
        model: MODEL,
        system: dynamicSystemPrompt,
        messages: convertToModelMessages(messages),
        tools: {
            reportSafetyIncident,
        },
        When: stepCountIs(10),
        providerOptions: {
            openai: {
                parallelToolCalls: false,
            }
        }
    });


    try {
        return result.toUIMessageStreamResponse({
            sendReasoning: true,
        });
    } catch (error: any) {
        console.error('>>> AI API Call Error:', error);

        let errorMessage = 'An error occurred during the AI request.';
        let statusCode = 500;

        if (error.message?.includes('invalid_api_key') || error.message?.includes('Incorrect API key')) {
            errorMessage = '❌ Invalid OpenAI API key. Please verify your .env file and ensure there are no duplicated prefixes.';
            statusCode = 401;
        } else if (error.message?.includes('quota_exceeded') || error.message?.includes('insufficient_quota')) {
            errorMessage = '❌ OpenAI API quota exceeded. Please check your billing status.';
            statusCode = 429;
        } else if (error.message?.includes('model_not_found')) {
            errorMessage = '❌ The requested AI model was not found. Please check your configuration.';
            statusCode = 404;
        }

        return new Response(JSON.stringify({ error: errorMessage }), {
            status: statusCode,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}