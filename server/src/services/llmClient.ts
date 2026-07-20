import type { RetrievedChunk } from "./retrieval";

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT =
  "You are a document Q&A assistant. Answer ONLY using the provided context excerpts. " +
  "If the context does not contain enough information to answer, say plainly that the " +
  "document does not contain the answer — never invent or guess information.";

function buildPrompt(question: string, context: RetrievedChunk[]): string {
  if (context.length === 0) {
    return `Question: ${question}\n\nContext: (no relevant excerpts found in the document)`;
  }
  const excerpts = context.map((c, i) => `[Excerpt ${i + 1}]\n${c.text}`).join("\n\n");
  return `Context excerpts:\n${excerpts}\n\nQuestion: ${question}`;
}

/** Calls the Groq API (OpenAI-compatible chat completions) to answer a question grounded in retrieved chunks. */
export async function generateAnswer(
  question: string,
  context: RetrievedChunk[]
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not set in environment");
  }

  const response = await fetch(GROQ_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildPrompt(question, context) },
      ],
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Groq API error ${response.status}: ${body}`);
  }

  const data = (await response.json()) as {
    choices: { message: { content: string } }[];
  };
  return data.choices[0]?.message?.content ?? "";
}
