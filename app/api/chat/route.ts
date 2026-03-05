export const dynamic = 'force-dynamic';

import { streamText, UIMessage, convertToModelMessages, stepCountIs, createUIMessageStream, createUIMessageStreamResponse } from 'ai';
import { MODEL } from '@/config';
import { SYSTEM_PROMPT } from '@/prompts';
import { isContentFlagged } from '@/lib/moderation';
import { webSearch } from './tools/web-search';
import { vectorDatabaseSearch } from './tools/search-vector-database';
import { verifyEmployeeToken } from '@/lib/auth/jwt';

import { reportSafetyIncident } from './tools/report-safety-incident';

export const maxDuration = 30;
export async function POST(req: Request) {
    console.log('>>> POST /api/chat hit');
    const { messages }: { messages: UIMessage[] } = await req.json();

    // Verification and Context Extraction
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    const user = token ? await verifyEmployeeToken(token) : null;

    let safetyWarning = '';
    const latestUserMessage = messages
        .filter(msg => msg.role === 'user')
        .pop();

    if (latestUserMessage) {
        const textParts = latestUserMessage.parts
            .filter(part => part.type === 'text')
            .map(part => 'text' in part ? part.text : '')
            .join('');

        if (textParts) {
            const moderationResult = await isContentFlagged(textParts);

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

    const result = streamText({
        model: MODEL,
        system: `${SYSTEM_PROMPT}\n${userContext}\n${safetyWarning}`,
        messages: convertToModelMessages(messages),
        tools: {
            webSearch,
            vectorDatabaseSearch,
            reportSafetyIncident,
        },

        stopWhen: stepCountIs(10),
        providerOptions: {
            openai: {
                parallelToolCalls: false,
            }
        }
    });

    return result.toUIMessageStreamResponse({
        sendReasoning: true,
    });
}