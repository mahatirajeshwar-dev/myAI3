import OpenAI from 'openai';
import {
    MODERATION_DENIAL_MESSAGE_SEXUAL,
    MODERATION_DENIAL_MESSAGE_SEXUAL_MINORS,
    MODERATION_DENIAL_MESSAGE_HARASSMENT,
    MODERATION_DENIAL_MESSAGE_HARASSMENT_THREATENING,
    MODERATION_DENIAL_MESSAGE_HATE,
    MODERATION_DENIAL_MESSAGE_HATE_THREATENING,
    MODERATION_DENIAL_MESSAGE_ILLICIT,
    MODERATION_DENIAL_MESSAGE_ILLICIT_VIOLENT,
    MODERATION_DENIAL_MESSAGE_SELF_HARM,
    MODERATION_DENIAL_MESSAGE_SELF_HARM_INTENT,
    MODERATION_DENIAL_MESSAGE_SELF_HARM_INSTRUCTIONS,
    MODERATION_DENIAL_MESSAGE_VIOLENCE,
    MODERATION_DENIAL_MESSAGE_VIOLENCE_GRAPHIC,
    MODERATION_DENIAL_MESSAGE_DEFAULT,
} from '@/config';

export interface ModerationResult {
    flagged: boolean;
    denialMessage?: string;
    category?: string;
}

const CATEGORY_DENIAL_MESSAGES: Record<string, string> = {
    'sexual': MODERATION_DENIAL_MESSAGE_SEXUAL,
    'sexual/minors': MODERATION_DENIAL_MESSAGE_SEXUAL_MINORS,
    'harassment': MODERATION_DENIAL_MESSAGE_HARASSMENT,
    'harassment/threatening': MODERATION_DENIAL_MESSAGE_HARASSMENT_THREATENING,
    'hate': MODERATION_DENIAL_MESSAGE_HATE,
    'hate/threatening': MODERATION_DENIAL_MESSAGE_HATE_THREATENING,
    'illicit': MODERATION_DENIAL_MESSAGE_ILLICIT,
    'illicit/violent': MODERATION_DENIAL_MESSAGE_ILLICIT_VIOLENT,
    'self-harm': MODERATION_DENIAL_MESSAGE_SELF_HARM,
    'self-harm/intent': MODERATION_DENIAL_MESSAGE_SELF_HARM_INTENT,
    'self-harm/instructions': MODERATION_DENIAL_MESSAGE_SELF_HARM_INSTRUCTIONS,
    'violence': MODERATION_DENIAL_MESSAGE_VIOLENCE,
    'violence/graphic': MODERATION_DENIAL_MESSAGE_VIOLENCE_GRAPHIC,
};

const CATEGORY_CHECK_ORDER: string[] = [
    'sexual/minors',
    'sexual',
    'harassment/threatening',
    'harassment',
    'hate/threatening',
    'hate',
    'illicit/violent',
    'illicit',
    'self-harm/instructions',
    'self-harm/intent',
    'self-harm',
    'violence/graphic',
    'violence',
];

export async function isContentFlagged(text: string): Promise<ModerationResult> {
    if (!text || text.trim().length === 0) {
        return { flagged: false };
    }

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    try {
        const moderationResult = await openai.moderations.create({
            input: text,
        });

        const result = moderationResult.results[0];
        if (!result?.flagged) {
            return { flagged: false };
        }

        const categories = result.categories;
        for (const category of CATEGORY_CHECK_ORDER) {
            if (categories[category as keyof typeof categories] === true) {
                return {
                    flagged: true,
                    category,
                    denialMessage: CATEGORY_DENIAL_MESSAGES[category] || MODERATION_DENIAL_MESSAGE_DEFAULT,
                };
            }
        }

        return {
            flagged: true,
            denialMessage: MODERATION_DENIAL_MESSAGE_DEFAULT,
        };
    } catch (error) {
        return { flagged: false };
    }
}

