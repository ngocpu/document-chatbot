import { useCallback, useEffect, useState } from "react";
import { apiClient } from "@/api/client";

export interface SourceRef {
  index: number;
  text: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  sources?: SourceRef[];
  createdAt: string;
}

export interface SessionSummary {
  id: string;
  fileName: string;
  createdAt: string;
  messageCount: number;
}

interface SessionDetail {
  id: string;
  fileName: string;
  messages: ChatMessage[];
}

/** Manages sessions list, active conversation state, and calls to upload/chat API. */
export default function useChat() {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshSessions = useCallback(async () => {
    const { data } = await apiClient.get<{ sessions: SessionSummary[] }>("/sessions");
    setSessions(data.sessions);
  }, []);

  useEffect(() => {
    refreshSessions().catch(() => setError("Failed to load sessions"));
  }, [refreshSessions]);

  const startNewChat = useCallback(() => {
    setSessionId(null);
    setFileName(null);
    setMessages([]);
    setError(null);
  }, []);

  const selectSession = useCallback(async (id: string) => {
    setError(null);
    try {
      const { data } = await apiClient.get<SessionDetail>(`/sessions/${id}`);
      setSessionId(data.id);
      setFileName(data.fileName);
      setMessages(data.messages);
    } catch {
      setError("Failed to load session");
    }
  }, []);

  const uploadFile = useCallback(async (file: File) => {
    setIsUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const { data } = await apiClient.post<{ sessionId: string; fileName: string }>(
        "/upload",
        form
      );
      setSessionId(data.sessionId);
      setFileName(data.fileName);
      setMessages([]);
    } catch {
      setError("Upload failed");
    } finally {
      setIsUploading(false);
    }
  }, []);

  const sendMessage = useCallback(
    async (question: string) => {
      if (!sessionId) return;
      setIsSending(true);
      setError(null);
      setMessages((prev) => [
        ...prev,
        { role: "user", content: question, createdAt: new Date().toISOString() },
      ]);
      try {
        const { data } = await apiClient.post<{ answer: string; sources: SourceRef[] }>(
          "/chat",
          { sessionId, question }
        );
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.answer,
            sources: data.sources,
            createdAt: new Date().toISOString(),
          },
        ]);
        await refreshSessions();
      } catch {
        setError("Failed to send message");
      } finally {
        setIsSending(false);
      }
    },
    [sessionId, refreshSessions]
  );

  const renameSession = useCallback(
    async (id: string, newName: string) => {
      setError(null);
      try {
        await apiClient.patch(`/sessions/${id}`, { fileName: newName });
        if (id === sessionId) setFileName(newName);
        await refreshSessions();
      } catch {
        setError("Failed to rename session");
      }
    },
    [sessionId, refreshSessions]
  );

  const deleteSession = useCallback(
    async (id: string) => {
      setError(null);
      try {
        await apiClient.delete(`/sessions/${id}`);
        if (id === sessionId) startNewChat();
        await refreshSessions();
      } catch {
        setError("Failed to delete session");
      }
    },
    [sessionId, refreshSessions, startNewChat]
  );

  return {
    sessions,
    sessionId,
    fileName,
    messages,
    isUploading,
    isSending,
    error,
    startNewChat,
    selectSession,
    uploadFile,
    sendMessage,
    renameSession,
    deleteSession,
  };
}
