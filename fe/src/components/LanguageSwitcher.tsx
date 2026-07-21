import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES } from "@/i18nConfig";

const LANGUAGE_LABELS: Record<(typeof SUPPORTED_LANGUAGES)[number], string> = {
  vi: "VI",
  en: "EN",
  zh: "中",
};

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="language-switcher flex rounded-full border border-border p-0.5">
      {SUPPORTED_LANGUAGES.map((lng) => (
        <button
          key={lng}
          type="button"
          title={LANGUAGE_LABELS[lng]}
          onClick={() => i18n.changeLanguage(lng)}
          className={`flex h-7 w-7 items-center justify-center rounded-full text-xs transition-colors ${
            i18n.resolvedLanguage === lng
              ? "bg-accent text-accent-foreground"
              : "text-text-muted hover:text-text"
          }`}
        >
          {LANGUAGE_LABELS[lng]}
        </button>
      ))}
    </div>
  );
}
