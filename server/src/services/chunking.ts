export interface Chunk {
  index: number;
  text: string;
  wordCount: number;
}

export interface ChunkingOptions {
  /** Target chunk size in words. Chosen based on Arize AI benchmark: 300-500 words/chunk
   * gives the best retrieval accuracy tradeoff (see docs/chuong-1-tong-quan-de-tai.md, 1.2.3). */
  minWords?: number;
  maxWords?: number;
  /** Number of words repeated at the start of the next chunk, so a fact split across a
   * chunk boundary is not lost to retrieval. */
  overlapWords?: number;
}

const DEFAULT_OPTIONS: Required<ChunkingOptions> = {
  minWords: 300,
  maxWords: 500,
  overlapWords: 50,
};

function splitIntoSentences(text: string): string[] {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return [];
  const matches = normalized.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g);
  return (matches ?? []).map((s) => s.trim()).filter(Boolean);
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

/**
 * Splits raw document text into overlapping word-count-bounded chunks.
 * Splits on sentence boundaries so chunks stay near maxWords without cutting a sentence
 * in half, and carries the last `overlapWords` words of a chunk into the next one.
 */
export function chunkText(text: string, options: ChunkingOptions = {}): Chunk[] {
  const { minWords, maxWords, overlapWords } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };
  const sentences = splitIntoSentences(text);
  if (sentences.length === 0) return [];

  const chunks: Chunk[] = [];
  let currentWords: string[] = [];

  const flush = () => {
    if (currentWords.length === 0) return;
    chunks.push({
      index: chunks.length,
      text: currentWords.join(" "),
      wordCount: currentWords.length,
    });
  };

  for (const sentence of sentences) {
    const sentenceWords = sentence.split(/\s+/).filter(Boolean);

    if (
      currentWords.length > 0 &&
      currentWords.length + sentenceWords.length > maxWords
    ) {
      flush();
      const overlap = currentWords.slice(Math.max(0, currentWords.length - overlapWords));
      currentWords = [...overlap];
    }

    currentWords.push(...sentenceWords);

    if (currentWords.length >= maxWords) {
      flush();
      const overlap = currentWords.slice(Math.max(0, currentWords.length - overlapWords));
      currentWords = [...overlap];
    }
  }

  flush();

  // Merge a final chunk that's too small (below minWords) into the previous one,
  // so the last chunk isn't a near-empty leftover. The last chunk's leading words are
  // the overlap already copied from prev's tail, so drop them before concatenating.
  if (chunks.length > 1) {
    const last = chunks[chunks.length - 1];
    if (last.wordCount < minWords / 2) {
      const prev = chunks[chunks.length - 2];
      const lastWords = last.text.split(/\s+/).filter(Boolean);
      const newWords = lastWords.slice(Math.min(overlapWords, lastWords.length));
      if (newWords.length > 0) {
        prev.text = `${prev.text} ${newWords.join(" ")}`;
        prev.wordCount = countWords(prev.text);
      }
      chunks.pop();
    }
  }

  return chunks;
}
