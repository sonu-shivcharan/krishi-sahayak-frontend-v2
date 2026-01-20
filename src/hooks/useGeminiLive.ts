import { useEffect, useRef, useState, useCallback } from "react";
import { GoogleGenAI, type LiveConnectConfig } from "@google/genai";

// Helper type for the session object
export type GeminiSession = Awaited<ReturnType<GoogleGenAI["live"]["connect"]>>;

interface UseGeminiLiveOptions {
  model?: string;
  config?: LiveConnectConfig;
}

export function useGeminiLive({ model, config }: UseGeminiLiveOptions = {}) {
  const sessionRef = useRef<GeminiSession | null>(null);
  const aiRef = useRef<GoogleGenAI | null>(null);

  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const configRef = useRef(config);
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  const stopSession = useCallback(() => {
    if (sessionRef.current) {
      try {
        sessionRef.current.close();
      } catch (e) {
        console.warn("Failed to close session:", e);
      }
      sessionRef.current = null;
    }
    setConnected(false);
  }, []);

  const startSession = useCallback(
    async (token: string) => {
      stopSession();

      try {
        setError(null);
        aiRef.current = new GoogleGenAI({
          apiKey: token,
          apiVersion: "v1alpha",
        });

        const session = await aiRef.current.live.connect({
          model: model as string,
          config: configRef.current,

          callbacks: {
            onopen: () => {
              console.log("Gemini Live Connected");
              setConnected(true);
            },
            onmessage: (msg) => {
              setMessages((prev) => [...prev, msg]);
            },
            onclose: (event) => {
              console.log("Gemini Live Closed", event);
              setConnected(false);
              sessionRef.current = null;
            },
            onerror: (err) => {
              console.error("Gemini Live Error:", err);
              setError(err.message || "Unknown Live Error");
              setConnected(false);
            },
          },
        });

        sessionRef.current = session;
      } catch (e) {
        console.error("Connection failed:", e);
        setError(e?.message ?? "Failed to connect");
        setConnected(false);
      }
    },
    [model, stopSession],
  );

  // ---- SEND FUNCTION ----
  const send = useCallback(
    (data: string | { mimeType: string; data: string }) => {
      if (!sessionRef.current) {
        console.warn("Session not connected");
        return;
      }

      try {
        // 1. Audio / Video Chunks (Realtime Input)
        // Expects: { media: { mimeType: string, data: string } }
        if (typeof data === "object" && "mimeType" in data && "data" in data) {
          sessionRef.current.sendRealtimeInput({
            media: {
              mimeType: data.mimeType,
              data: data.data,
            },
          });
        }
        // 2. Text Message (Client Content)
        // Expects: { turns: [ ... ], turnComplete: true }
        else if (typeof data === "string") {
          sessionRef.current.sendClientContent({
            turns: [
              {
                role: "user",
                parts: [{ text: data }],
              },
            ],
            turnComplete: true,
          });
        }
      } catch (e) {
        console.error("Send error:", e);
        setError("Failed to send message");
      }
    },
    [],
  );

  useEffect(() => {
    return () => stopSession();
  }, [stopSession]);

  return {
    connected,
    messages,
    error,
    startSession,
    stopSession,
    send,
  };
}
