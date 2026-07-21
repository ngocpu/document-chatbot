import { Router } from "express";
import { retrieveRelevantChunks } from "@/services/retrieval";
import { generateAnswer } from "@/services/llmClient";
import {
  getSession,
  saveSession,
  listSessions,
  renameSession,
  deleteSession,
} from "@/storage/sessionStore";

export const chatRouter = Router();

chatRouter.get("/sessions", async (_req, res) => {
  const sessions = await listSessions();
  res.json({ sessions });
});

chatRouter.get("/sessions/:id", async (req, res) => {
  const session = await getSession(req.params.id);
  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }
  res.json(session);
});

chatRouter.patch("/sessions/:id", async (req, res) => {
  const { fileName } = (req.body ?? {}) as { fileName?: string };
  if (!fileName) {
    res.status(400).json({ error: "fileName is required" });
    return;
  }

  const session = await renameSession(req.params.id, fileName);
  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }
  res.json(session);
});

chatRouter.delete("/sessions/:id", async (req, res) => {
  const deleted = await deleteSession(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: "Session not found" });
    return;
  }
  res.status(204).send();
});

chatRouter.post("/chat", async (req, res) => {
  // req.body is undefined when the request has no/wrong Content-Type header.
  const { sessionId, question } = (req.body ?? {}) as {
    sessionId?: string;
    question?: string;
  };

  if (!sessionId || !question) {
    res.status(400).json({ error: "sessionId and question are required" });
    return;
  }

  const session = await getSession(sessionId);
  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  try {
    const relevantChunks = retrieveRelevantChunks(question, session.chunks);
    const answer = await generateAnswer(question, relevantChunks);
    const sources = relevantChunks.map((c) => ({ index: c.index, text: c.text }));
    const now = new Date().toISOString();

    session.messages.push({ role: "user", content: question, createdAt: now });
    session.messages.push({
      role: "assistant",
      content: answer,
      sources,
      createdAt: now,
    });
    await saveSession(session);

    res.json({ answer, sources });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});
