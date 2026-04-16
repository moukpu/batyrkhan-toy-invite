"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Language } from "@/lib/event-data";

const AUDIO_SRC = "/music/hero-invite-track.mp3";

export function MusicControl({ language }: { language: Language }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const circleId = useId();
  const [isPlaying, setIsPlaying] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    const handlePause = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    const handleError = () => {
      setUnavailable(true);
      setIsPlaying(false);
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("error", handleError);
    };
  }, []);

  async function togglePlayback() {
    const audio = audioRef.current;

    if (!audio || unavailable) return;

    try {
      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
      }
    } catch {
      setUnavailable(true);
      setIsPlaying(false);
    }
  }

  const circleTextSeed =
    language === "kz" ? "Музыканы қосыңыз" : "Включите музыку";
  const circleText = `${circleTextSeed} • ${circleTextSeed} • ${circleTextSeed} • `;

  const label = unavailable
    ? language === "kz"
      ? "Музыка қолжетімсіз"
      : "Музыка недоступна"
    : isPlaying
      ? language === "kz"
        ? "Музыканы тоқтату"
        : "Пауза"
      : circleTextSeed;

  return (
    <>
      <audio ref={audioRef} src={AUDIO_SRC} preload="metadata" loop />
      <div className="music-control-shell">
        <button
          type="button"
          onClick={togglePlayback}
          className={`music-control-button ${isPlaying ? "is-playing" : ""}`}
          aria-label={label}
          aria-pressed={isPlaying}
          title={label}
        >
          <svg
            viewBox="0 0 120 120"
            className={`music-control-ring ${isPlaying ? "is-playing" : ""}`}
            aria-hidden="true"
          >
            <defs>
              <path
                id={circleId}
                d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0"
              />
            </defs>
            <text>
              <textPath href={`#${circleId}`} startOffset="0%">
                {circleText}
              </textPath>
            </text>
          </svg>

          <span className="music-control-core" data-unavailable={unavailable}>
            {unavailable ? (
              <svg
                viewBox="0 0 24 24"
                className="music-control-icon"
                aria-hidden="true"
              >
                <path
                  d="M7 7L17 17M17 7L7 17"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.8"
                />
              </svg>
            ) : isPlaying ? (
              <svg
                viewBox="0 0 24 24"
                className="music-control-icon"
                aria-hidden="true"
              >
                <path d="M8 6h2.8v12H8zm5.2 0H16v12h-2.8z" fill="currentColor" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="music-control-icon music-control-icon-play"
                aria-hidden="true"
              >
                <path d="M9 7.2 17.4 12 9 16.8Z" fill="currentColor" />
              </svg>
            )}
          </span>
        </button>
      </div>
    </>
  );
}
