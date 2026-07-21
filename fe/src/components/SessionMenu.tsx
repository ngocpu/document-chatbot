import { useEffect, useRef, useState } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SessionMenuProps {
  isActive: boolean;
  onRequestRename: () => void;
  onDelete: () => void;
}

export function SessionMenu({ isActive, onRequestRename, onDelete }: SessionMenuProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-label={t("sidebar.sessionMenu")}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`absolute top-1/2 right-1 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-text-muted hover:bg-bg hover:text-text ${
          isActive || isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <MoreVertical size={14} />
      </button>
      {isOpen && (
        <div className="absolute top-full right-1 z-10 mt-1 w-32 rounded-lg border border-border bg-bg-elevated py-1 shadow-lg">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onRequestRename();
            }}
            className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-text hover:bg-bg"
          >
            <Pencil size={12} />
            {t("sidebar.rename")}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onDelete();
            }}
            className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-red-500 hover:bg-bg"
          >
            <Trash2 size={12} />
            {t("sidebar.delete")}
          </button>
        </div>
      )}
    </div>
  );
}
