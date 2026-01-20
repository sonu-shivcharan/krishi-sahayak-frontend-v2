import { useState, useEffect, useRef } from "react";
import { useGeminiLive } from "@/hooks/useGeminiLive";
import { AudioRecorder } from "@/lib/audio-utils";
import { Modality } from "@google/genai";
import PCMPlayer from "pcm-player"; // ✅ Import the library

export default function VoiceChat() {
  const [isRecording, setIsRecording] = useState(false);
  const audioRecorderRef = useRef<AudioRecorder | null>(null);

  // Use a ref for the player so it persists across renders
  const audioPlayerRef = useRef<PCMPlayer | null>(null);

  const { connected, startSession, stopSession, send, messages } =
    useGeminiLive({
      model: "gemini-2.0-flash-exp",
      config: {
        responseModalities: [Modality.AUDIO],
      },
    });

  // 1. Initialize Player on Mount
  // 1. Initialize Player on Mount
  useEffect(() => {
    // Initialize PCMPlayer with Gemini's specs
    audioPlayerRef.current = new PCMPlayer({
      inputCodec: "Int16", // Gemini sends 16-bit integers
      channels: 1, // Mono
      sampleRate: 24000, // 24kHz sample rate
      flushTime: 50,
      fftSize: 2048, // ✅ ADDED: Required by TS types (Power of 2: 1024, 2048, 4096)
    });
    audioPlayerRef.current.volume(5.0);
    return () => {
      // Cleanup
      if (audioPlayerRef.current) {
        audioPlayerRef.current.destroy();
        audioPlayerRef.current = null;
      }
    };
  }, []);
  // 2. Handle Incoming Audio
  // Add a ref to track how many messages we've already processed
  const processedRef = useRef(0);

  useEffect(() => {
    // If messages reset (e.g., disconnected), reset the cursor
    if (messages.length === 0) {
      processedRef.current = 0;
      return;
    }

    // Iterate ONLY over the new messages
    for (let i = processedRef.current; i < messages.length; i++) {
      const msg = messages[i];

      if (msg.serverContent?.modelTurn?.parts) {
        for (const part of msg.serverContent.modelTurn.parts) {
          if (
            part.inlineData &&
            part.inlineData.mimeType.startsWith("audio/")
          ) {
            // 1. Convert Base64 -> Uint8Array
            const base64 = part.inlineData.data;
            const binaryString = window.atob(base64);
            const bytes = new Uint8Array(binaryString.length);
            for (let b = 0; b < binaryString.length; b++) {
              bytes[b] = binaryString.charCodeAt(b);
            }

            // 2. Feed to PCM Player
            audioPlayerRef.current?.feed(bytes.buffer);
          }
        }
      }
    }

    // Update the cursor so we don't play these again
    processedRef.current = messages.length;
  }, [messages]);

  // 3. Start/Stop Mic
  const toggleMicrophone = async () => {
    if (isRecording) {
      audioRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      audioRecorderRef.current = new AudioRecorder((base64Data) => {
        if (connected) {
          if (connected) {
            send("hey i am sonu"); // Sending empty text or specific signal can trigger end-of-turn
          }
          send({
            mimeType: "audio/pcm;rate=16000",
            data: base64Data,
          });
        }
      });
      try {
        await audioRecorderRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Mic Error:", err);
      }
    }
  };

  // 4. Connect
  const handleConnect = async () => {
    try {
      // Very Important: Resume browser audio context on click
      // PCMPlayer exposes its context via `.audioCtx` usually, or just playing sound wakes it.
      // Typically the library handles this on the first .feed(), but explicit resume is safer.

      if (audioPlayerRef.current?.audioCtx?.state === "suspended") {
        await audioPlayerRef.current.audioCtx.resume();
      }

      const resp = await fetch(
        "http://localhost:3000/api/create-gemini-live-token",
        { method: "POST" },
      );
      const data = await resp.json();
      const apiKey = data.token?.name || data.accessToken;
      startSession(apiKey);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDisconnect = () => {
    stopSession();
    audioRecorderRef.current?.stop();
    setIsRecording(false);
  };

  // ... (JSX Return logic is the same as before) ...
  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      {/* ... Your JSX here ... */}
      <div className="flex space-x-4">
        {!connected ? (
          <button
            onClick={handleConnect}
            className="bg-blue-600 text-white py-2 px-4 rounded"
          >
            Connect
          </button>
        ) : (
          <button
            onClick={handleDisconnect}
            className="bg-gray-200 text-gray-800 py-2 px-4 rounded"
          >
            Disconnect
          </button>
        )}
      </div>
      <button
        onClick={toggleMicrophone}
        disabled={!connected}
        className="w-full py-4 bg-gray-100 rounded"
      >
        {isRecording ? "Stop Mic" : "Start Mic"}
      </button>
    </div>
  );
}
