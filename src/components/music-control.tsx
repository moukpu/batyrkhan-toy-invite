"use client";

import { useEffect, useId, useRef, useState } from "react";

const AUDIO_SRC = "/music/invite-track.mp3";
const CIRCLE_TEXT = "Батырхан тойы • әуен • Батырхан тойы • әуен • ";

export function MusicControl() {
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

  const label = unavailable
    ? "Әуен қолжетімсіз"
    : isPlaying
      ? "Әуенді тоқтату"
      : "Әуенді қосу";

  return (
    <>
      <audio ref={audioRef} src={AUDIO_SRC} preload="none" loop />
      <div className="music-control-shell">
        <button
          type="button"
          onClick={togglePlayback}
          className={`music-control-button ${isPlaying ? "is-playing" : ""}`}
          aria-label={label}
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
                {CIRCLE_TEXT}
              </textPath>
            </text>
          </svg>
          <span className="music-control-core" data-unavailable={unavailable}>
            {unavailable ? "×" : isPlaying ? "II" : "▶"}
          </span>
        </button>
      </div>
    </>
  );
}
