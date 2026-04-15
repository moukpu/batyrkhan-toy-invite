"use client";

import type { Language } from "@/lib/event-data";

type LanguageSwitcherProps = {
  language: Language;
  onChange: (language: Language) => void;
  ariaLabel: string;
};

const options: Array<{ value: Language; label: string }> = [
  { value: "kz", label: "KZ" },
  { value: "ru", label: "RU" },
];

export function LanguageSwitcher({
  language,
  onChange,
  ariaLabel,
}: LanguageSwitcherProps) {
  return (
    <div className="language-switcher" role="group" aria-label={ariaLabel}>
      {options.map((option) => {
        const active = option.value === language;

        return (
          <button
            key={option.value}
            type="button"
            className="language-switcher-option"
            data-active={active}
            aria-pressed={active}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
