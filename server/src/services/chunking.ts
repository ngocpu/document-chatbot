export interface Chunk {
  index: number;
  text: string;
  wordCount: number;
}

export interface ChunkingOptions {
  /** Target chunk size in words (see docs/chuong-1-tong-quan-de-tai.md, 1.2.3). */
  minWords?: number;
  maxWords?: number;
  /** Words repeated at the start of the next chunk to preserve boundary context. */
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

/** Splits text into overlapping chunks, breaking on sentence boundaries near maxWords. */
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

  // Merge an undersized last chunk into prev, dropping its leading overlap words
  // (already a copy of prev's tail) so they aren't duplicated.
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
