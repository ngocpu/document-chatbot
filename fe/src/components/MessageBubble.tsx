import type { ChatMessage } from "@/hooks/useChat";
import SourceCitation from "./SourceCitation";
import FilePreviewCard from "./FilePreviewCard";

interface MessageBubbleProps {
  message: ChatMessage;
  fileName: string | null;
}

export default function MessageBubble({ message, fileName }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`message-bubble flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex max-w-xl flex-col gap-2 rounded-2xl px-4 py-2 text-sm text-text ${
          isUser ? "bg-bg-elevated" : ""
        }`}
      >
        {isUser && fileName && <FilePreviewCard fileName={fileName} />}
        <p className="whitespace-pre-wrap">{message.content}</p>
        {message.sources && message.sources.length > 0 && (
          <SourceCitation sources={message.sources} />
        )}
      </div>
    </div>
  );
}
