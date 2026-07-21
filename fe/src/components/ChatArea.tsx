import { useTranslation } from "react-i18next";
import MessageBubble from "./MessageBubble";
import type { ChatMessage } from "@/hooks/useChat";

interface ChatAreaProps {
  messages: ChatMessage[];
  fileName: string | null;
}

export default function ChatArea({ messages, fileName }: ChatAreaProps) {
  const { t } = useTranslation();

  if (messages.length === 0) {
    return (
      <div className="content-container flex flex-col items-center text-center">
        <span className="text-3xl">📄</span>
        <h2
          className="mt-3 text-4xl text-text"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {t("chat.heroHeading")}
        </h2>
      </div>
    );
  }

  return (
    <div className="content-container mx-auto flex w-full max-w-2xl flex-col gap-4 py-6">
      {messages.map((message, index) => (
        <MessageBubble
          key={index}
          message={message}
          fileName={index === 0 ? fileName : null}
        />
      ))}
    </div>
  );
}
