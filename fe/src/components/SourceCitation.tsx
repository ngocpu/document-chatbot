import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { SourceRef } from "@/hooks/useChat";

interface SourceCitationProps {
  sources: SourceRef[];
}

export default function SourceCitation({ sources }: SourceCitationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="source-citation mt-2 border-t border-border pt-2 text-xs text-text-muted">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1"
      >
        {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        {t("chat.sourcesLabel", { count: sources.length })}
      </button>
      {isOpen && (
        <ul className="mt-1 flex flex-col gap-1">
          {sources.map((source) => (
            <li key={source.index} className="rounded-lg bg-bg px-2 py-1">
              {source.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
