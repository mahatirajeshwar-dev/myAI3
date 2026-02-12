import { createOpenAI, openai } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";

const AI_PROVIDER = process.env.AI_PROVIDER?.toLowerCase() ?? "openai";

function createModel(): LanguageModel {
  if (AI_PROVIDER === "openrouter") {
    const openrouter = createOpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1",
    });

    return openrouter.chat(process.env.OPENROUTER_MODEL ?? "openai/gpt-4.1-mini");
  }

  return openai(process.env.OPENAI_MODEL ?? "gpt-4.1");
}

export const MODEL = createModel();

function getDateAndTime(): string {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short'
  });
  return `The day today is ${dateStr} and the time right now is ${timeStr}.`;
}

export const DATE_AND_TIME = getDateAndTime();

export const AI_NAME = "A.I.R.A.";
export const OWNER_NAME = "ABIS Food Pvt Ltd";

export const WELCOME_MESSAGE = `Hello! I'm ${AI_NAME} (ABIS Internal Resource Assistant). How can I help you today?`;

export const CLEAR_CHAT_TEXT = "New Chat";

export const MODERATION_DENIAL_MESSAGE_SEXUAL = "I can't discuss explicit sexual content. Please ask something else.";
export const MODERATION_DENIAL_MESSAGE_SEXUAL_MINORS = "I can't discuss content involving minors in a sexual context. Please ask something else.";
export const MODERATION_DENIAL_MESSAGE_HARASSMENT = "I can't engage with harassing content. Please be respectful.";
export const MODERATION_DENIAL_MESSAGE_HARASSMENT_THREATENING = "I can't engage with threatening or harassing content. Please be respectful.";
export const MODERATION_DENIAL_MESSAGE_HATE = "I can't engage with hateful content. Please be respectful.";
export const MODERATION_DENIAL_MESSAGE_HATE_THREATENING = "I can't engage with threatening hate speech. Please be respectful.";
export const MODERATION_DENIAL_MESSAGE_ILLICIT = "I can't discuss illegal activities. Please ask something else.";
export const MODERATION_DENIAL_MESSAGE_ILLICIT_VIOLENT = "I can't discuss violent illegal activities. Please ask something else.";
export const MODERATION_DENIAL_MESSAGE_SELF_HARM = "I can't discuss self-harm. If you're struggling, please reach out to a mental health professional or crisis helpline.";
export const MODERATION_DENIAL_MESSAGE_SELF_HARM_INTENT = "I can't discuss self-harm intentions. If you're struggling, please reach out to a mental health professional or crisis helpline.";
export const MODERATION_DENIAL_MESSAGE_SELF_HARM_INSTRUCTIONS = "I can't provide instructions related to self-harm. If you're struggling, please reach out to a mental health professional or crisis helpline.";
export const MODERATION_DENIAL_MESSAGE_VIOLENCE = "I can't discuss violent content. Please ask something else.";
export const MODERATION_DENIAL_MESSAGE_VIOLENCE_GRAPHIC = "I can't discuss graphic violent content. Please ask something else.";
export const MODERATION_DENIAL_MESSAGE_DEFAULT = "Your message violates our guidelines. I can't answer that.";

export const PINECONE_TOP_K = 40;
export const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME ?? "abis-employee-chatbot";
