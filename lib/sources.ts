import { Chunk, Source, Citation, chunkSchema, citationSchema } from "@/types/data";

export function getSourceKey(source_url: string, source_description: string): string {
    return `${source_url}|||${source_description}`;
}

function getChunkSourceKey(chunk: Chunk): string {
    return getSourceKey(chunk.source_url, chunk.source_description);
}

export function aggregateSourcesFromChunks(chunks: Chunk[]): Source[] {
    const sourceMap = new Map<string, Source>();

    chunks.forEach((chunk) => {
        const key = getChunkSourceKey(chunk);
        if (!sourceMap.has(key)) {
            sourceMap.set(key, {
                chunks: [],
                source_url: chunk.source_url,
                source_description: chunk.source_description,
                source_name: chunk.source_name,
            });
        }

        sourceMap.get(key)!.chunks.push(chunk);
    });

    return Array.from(sourceMap.values());
}

export function mergeSourcesWithChunks(existingSources: Source[], newChunks: Chunk[]): Source[] {
    const sourceMap = new Map<string, Source>();
    const sourceOrder: string[] = [];

    existingSources.forEach((source) => {
        const key = getSourceKey(source.source_url, source.source_description);
        sourceMap.set(key, source);
        sourceOrder.push(key);
    });

    newChunks.forEach((chunk) => {
        const key = getChunkSourceKey(chunk);
        if (sourceMap.has(key)) {
            sourceMap.get(key)!.chunks.push(chunk);
        } else {
            const newSource: Source = {
                chunks: [chunk],
                source_url: chunk.source_url,
                source_description: chunk.source_description,
                source_name: chunk.source_name,
            };
            sourceMap.set(key, newSource);
            sourceOrder.push(key);
        }
    });

    return sourceOrder.map((key) => {
        const source = sourceMap.get(key)!;
        return sortChunksInSourceByOrder(source);
    });
}

export function sortChunksInSourceByOrder(source: Source): Source {
    source.chunks.sort((a, b) => a.order - b.order);
    return source;
}

export function getSourcesFromChunks(chunks: Chunk[]): Source[] {
    const sources = aggregateSourcesFromChunks(chunks);
    return sources.map((source) => sortChunksInSourceByOrder(source));
}

export function buildContextFromOrderedChunks(
    chunks: Chunk[],
    citationNumber: number
): string {
    if (chunks.length === 0) {
        return "";
    }

    let context = "";

    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];

        if (i === 0 || chunk.pre_context !== chunks[i - 1].post_context) {
            context += chunk.pre_context;
        }

        context += " " + chunk.text + ` [${citationNumber}] `;

        if (
            i === chunks.length - 1 ||
            chunk.post_context !== chunks[i + 1].pre_context
        ) {
            context += chunk.post_context;
        }

        if (i < chunks.length - 1) {
            context += "\n\n";
        }
    }

    return context.trim();
}

export function getContextFromSource(
    source: Source,
    citationNumber: number
): string {
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

export function getContextFromSources(sources: Source[]): string {
    return sources
        .map((source, index) => getContextFromSource(source, index + 1))
        .join("\n\n\n");
}

export function getCitationsFromSources(sources: Source[]): Citation[] {
    return sources.map((source) =>
        citationSchema.parse({
            source_url: source.source_url,
            source_description: source.source_description,
        })
    );
}

export function searchResultsToChunks(results: any): Chunk[] {
    let records: any[] = [];

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

    return records
        .map((record: any, index: number) => {
            const fields = record.fields || record.values || record.data || {};
            const metadata = record.metadata || {};

            let classNo: number | undefined = undefined;
            const classNoValue = fields.class_no !== undefined ? fields.class_no : (metadata.class_no !== undefined ? metadata.class_no : undefined);
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
                chunk_type: (fields.chunk_type || metadata.chunk_type || "text") as "image" | "text",
                source_url: fields.source_url || metadata.source_url || "",
                source_description: fields.source_description || metadata.source_description || "",
                source_name: fields.source_name || metadata.source_name || "",
                order: fields.order !== undefined ? fields.order : (metadata.order !== undefined ? metadata.order : 0),
            };

            try {
                const parsed = chunkSchema.parse(chunkData);
                return parsed;
            } catch (error) {
                return null;
            }
        })
        .filter((chunk: Chunk | null): chunk is Chunk => chunk !== null);
}

export function stripCitationsFromText(text: string): string {
    return text.replace(/\[\d+\]/g, "").trim();
}

