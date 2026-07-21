import { Sun, Moon, Monitor } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ThemeMode } from "@/theme/theme-context";

interface ThemeToggleProps {
  theme: ThemeMode;
  onChange: (theme: ThemeMode) => void;
}

const OPTIONS: { value: ThemeMode; labelKey: string; icon: typeof Sun }[] = [
  { value: "light", labelKey: "theme.light", icon: Sun },
  { value: "dark", labelKey: "theme.dark", icon: Moon },
  { value: "system", labelKey: "theme.system", icon: Monitor },
];

export function ThemeToggle({ theme, onChange }: ThemeToggleProps) {
  const { t } = useTranslation();

  return (
    <div className="theme-toggle flex rounded-full border border-border p-0.5">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-label={t(option.labelKey)}
          title={t(option.labelKey)}
          onClick={() => onChange(option.value)}
          className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
            theme === option.value
              ? "bg-accent text-accent-foreground"
              : "text-text-muted hover:text-text"
          }`}
        >
          <option.icon size={14} />
        </button>
      ))}
    </div>
  );
}
