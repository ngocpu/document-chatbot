import { useRef, useState } from "react";
import { Plus, ArrowUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import FilePreviewCard from "./FilePreviewCard";

interface InputBoxProps {
  fileName: string | null;
  hasSession: boolean;
  hasStartedConversation: boolean;
  isUploading: boolean;
  isSending: boolean;
  onUpload: (file: File) => void;
  onSend: (question: string) => void;
}

export default function InputBox({
  fileName,
  hasSession,
  hasStartedConversation,
  isUploading,
  isSending,
  onUpload,
  onSend,
}: InputBoxProps) {
  const { t } = useTranslation();
  const [question, setQuestion] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onUpload(file);
    event.target.value = "";
  };

  const handleSend = () => {
    const trimmed = question.trim();
    if (!trimmed || !hasSession || isSending) return;
    onSend(trimmed);
    setQuestion("");
  };

  return (
    <div className="input-container w-full max-w-2xl">
      <div className="flex flex-col gap-3 rounded-3xl border border-border bg-bg-elevated p-4 shadow-lg">
        {fileName && !hasStartedConversation && <FilePreviewCard fileName={fileName} />}
        <input
          type="text"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleSend();
          }}
          disabled={!hasSession || isSending}
          placeholder={
            hasSession ? t("chat.inputPlaceholder") : t("chat.uploadFirstPlaceholder")
          }
          className="bg-transparent text-base outline-none placeholder:text-text-muted disabled:opacity-50"
        />
        <div className="flex items-center justify-between">
          <button
            type="button"
            aria-label={t("chat.attachLabel")}
            disabled={isUploading || hasSession}
            onClick={() => fileInputRef.current?.click()}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-text-muted hover:text-text disabled:opacity-50"
          >
            <Plus size={16} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            aria-label={t("chat.sendLabel")}
            disabled={!hasSession || isSending || !question.trim()}
            onClick={handleSend}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground disabled:opacity-50"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
