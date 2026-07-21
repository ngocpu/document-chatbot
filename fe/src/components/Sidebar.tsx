import { useState } from "react";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import Logo from "@/assets/logo.svg?react";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SessionMenu } from "./SessionMenu";
import { ConfirmDialog } from "./ConfirmDialog";
import { useTheme } from "@/hooks/useTheme";
import type { SessionSummary } from "@/hooks/useChat";

interface SidebarProps {
  sessions: SessionSummary[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onRenameSession: (id: string, newName: string) => void;
  onDeleteSession: (id: string) => void;
}

export default function Sidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onRenameSession,
  onDeleteSession,
}: SidebarProps) {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const startedSessions = sessions.filter((session) => session.messageCount > 0);

  const commitRename = (id: string) => {
    const trimmed = draftName.trim();
    if (trimmed) onRenameSession(id, trimmed);
    setEditingId(null);
  };

  const confirmDelete = () => {
    if (deletingId) onDeleteSession(deletingId);
    setDeletingId(null);
  };

  return (
    <aside className="sidebar-container flex h-full w-64 shrink-0 flex-col border-r border-border bg-bg">
      <div className="flex items-center gap-2 px-4 pt-5 pb-3">
        <Logo width={24} height={24} className="text-accent" />
        <div>
          <h1
            className="text-lg leading-tight text-text"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t("app.title")}
          </h1>
          <p className="text-[10px] tracking-wide text-text-muted uppercase">
            {t("app.description")}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onNewChat}
        className="mx-3 mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text hover:bg-bg-elevated"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border">
          <Plus size={12} />
        </span>
        {t("sidebar.newChat")}
      </button>

      <div className="mt-4 flex-1 overflow-y-auto px-3">
        <p className="px-1 text-xs text-text-muted">{t("sidebar.recents")}</p>
        <ul className="mt-1 flex flex-col gap-0.5">
          {startedSessions.map((session) => (
            <li key={session.id} className="group relative flex items-center">
              {editingId === session.id ? (
                <input
                  autoFocus
                  value={draftName}
                  onChange={(event) => setDraftName(event.target.value)}
                  onBlur={() => commitRename(session.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") commitRename(session.id);
                    if (event.key === "Escape") setEditingId(null);
                  }}
                  className="w-full rounded-lg border border-border bg-bg px-2 py-1.5 text-sm text-text outline-none"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => onSelectSession(session.id)}
                  className={`w-full truncate rounded-lg py-1.5 pr-7 pl-2 text-left text-sm ${
                    session.id === activeSessionId
                      ? "bg-bg-elevated text-text"
                      : "text-text-muted hover:bg-bg-elevated hover:text-text"
                  }`}
                >
                  {session.fileName}
                </button>
              )}
              {editingId !== session.id && (
                <SessionMenu
                  isActive={session.id === activeSessionId}
                  onRequestRename={() => {
                    setDraftName(session.fileName);
                    setEditingId(session.id);
                  }}
                  onDelete={() => setDeletingId(session.id)}
                />
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between px-4 py-3">
        <ThemeToggle theme={theme} onChange={setTheme} />
        <LanguageSwitcher />
      </div>

      {deletingId && (
        <ConfirmDialog
          title={t("sidebar.deleteTitle")}
          message={t("sidebar.deleteConfirm")}
          confirmLabel={t("sidebar.delete")}
          cancelLabel={t("sidebar.cancel")}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </aside>
  );
}
