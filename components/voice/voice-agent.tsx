import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Mic, MicOff, X, Minimize2, Maximize2, Activity } from "lucide-react";
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";

// Audio Helpers
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array) {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

interface VoiceAgentContextType {
  isActive: boolean;
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  startSession: () => Promise<void>;
  stopSession: () => void;
  toggleSession: () => void;
  volume: number;
}

const VoiceAgentContext = createContext<VoiceAgentContextType | null>(null);

export const useVoiceAgent = () => {
  const context = useContext(VoiceAgentContext);
  if (!context) {
    throw new Error("useVoiceAgent must be used within a VoiceAgentProvider");
  }
  return context;
};

export const VoiceAgentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [volume, setVolume] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<Promise<any> | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startSession = async () => {
    if (isActive) return;

    try {
      setIsActive(true);
      setIsMinimized(false);
      setStatus('connecting');

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      inputAudioContextRef.current = new AudioContextClass({ sampleRate: 16000 });
      outputAudioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
      nextStartTimeRef.current = 0;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
            responseModalities: [Modality.AUDIO],
            systemInstruction: "You are Mohisa AI, a friendly automation expert. You help businesses automate workflows. Keep responses concise, energetic, and helpful.",
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
            },
        },
        callbacks: {
            onopen: () => {
                setStatus('connected');
                const inputCtx = inputAudioContextRef.current;
                if (!inputCtx) return;

                const source = inputCtx.createMediaStreamSource(stream);
                const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
                
                scriptProcessor.onaudioprocess = (e) => {
                    const inputData = e.inputBuffer.getChannelData(0);
                    
                    // Calculate volume for visualizer
                    let sum = 0;
                    for (let i = 0; i < inputData.length; i++) {
                        sum += inputData[i] * inputData[i];
                    }
                    const rms = Math.sqrt(sum / inputData.length);
                    setVolume(Math.min(rms * 10, 1)); // Normalize roughly 0-1

                    const pcmBlob = createBlob(inputData);
                    
                    if (sessionRef.current) {
                        sessionRef.current.then(session => {
                            session.sendRealtimeInput({ media: pcmBlob });
                        });
                    }
                };
                
                source.connect(scriptProcessor);
                scriptProcessor.connect(inputCtx.destination);
            },
            onmessage: async (message: LiveServerMessage) => {
                const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                
                if (base64Audio && outputAudioContextRef.current) {
                    const ctx = outputAudioContextRef.current;
                    nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                    
                    const audioBuffer = await decodeAudioData(
                        decode(base64Audio),
                        ctx,
                        24000,
                        1
                    );
                    
                    const source = ctx.createBufferSource();
                    source.buffer = audioBuffer;
                    source.connect(ctx.destination);
                    
                    source.addEventListener('ended', () => {
                        sourcesRef.current.delete(source);
                    });
                    
                    source.start(nextStartTimeRef.current);
                    nextStartTimeRef.current += audioBuffer.duration;
                    sourcesRef.current.add(source);
                }
            },
            onclose: () => {
                setStatus('disconnected');
                setIsActive(false);
            },
            onerror: (err) => {
                console.error("Session error", err);
                setStatus('error');
                setIsActive(false);
            }
        }
      });

      sessionRef.current = sessionPromise;

    } catch (e) {
      console.error("Failed to start session", e);
      setStatus('error');
      setIsActive(false);
    }
  };

  const stopSession = () => {
    setIsActive(false);
    setStatus('disconnected');
    setVolume(0);
    
    if (inputAudioContextRef.current) inputAudioContextRef.current.close();
    if (outputAudioContextRef.current) outputAudioContextRef.current.close();
    
    sourcesRef.current.forEach(source => source.stop());
    sourcesRef.current.clear();

    sessionRef.current = null;
  };

  const toggleSession = () => {
    if (isActive) {
      stopSession();
    } else {
      startSession();
    }
  };

  // Visualizer Effect
  useEffect(() => {
    if (!isActive || !canvasRef.current || isMinimized) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const draw = () => {
      time += 0.05;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Dynamic radius based on volume
      const baseRadius = 30;
      const pulse = Math.sin(time) * 3;
      const radius = baseRadius + pulse + (volume * 40);

      // Core
      const gradient = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, radius + 20);
      gradient.addColorStop(0, 'rgba(6, 182, 212, 0.9)');
      gradient.addColorStop(0.6, 'rgba(139, 92, 246, 0.5)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Rings
      ctx.strokeStyle = `rgba(6, 182, 212, ${0.3 + volume})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, 50 + (volume * 20), 15 + (volume * 10), time, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = `rgba(236, 72, 153, ${0.3 + volume})`;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, 50 + (volume * 20), 15 + (volume * 10), -time, 0, Math.PI * 2);
      ctx.stroke();

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationId);
  }, [isActive, volume, isMinimized]);

  return (
    <VoiceAgentContext.Provider value={{ isActive, status, startSession, stopSession, toggleSession, volume }}>
      {children}
      
      {/* Floating Interface */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 pointer-events-none">
        
        {isActive && (
           <Card className={`pointer-events-auto transition-all duration-300 border-primary/20 bg-slate-950/90 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden ${isMinimized ? 'w-64 h-20' : 'w-80 h-96'}`}>
              
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                  <span className="text-sm font-semibold">Mohisa AI</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsMinimized(!isMinimized)}>
                    {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400 hover:text-red-500" onClick={stopSession}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              {!isMinimized && (
                <div className="flex-1 relative flex flex-col items-center justify-center p-6">
                   <canvas ref={canvasRef} width={280} height={200} className="w-full h-full" />
                   <p className="absolute bottom-16 text-xs text-muted-foreground animate-pulse">
                     {status === 'connecting' ? 'Connecting...' : status === 'connected' ? 'Listening...' : 'Disconnected'}
                   </p>
                   
                   <div className="absolute bottom-6">
                      <Button variant="destructive" size="sm" onClick={stopSession} className="text-xs h-8 px-4 rounded-full shadow-lg shadow-red-500/20">
                        <MicOff className="w-3 h-3 mr-2" /> End Session
                      </Button>
                   </div>
                </div>
              )}

              {/* Minimized Content */}
              {isMinimized && (
                <div className="flex-1 flex items-center px-4 gap-3">
                   <Activity className={`w-5 h-5 ${status === 'connected' ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} />
                   <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all duration-100" style={{ width: `${volume * 100}%` }} />
                   </div>
                </div>
              )}
           </Card>
        )}

        {/* FAB Trigger */}
        {!isActive && (
           <Button 
             className="pointer-events-auto h-14 w-14 rounded-full shadow-lg shadow-primary/25 bg-primary hover:bg-primary/90 text-primary-foreground animate-in zoom-in duration-300"
             onClick={startSession}
           >
             <Mic className="w-6 h-6" />
           </Button>
        )}
      </div>
    </VoiceAgentContext.Provider>
  );
};