"use client";

import { AnimatePresence, m } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { SoftReveal } from "@/components/motion";

type CountdownLabels = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

type CountdownTimerProps = {
  targetDate: string;
  completedText: string;
  labels: CountdownLabels;
  tone?: "light" | "dark";
  compact?: boolean;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
};

function getTimeLeft(targetDate: string): TimeLeft {
  const difference = new Date(targetDate).getTime() - Date.now();

  if (Number.isNaN(difference) || difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      completed: true,
    };
  }

  const totalSeconds = Math.floor(difference / 1000);

  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60,
    completed: false,
  };
}

function AnimatedNumber({
  value,
  className,
  compact,
}: {
  value: string;
  className: string;
  compact: boolean;
}) {
  const heightClass = compact
    ? "h-[2.1rem] sm:h-[2.35rem] lg:h-[3rem]"
    : "h-[2.55rem] sm:h-[2.9rem]";

  return (
    <div className={`relative overflow-hidden ${heightClass}`}>
      <AnimatePresence initial={false} mode="popLayout">
        <m.span
          key={value}
          initial={{ y: "46%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-46%", opacity: 0 }}
          transition={{
            duration: 0.34,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={`absolute inset-0 flex items-center justify-center whitespace-nowrap ${className}`}
        >
          {value}
        </m.span>
      </AnimatePresence>
    </div>
  );
}

export function CountdownTimer({
  targetDate,
  completedText,
  labels,
  tone = "light",
  compact = false,
}: CountdownTimerProps) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const sync = () => setNow(Date.now());
    sync();
    const timer = window.setInterval(sync, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const timeLeft = useMemo(
    () => (now === null ? null : getTimeLeft(targetDate)),
    [now, targetDate]
  );

  const items = [
    { label: labels.days, value: timeLeft?.days },
    { label: labels.hours, value: timeLeft?.hours },
    { label: labels.minutes, value: timeLeft?.minutes },
    { label: labels.seconds, value: timeLeft?.seconds },
  ];

  const borderClass = tone === "dark" ? "border-white/10" : "border-ink/10";
  const valueClass = tone === "dark" ? "text-ivory-soft" : "text-ink";
  const labelClass = tone === "dark" ? "text-ivory-soft/58" : "text-ink/56";
  const cellClass = compact
    ? "px-3 py-4 text-center sm:px-4 sm:py-5 lg:px-5 lg:py-6"
    : "px-4 py-5 text-center sm:px-5 sm:py-6";
  const numberClass = compact
    ? "text-[2.1rem] sm:text-[2.4rem] lg:text-[2.9rem]"
    : "text-[2.55rem] sm:text-[2.9rem]";
  const unitClass = compact
    ? "mt-1.5 text-[0.84rem] leading-[1.32] sm:mt-2 sm:text-[0.94rem]"
    : "mt-2";

  if (timeLeft?.completed) {
    return (
      <SoftReveal>
        <p className={`body-md text-center ${valueClass}`}>{completedText}</p>
      </SoftReveal>
    );
  }

  return (
    <div className={`relative border-y ${borderClass}`}>
      <div
        className={`absolute inset-x-0 top-0 h-px ${
          tone === "dark"
            ? "bg-gradient-to-r from-transparent via-white/18 to-transparent"
            : "bg-gradient-to-r from-transparent via-ink/12 to-transparent"
        }`}
      />
      <div
        className={`absolute inset-x-0 bottom-0 h-px ${
          tone === "dark"
            ? "bg-gradient-to-r from-transparent via-white/12 to-transparent"
            : "bg-gradient-to-r from-transparent via-ink/10 to-transparent"
        }`}
      />
      <div className="grid grid-cols-2 sm:grid-cols-4">
        {items.map((item, index) => {
          const formatted =
            typeof item.value === "number"
              ? String(item.value).padStart(2, "0")
              : "--";

          return (
            <div
              key={item.label}
              className={`${cellClass} ${
                index % 2 === 0 ? `border-r ${borderClass}` : ""
              } ${
                index < 2 ? `border-b ${borderClass} sm:border-b-0` : ""
              } ${index < 3 ? `sm:border-r ${borderClass}` : ""}`}
            >
              <AnimatedNumber
                value={formatted}
                compact={compact}
                className={`countdown-number editorial-display ${numberClass} leading-none ${valueClass}`}
              />
              <div className={`body-sm italic ${unitClass} ${labelClass}`}>
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
