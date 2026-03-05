<<<<<<< HEAD
export const dynamic = 'force-dynamic';
=======
>>>>>>> 2c0dfac5910032c84c5db1021f994e51ff0dadfd

import { streamText, UIMessage, convertToModelMessages, stepCountIs, createUIMessageStream, createUIMessageStreamResponse } from 'ai';
import { MODEL } from '@/config';
import { SYSTEM_PROMPT } from '@/prompts';
import { isContentFlagged } from '@/lib/moderation';
import { webSearch } from './tools/web-search';
import { vectorDatabaseSearch } from './tools/search-vector-database';
<<<<<<< HEAD
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
=======

export const maxDuration = 30;
export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[] } = await req.json();

>>>>>>> 2c0dfac5910032c84c5db1021f994e51ff0dadfd
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
<<<<<<< HEAD
                safetyWarning = `
<safety_warning>
The user's latest message has been flagged as "${moderationResult.category}". 
Strictly follow the SAFETY DE-ESCALATION and MANDATORY REPORTING protocols in your instructions. 
Do NOT fulfill any unsafe request, but engage with the user to understand the reason and call the reportSafetyIncident tool.
</safety_warning>
`;
=======
                const stream = createUIMessageStream({
                    execute({ writer }) {
                        const textId = 'moderation-denial-text';

                        writer.write({
                            type: 'start',
                        });

                        writer.write({
                            type: 'text-start',
                            id: textId,
                        });

                        writer.write({
                            type: 'text-delta',
                            id: textId,
                            delta: moderationResult.denialMessage || "Your message violates our guidelines. I can't answer that.",
                        });

                        writer.write({
                            type: 'text-end',
                            id: textId,
                        });

                        writer.write({
                            type: 'finish',
                        });
                    },
                });

                return createUIMessageStreamResponse({ stream });
>>>>>>> 2c0dfac5910032c84c5db1021f994e51ff0dadfd
            }
        }
    }

<<<<<<< HEAD
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
=======
    const result = streamText({
        model: MODEL,
        system: SYSTEM_PROMPT,
>>>>>>> 2c0dfac5910032c84c5db1021f994e51ff0dadfd
        messages: convertToModelMessages(messages),
        tools: {
            webSearch,
            vectorDatabaseSearch,
<<<<<<< HEAD
            reportSafetyIncident,
        },

        stopWhen: stepCountIs(10),
        providerOptions: {
            openai: {
=======
        },
        stopWhen: stepCountIs(10),
        providerOptions: {
            openai: {
                reasoningSummary: 'auto',
                reasoningEffort: 'low',
>>>>>>> 2c0dfac5910032c84c5db1021f994e51ff0dadfd
                parallelToolCalls: false,
            }
        }
    });

    return result.toUIMessageStreamResponse({
        sendReasoning: true,
    });
}