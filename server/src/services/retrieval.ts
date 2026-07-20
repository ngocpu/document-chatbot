import type { Chunk } from "./chunking";

export interface RetrievedChunk extends Chunk {
  score: number;
}

const STOPWORDS = new Set([
  "the",
  "a",
  "an",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "of",
  "to",
  "in",
  "on",
  "at",
  "for",
  "and",
  "or",
  "it",
  "this",
  "that",
  "what",
  "how",
  "why",
  "do",
  "does",
  "did",
  "with",
  "as",
  "by",
  "from",
]);

function tokenize(text: string): string[] {
  return (
    text
      .toLowerCase()
      .match(/[a-z0-9À-ỹ]+/gi)
      ?.filter((w) => !STOPWORDS.has(w)) ?? []
  );
}

/** Scores chunks by count of overlapping keywords with the question (bag-of-words match). */
export function retrieveRelevantChunks(
  question: string,
  chunks: Chunk[],
  topK = 3
): RetrievedChunk[] {
  const queryWords = new Set(tokenize(question));
  if (queryWords.size === 0) return [];

  const scored: RetrievedChunk[] = chunks.map((chunk) => {
    const chunkWords = tokenize(chunk.text);
    const chunkWordSet = new Set(chunkWords);
    let score = 0;
    for (const word of queryWords) {
      if (chunkWordSet.has(word)) score += 1;
    }
    return { ...chunk, score };
  });

  return scored
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
