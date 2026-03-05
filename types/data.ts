import { z } from "zod";

export const uploadedDocumentSchema = z.object({
    id: z.string(),
    title: z.string(),
    created_at: z.string(),
    content: z.string(),
});
export type UploadedDocument = z.infer<typeof uploadedDocumentSchema>;

export const chunkSchema = z.object({
    pre_context: z.string(),
    text: z.string(),
    post_context: z.string(),
    chunk_type: z.enum(["image", "text"]),
    source_url: z.string(),
    source_description: z.string(),
    source_name: z.string(),
    order: z.number(),
});
export type Chunk = z.infer<typeof chunkSchema>;

export const sourceSchema = z.object({
    chunks: z.array(chunkSchema),
    source_url: z.string(),
    source_description: z.string(),
    source_name: z.string(),
});
export type Source = z.infer<typeof sourceSchema>;

export const citationSchema = z.object({
    source_url: z.string(),
    source_description: z.string(),
});
export type Citation = z.infer<typeof citationSchema>;