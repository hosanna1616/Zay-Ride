"use client";

import { useCallback, useState } from "react";

/**
 * Web Speech API for quick amount/product capture.
 * Browsers vary; fallback gracefully on unsupported devices.
 */
export function useVoiceInput() {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const start = useCallback((onResult: (text: string) => void) => {
    if (typeof window === "undefined") return;
    // DOM lib typings vary; SpeechRecognition is browser-specific.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type Ctor = new () => any;
    const w = window as unknown as {
      SpeechRecognition?: Ctor;
      webkitSpeechRecognition?: Ctor;
    };
    const SR = w.SpeechRecognition ?? w.webkitSpeechRecognition;
      if (!SR) {
        setError("Voice not supported");
        return;
      }
      const rec = new SR();
      rec.lang = "en-ET";
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.onstart = () => {
        setListening(true);
        setError(null);
      };
      rec.onend = () => setListening(false);
      rec.onerror = () => {
        setListening(false);
        setError("Mic error");
      };
      rec.onresult = (ev: { results: { [k: number]: { [k: number]: { transcript?: string } } } }) => {
        const text = ev.results[0]?.[0]?.transcript?.trim() ?? "";
        if (text) onResult(text);
      };
      try {
        rec.start();
      } catch {
        setError("Could not start mic");
      }
  }, []);

  return { start, listening, error };
}
