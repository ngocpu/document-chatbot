import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import type { Chunk } from "@/services/chunking";

export interface SourceRef {
  index: number;
  text: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: SourceRef[];
  createdAt: string;
}

export interface Session {
  id: string;
  fileName: string;
  chunks: Chunk[];
  messages: Message[];
  createdAt: string;
}

export interface SessionSummary {
  id: string;
  fileName: string;
  createdAt: string;
  messageCount: number;
}

const SESSIONS_DIR = path.join(__dirname, "..", "..", "data", "sessions");

function sessionPath(id: string): string {
  return path.join(SESSIONS_DIR, `${id}.json`);
}

export async function createSession(fileName: string, chunks: Chunk[]): Promise<Session> {
  const session: Session = {
    id: randomUUID(),
    fileName,
    chunks,
    messages: [],
    createdAt: new Date().toISOString(),
  };
  await fs.writeFile(sessionPath(session.id), JSON.stringify(session, null, 2), "utf-8");
  return session;
}

export async function getSession(id: string): Promise<Session | null> {
  try {
    const raw = await fs.readFile(sessionPath(id), "utf-8");
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export async function saveSession(session: Session): Promise<void> {
  await fs.writeFile(sessionPath(session.id), JSON.stringify(session, null, 2), "utf-8");
}

export async function listSessions(): Promise<SessionSummary[]> {
  const files = await fs.readdir(SESSIONS_DIR);
  const sessions = await Promise.all(
    files
      .filter((f) => f.endsWith(".json"))
      .map(async (f) => {
        const raw = await fs.readFile(path.join(SESSIONS_DIR, f), "utf-8");
        const session = JSON.parse(raw) as Session;
        return {
          id: session.id,
          fileName: session.fileName,
          createdAt: session.createdAt,
          messageCount: session.messages.length,
        };
      })
  );
  return sessions.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
