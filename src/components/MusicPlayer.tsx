"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Music, Pause } from "lucide-react";

const SRC = "/music/silent-night.mp3";
const LS_KEY = "snegopad-music";

function Equalizer({ active }: { active: boolean }) {
  return (
    <span className="flex h-3.5 items-end gap-[2.5px]" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="w-[2.5px] rounded-full bg-gold-300"
          style={{
            height: "100%",
            transformOrigin: "bottom",
            animation: active
              ? `eq 1s ease-in-out ${i * 0.18}s infinite`
              : "none",
            transform: active ? undefined : "scaleY(0.35)",
          }}
        />
      ))}
    </span>
  );
}

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);

  const tryPlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return false;
    try {
      audio.volume = 0.32;
      await audio.play();
      setPlaying(true);
      setNeedsTap(false);
      return true;
    } catch {
      setNeedsTap(true);
      return false;
    }
  }, []);

  useEffect(() => {
    const audio = new Audio(SRC);
    audio.loop = true;
    audio.preload = "auto";
    audioRef.current = audio;

    const enabled = window.localStorage.getItem(LS_KEY) !== "off";
    if (enabled) {
      void tryPlay().then((ok) => {
        if (ok) return;
        // browsers block autoplay with sound — start on the first interaction
        const unlock = () => {
          void tryPlay();
          window.removeEventListener("pointerdown", unlock);
          window.removeEventListener("keydown", unlock);
        };
        window.addEventListener("pointerdown", unlock);
        window.addEventListener("keydown", unlock);
      });
    }

    const onPause = () => setPlaying(false);
    const onPlay = () => setPlaying(true);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("play", onPlay);

    return () => {
      audio.pause();
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("play", onPlay);
      audioRef.current = null;
    };
  }, [tryPlay]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      window.localStorage.setItem(LS_KEY, "off");
      setPlaying(false);
    } else {
      window.localStorage.setItem(LS_KEY, "on");
      void tryPlay();
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      onClick={toggle}
      className="glass-panel group fixed bottom-5 right-5 z-[70] flex items-center gap-3 rounded-full py-2.5 pl-3 pr-5 transition-all duration-300 hover:border-gold-400/50"
      style={needsTap && !playing ? { animation: "pulse-glow 2s ease-in-out infinite" } : undefined}
      aria-label={playing ? "Выключить музыку" : "Включить музыку"}
      title="Silent Night — Kevin MacLeod"
    >
      <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gold-300 to-[#b97f22] text-[#231803]">
        {playing ? <Pause size={15} strokeWidth={2.6} /> : <Music size={15} strokeWidth={2.6} />}
      </span>
      <span className="hidden flex-col items-start sm:flex">
        <span className="text-[0.7rem] font-bold leading-tight text-white">
          {playing ? "Звучит пианино" : needsTap ? "Включить музыку" : "Зимняя мелодия"}
        </span>
        <span className="text-[0.6rem] leading-tight text-slate-300/60">
          Silent Night · Kevin MacLeod
        </span>
      </span>
      <Equalizer active={playing} />
    </motion.button>
  );
}
