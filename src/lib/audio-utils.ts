// lib/audio-utils.ts

/**
 * 1. WORKLET CODE (For Microphone)
 * Keeps the microphone running smoothly on a separate thread.
 */
const WorkletProcessorCode = `
class PCMProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bufferSize = 4096;
    this.buffer = new Float32Array(this.bufferSize);
    this.index = 0;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (!input || !input.length) return true;
    
    const channelData = input[0];
    
    for (let i = 0; i < channelData.length; i++) {
      this.buffer[this.index++] = channelData[i];
      if (this.index >= this.bufferSize) {
        this.port.postMessage(this.buffer);
        this.index = 0;
      }
    }
    return true;
  }
}
registerProcessor('pcm-processor', PCMProcessor);
`;

/**
 * 2. AUDIO RECORDER (Microphone)
 * Captures 16kHz audio for Gemini.
 */
export class AudioRecorder {
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private workletNode: AudioWorkletNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private onDataAvailable: (base64: string) => void;

  constructor(onDataAvailable: (base64: string) => void) {
    this.onDataAvailable = onDataAvailable;
  }

  async start() {
    this.audioContext = new window.AudioContext({ sampleRate: 16000 });

    const blob = new Blob([WorkletProcessorCode], {
      type: "application/javascript",
    });
    const workletUrl = URL.createObjectURL(blob);
    await this.audioContext.audioWorklet.addModule(workletUrl);

    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    this.source = this.audioContext.createMediaStreamSource(this.mediaStream);

    this.workletNode = new AudioWorkletNode(this.audioContext, "pcm-processor");

    this.workletNode.port.onmessage = (event) => {
      // Float32 -> Int16 -> Base64
      const float32Buffer = event.data;
      const pcm16 = this.floatTo16BitPCM(float32Buffer);
      const base64 = this.arrayBufferToBase64(pcm16);
      this.onDataAvailable(base64);
    };

    this.source.connect(this.workletNode);
    // DO NOT connect to destination (speakers) to avoid echo
  }

  stop() {
    this.source?.disconnect();
    this.workletNode?.disconnect();
    this.mediaStream?.getTracks().forEach((track) => track.stop());
    this.audioContext?.close();
    this.source = null;
    this.workletNode = null;
    this.audioContext = null;
  }

  private floatTo16BitPCM(input: Float32Array) {
    const output = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]));
      output[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return output.buffer;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}
