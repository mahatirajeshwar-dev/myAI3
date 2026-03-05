module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/ingestion/file-parser.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "parseIngestionFile",
    ()=>parseIngestionFile
]);
const textTypes = new Set([
    'txt',
    'md',
    'markdown',
    'csv',
    'tsv',
    'json',
    'log',
    'xml'
]);
function detectExtension(filename) {
    const split = filename.toLowerCase().split('.');
    return split.length > 1 ? split[split.length - 1] : '';
}
async function parseIngestionFile(file) {
    const extension = detectExtension(file.name);
    if (textTypes.has(extension)) {
        const text = await file.text();
        return {
            text,
            fileType: extension
        };
    }
    if (extension === 'xlsx' || extension === 'xls') {
        throw new Error(`Excel file ${file.name} is not directly parseable in this environment. Please export it to CSV and upload the CSV version.`);
    }
    if (extension === 'docx' || extension === 'doc' || extension === 'pdf' || extension === 'pptx') {
        throw new Error(`File ${file.name} uses ${extension.toUpperCase()} format. Please convert this file to .txt or .md before upload.`);
    }
    throw new Error(`Unsupported file type for ${file.name}. Use txt/md/csv/tsv/json/xml/log.`);
}
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/config.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AI_NAME",
    ()=>AI_NAME,
    "CLEAR_CHAT_TEXT",
    ()=>CLEAR_CHAT_TEXT,
    "DATE_AND_TIME",
    ()=>DATE_AND_TIME,
    "MODEL",
    ()=>MODEL,
    "MODERATION_DENIAL_MESSAGE_DEFAULT",
    ()=>MODERATION_DENIAL_MESSAGE_DEFAULT,
    "MODERATION_DENIAL_MESSAGE_HARASSMENT",
    ()=>MODERATION_DENIAL_MESSAGE_HARASSMENT,
    "MODERATION_DENIAL_MESSAGE_HARASSMENT_THREATENING",
    ()=>MODERATION_DENIAL_MESSAGE_HARASSMENT_THREATENING,
    "MODERATION_DENIAL_MESSAGE_HATE",
    ()=>MODERATION_DENIAL_MESSAGE_HATE,
    "MODERATION_DENIAL_MESSAGE_HATE_THREATENING",
    ()=>MODERATION_DENIAL_MESSAGE_HATE_THREATENING,
    "MODERATION_DENIAL_MESSAGE_ILLICIT",
    ()=>MODERATION_DENIAL_MESSAGE_ILLICIT,
    "MODERATION_DENIAL_MESSAGE_ILLICIT_VIOLENT",
    ()=>MODERATION_DENIAL_MESSAGE_ILLICIT_VIOLENT,
    "MODERATION_DENIAL_MESSAGE_SELF_HARM",
    ()=>MODERATION_DENIAL_MESSAGE_SELF_HARM,
    "MODERATION_DENIAL_MESSAGE_SELF_HARM_INSTRUCTIONS",
    ()=>MODERATION_DENIAL_MESSAGE_SELF_HARM_INSTRUCTIONS,
    "MODERATION_DENIAL_MESSAGE_SELF_HARM_INTENT",
    ()=>MODERATION_DENIAL_MESSAGE_SELF_HARM_INTENT,
    "MODERATION_DENIAL_MESSAGE_SEXUAL",
    ()=>MODERATION_DENIAL_MESSAGE_SEXUAL,
    "MODERATION_DENIAL_MESSAGE_SEXUAL_MINORS",
    ()=>MODERATION_DENIAL_MESSAGE_SEXUAL_MINORS,
    "MODERATION_DENIAL_MESSAGE_VIOLENCE",
    ()=>MODERATION_DENIAL_MESSAGE_VIOLENCE,
    "MODERATION_DENIAL_MESSAGE_VIOLENCE_GRAPHIC",
    ()=>MODERATION_DENIAL_MESSAGE_VIOLENCE_GRAPHIC,
    "OWNER_NAME",
    ()=>OWNER_NAME,
    "PINECONE_INDEX_NAME",
    ()=>PINECONE_INDEX_NAME,
    "PINECONE_TOP_K",
    ()=>PINECONE_TOP_K,
    "WELCOME_MESSAGE",
    ()=>WELCOME_MESSAGE
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ai$2d$sdk$2f$openai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@ai-sdk/openai/dist/index.mjs [app-route] (ecmascript)");
;
const AI_PROVIDER = process.env.AI_PROVIDER?.toLowerCase() ?? "openai";
function createModel() {
    if (AI_PROVIDER === "openrouter") {
        const openrouter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ai$2d$sdk$2f$openai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createOpenAI"])({
            apiKey: process.env.OPENROUTER_API_KEY,
            baseURL: process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1"
        });
        return openrouter.chat(process.env.OPENROUTER_MODEL ?? "openai/gpt-4.1-mini");
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ai$2d$sdk$2f$openai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["openai"])(process.env.OPENAI_MODEL ?? "gpt-4o");
}
const MODEL = createModel();
function getDateAndTime() {
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
const DATE_AND_TIME = getDateAndTime();
const AI_NAME = "A.I.R.A.";
const OWNER_NAME = "ABIS Food Pvt Ltd";
const WELCOME_MESSAGE = `Hello! I'm ${AI_NAME} (ABIS Internal Resource Assistant). How can I help you today?`;
const CLEAR_CHAT_TEXT = "New Chat";
const MODERATION_DENIAL_MESSAGE_SEXUAL = "I can't discuss explicit sexual content. Please ask something else.";
const MODERATION_DENIAL_MESSAGE_SEXUAL_MINORS = "I can't discuss content involving minors in a sexual context. Please ask something else.";
const MODERATION_DENIAL_MESSAGE_HARASSMENT = "I can't engage with harassing content. Please be respectful.";
const MODERATION_DENIAL_MESSAGE_HARASSMENT_THREATENING = "I can't engage with threatening or harassing content. Please be respectful.";
const MODERATION_DENIAL_MESSAGE_HATE = "I can't engage with hateful content. Please be respectful.";
const MODERATION_DENIAL_MESSAGE_HATE_THREATENING = "I can't engage with threatening hate speech. Please be respectful.";
const MODERATION_DENIAL_MESSAGE_ILLICIT = "I can't discuss illegal activities. Please ask something else.";
const MODERATION_DENIAL_MESSAGE_ILLICIT_VIOLENT = "I can't discuss violent illegal activities. Please ask something else.";
const MODERATION_DENIAL_MESSAGE_SELF_HARM = "I can't discuss self-harm. If you're struggling, please reach out to a mental health professional or crisis helpline.";
const MODERATION_DENIAL_MESSAGE_SELF_HARM_INTENT = "I can't discuss self-harm intentions. If you're struggling, please reach out to a mental health professional or crisis helpline.";
const MODERATION_DENIAL_MESSAGE_SELF_HARM_INSTRUCTIONS = "I can't provide instructions related to self-harm. If you're struggling, please reach out to a mental health professional or crisis helpline.";
const MODERATION_DENIAL_MESSAGE_VIOLENCE = "I can't discuss violent content. Please ask something else.";
const MODERATION_DENIAL_MESSAGE_VIOLENCE_GRAPHIC = "I can't discuss graphic violent content. Please ask something else.";
const MODERATION_DENIAL_MESSAGE_DEFAULT = "Your message violates our guidelines. I can't answer that.";
const PINECONE_TOP_K = 40;
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME ?? "abis-employee-chatbot";
}),
"[project]/types/data.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "chunkSchema",
    ()=>chunkSchema,
    "citationSchema",
    ()=>citationSchema,
    "sourceSchema",
    ()=>sourceSchema,
    "uploadedDocumentSchema",
    ()=>uploadedDocumentSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z>");
;
const uploadedDocumentSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    title: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    created_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    content: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
});
const chunkSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    pre_context: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    text: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    post_context: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    chunk_type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "image",
        "text"
    ]),
    source_url: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    source_description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    source_name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    order: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number()
});
const sourceSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    chunks: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(chunkSchema),
    source_url: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    source_description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    source_name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
});
const citationSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    source_url: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    source_description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
});
}),
"[project]/lib/sources.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "aggregateSourcesFromChunks",
    ()=>aggregateSourcesFromChunks,
    "buildContextFromOrderedChunks",
    ()=>buildContextFromOrderedChunks,
    "getCitationsFromSources",
    ()=>getCitationsFromSources,
    "getContextFromSource",
    ()=>getContextFromSource,
    "getContextFromSources",
    ()=>getContextFromSources,
    "getSourceKey",
    ()=>getSourceKey,
    "getSourcesFromChunks",
    ()=>getSourcesFromChunks,
    "mergeSourcesWithChunks",
    ()=>mergeSourcesWithChunks,
    "searchResultsToChunks",
    ()=>searchResultsToChunks,
    "sortChunksInSourceByOrder",
    ()=>sortChunksInSourceByOrder,
    "stripCitationsFromText",
    ()=>stripCitationsFromText
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types/data.ts [app-route] (ecmascript)");
;
function getSourceKey(source_url, source_description) {
    return `${source_url}|||${source_description}`;
}
function getChunkSourceKey(chunk) {
    return getSourceKey(chunk.source_url, chunk.source_description);
}
function aggregateSourcesFromChunks(chunks) {
    const sourceMap = new Map();
    chunks.forEach((chunk)=>{
        const key = getChunkSourceKey(chunk);
        if (!sourceMap.has(key)) {
            sourceMap.set(key, {
                chunks: [],
                source_url: chunk.source_url,
                source_description: chunk.source_description,
                source_name: chunk.source_name
            });
        }
        sourceMap.get(key).chunks.push(chunk);
    });
    return Array.from(sourceMap.values());
}
function mergeSourcesWithChunks(existingSources, newChunks) {
    const sourceMap = new Map();
    const sourceOrder = [];
    existingSources.forEach((source)=>{
        const key = getSourceKey(source.source_url, source.source_description);
        sourceMap.set(key, source);
        sourceOrder.push(key);
    });
    newChunks.forEach((chunk)=>{
        const key = getChunkSourceKey(chunk);
        if (sourceMap.has(key)) {
            sourceMap.get(key).chunks.push(chunk);
        } else {
            const newSource = {
                chunks: [
                    chunk
                ],
                source_url: chunk.source_url,
                source_description: chunk.source_description,
                source_name: chunk.source_name
            };
            sourceMap.set(key, newSource);
            sourceOrder.push(key);
        }
    });
    return sourceOrder.map((key)=>{
        const source = sourceMap.get(key);
        return sortChunksInSourceByOrder(source);
    });
}
function sortChunksInSourceByOrder(source) {
    source.chunks.sort((a, b)=>a.order - b.order);
    return source;
}
function getSourcesFromChunks(chunks) {
    const sources = aggregateSourcesFromChunks(chunks);
    return sources.map((source)=>sortChunksInSourceByOrder(source));
}
function buildContextFromOrderedChunks(chunks, citationNumber) {
    if (chunks.length === 0) {
        return "";
    }
    let context = "";
    for(let i = 0; i < chunks.length; i++){
        const chunk = chunks[i];
        if (i === 0 || chunk.pre_context !== chunks[i - 1].post_context) {
            context += chunk.pre_context;
        }
        context += " " + chunk.text + ` [${citationNumber}] `;
        if (i === chunks.length - 1 || chunk.post_context !== chunks[i + 1].pre_context) {
            context += chunk.post_context;
        }
        if (i < chunks.length - 1) {
            context += "\n\n";
        }
    }
    return context.trim();
}
function getContextFromSource(source, citationNumber) {
    return `
    <excerpt-from-source>
    # Source ${citationNumber}
    ## Source Name
    ${source.source_name}
    ## Source Description
    ${source.source_description}
    ## Source Citation
    If you use this source, cite it using a markdown link with the source number as the link text, as follows: [${citationNumber}](${source.source_url})
    ## Excerpt from Source
    ${buildContextFromOrderedChunks(source.chunks, citationNumber)}
    </excerpt-from-source>
  `;
}
function getContextFromSources(sources) {
    return sources.map((source, index)=>getContextFromSource(source, index + 1)).join("\n\n\n");
}
function getCitationsFromSources(sources) {
    return sources.map((source)=>__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["citationSchema"].parse({
            source_url: source.source_url,
            source_description: source.source_description
        }));
}
function searchResultsToChunks(results) {
    let records = [];
    if (Array.isArray(results)) {
        records = results;
    } else if (results?.result?.hits && Array.isArray(results.result.hits)) {
        records = results.result.hits;
    } else if (results?.records && Array.isArray(results.records)) {
        records = results.records;
    } else if (results?.matches && Array.isArray(results.matches)) {
        records = results.matches;
    } else if (results?.data && Array.isArray(results.data)) {
        records = results.data;
    } else {
        console.warn("searchResultsToChunks - Invalid results structure:", {
            hasResults: !!results,
            isArray: Array.isArray(results),
            hasResultHits: !!(results && results.result && results.result.hits),
            hasRecords: !!(results && results.records),
            hasMatches: !!(results && results.matches),
            hasData: !!(results && results.data),
            resultsKeys: results ? Object.keys(results) : [],
            resultsType: typeof results
        });
        return [];
    }
    return records.map((record, index)=>{
        const fields = record.fields || record.values || record.data || {};
        const metadata = record.metadata || {};
        let classNo = undefined;
        const classNoValue = fields.class_no !== undefined ? fields.class_no : metadata.class_no !== undefined ? metadata.class_no : undefined;
        if (classNoValue !== undefined && classNoValue !== null && classNoValue !== "") {
            const parsed = typeof classNoValue === 'string' ? parseInt(classNoValue, 10) : classNoValue;
            if (!isNaN(parsed)) {
                classNo = parsed;
            }
        }
        const chunkData = {
            pre_context: fields.pre_context || metadata.pre_context || "",
            text: fields.chunk_text || fields.text || metadata.chunk_text || metadata.text || record.text || "",
            post_context: fields.post_context || metadata.post_context || "",
            chunk_type: fields.chunk_type || metadata.chunk_type || "text",
            source_url: fields.source_url || metadata.source_url || "",
            source_description: fields.source_description || metadata.source_description || "",
            source_name: fields.source_name || metadata.source_name || "",
            order: fields.order !== undefined ? fields.order : metadata.order !== undefined ? metadata.order : 0
        };
        try {
            const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["chunkSchema"].parse(chunkData);
            return parsed;
        } catch (error) {
            return null;
        }
    }).filter((chunk)=>chunk !== null);
}
function stripCitationsFromText(text) {
    return text.replace(/\[\d+\]/g, "").trim();
}
}),
"[project]/lib/pinecone.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getPineconeClient",
    ()=>getPineconeClient,
    "getPineconeIndex",
    ()=>getPineconeIndex,
    "searchPinecone",
    ()=>searchPinecone
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$pinecone$2d$database$2f$pinecone$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@pinecone-database/pinecone/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/config.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sources$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/sources.ts [app-route] (ecmascript)");
;
;
;
;
let pineconeInstance = null;
function getPineconeClient() {
    if (!process.env.PINECONE_API_KEY) {
        return null;
    }
    if (!pineconeInstance) {
        pineconeInstance = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$pinecone$2d$database$2f$pinecone$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Pinecone"]({
            apiKey: process.env.PINECONE_API_KEY
        });
    }
    return pineconeInstance;
}
function getPineconeIndex() {
    const client = getPineconeClient();
    if (!client) return null;
    return client.Index(__TURBOPACK__imported__module__$5b$project$5d2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PINECONE_INDEX_NAME"]);
}
async function searchPinecone(query) {
    const index = getPineconeIndex();
    if (!index) {
        return "< results > No vector database configured. </results>";
    }
    const results = await index.namespace('default').searchRecords({
        query: {
            inputs: {
                text: query
            },
            topK: __TURBOPACK__imported__module__$5b$project$5d2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PINECONE_TOP_K"]
        },
        fields: [
            'text',
            'pre_context',
            'post_context',
            'source_url',
            'source_description',
            'source_type',
            'order'
        ]
    });
    const chunks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sources$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["searchResultsToChunks"])(results);
    const sources = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sources$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSourcesFromChunks"])(chunks);
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sources$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getContextFromSources"])(sources);
    return `< results > ${context} </results>`;
}
}),
"[project]/lib/ingestion/chunking.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "chunkText",
    ()=>chunkText
]);
function chunkText(content, chunkSize = 1200, overlap = 200) {
    const normalized = content.replace(/\r\n/g, '\n').trim();
    if (!normalized) {
        return [];
    }
    const chunks = [];
    let cursor = 0;
    while(cursor < normalized.length){
        const end = Math.min(cursor + chunkSize, normalized.length);
        const slice = normalized.slice(cursor, end).trim();
        if (slice) {
            chunks.push(slice);
        }
        if (end === normalized.length) {
            break;
        }
        cursor = Math.max(end - overlap, cursor + 1);
    }
    return chunks;
}
}),
"[project]/lib/ingestion/pinecone-ingest.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ingestTextIntoPinecone",
    ()=>ingestTextIntoPinecone
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/nanoid/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pinecone$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/pinecone.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ingestion$2f$chunking$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ingestion/chunking.ts [app-route] (ecmascript)");
;
;
;
async function ingestTextIntoPinecone(input) {
    const namespace = input.namespace ?? 'default';
    const chunks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ingestion$2f$chunking$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["chunkText"])(input.content);
    if (!chunks.length) {
        return {
            chunkCount: 0
        };
    }
    const records = chunks.map((chunk, index)=>({
            _id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
            text: chunk,
            pre_context: index > 0 ? chunks[index - 1].slice(-240) : '',
            post_context: index < chunks.length - 1 ? chunks[index + 1].slice(0, 240) : '',
            source_name: input.sourceName,
            source_description: input.sourceDescription,
            source_url: input.sourceUrl,
            source_type: 'internal_policy_doc',
            order: index
        }));
    const index = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pinecone$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPineconeIndex"])();
    if (!index) {
        throw new Error('Pinecone index is not configured');
    }
    await index.namespace(namespace).upsertRecords(records);
    return {
        chunkCount: chunks.length
    };
}
}),
"[project]/app/api/ingestion/upload/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "maxDuration",
    ()=>maxDuration
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ingestion$2f$file$2d$parser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ingestion/file-parser.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ingestion$2f$pinecone$2d$ingest$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ingestion/pinecone-ingest.ts [app-route] (ecmascript)");
;
;
;
const maxDuration = 60;
async function POST(request) {
    const formData = await request.formData();
    const files = formData.getAll('files').filter((value)=>value instanceof File);
    const namespace = (formData.get('namespace')?.toString() || 'default').trim();
    if (!files.length) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'No files provided. Use form field name "files".'
        }, {
            status: 400
        });
    }
    const uploaded = [];
    const failed = [];
    for (const file of files){
        try {
            const parsed = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ingestion$2f$file$2d$parser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseIngestionFile"])(file);
            const ingestResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ingestion$2f$pinecone$2d$ingest$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ingestTextIntoPinecone"])({
                namespace,
                sourceName: file.name,
                sourceDescription: `Internal HR/SOP document: ${file.name}`,
                sourceUrl: `internal://${file.name}`,
                content: parsed.text
            });
            uploaded.push({
                name: file.name,
                chunks: ingestResult.chunkCount,
                fileType: parsed.fileType
            });
        } catch (error) {
            failed.push({
                name: file.name,
                error: error instanceof Error ? error.message : 'Failed to ingest file'
            });
        }
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        namespace,
        total: files.length,
        uploaded,
        failed
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__49c0fa84._.js.map