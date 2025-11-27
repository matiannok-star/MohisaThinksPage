import React, { useState, useRef, useEffect } from 'react';
import { Button } from "../ui/button";
import { Mic, MicOff, Radio, Sparkles, Volume2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";

// Audio processing helpers
const createBlob = (data: Float32Array): Blob => {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return new Blob([int16], { type: 'audio/pcm;rate=16000' });
};

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

const VoiceAgent = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [apiKey, setApiKey] = useState('');
  const [hasKey, setHasKey] = useState(false);
  
  // Audio Refs
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null); // To hold the live session

  // Canvas Ref for visualizer
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Check for API key (Simulated check)
  useEffect(() => {
    // In a real app, this would check process.env or a secure backend.
    // For this demo, we check if it's available or ask user.
    if (process.env.API_KEY) {
        setApiKey(process.env.API_KEY);
        setHasKey(true);
    }
  }, []);

  // Visualizer Animation
  useEffect(() => {
    if (!isActive || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId: number;
    let time = 0;

    const draw = () => {
      if (!ctx) return;
      time += 0.05;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Draw glowing orb
      const radius = 50 + Math.sin(time) * 10;
      const gradient = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, radius);
      gradient.addColorStop(0, 'rgba(6, 182, 212, 1)'); // Cyan
      gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.5)'); // Violet
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw orbital rings
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, 80, 20, time, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(236, 72, 153, 0.3)';
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, 80, 20, -time, 0, Math.PI * 2);
      ctx.stroke();

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationId);
  }, [isActive]);


  const startSession = async () => {
    if (!apiKey) {
       // In a real deployment, we would handle this gracefully.
       // For this demo, we assume the environment variable is set as per strict instructions.
       console.error("No API Key found");
       return; 
    }

    try {
      setIsActive(true);
      setStatus('connecting');

      // Initialize Audio Contexts
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      nextStartTimeRef.current = 0;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const ai = new GoogleGenAI({ apiKey });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
            responseModalities: [Modality.AUDIO],
            systemInstruction: "You are Mohisa AI, a friendly and futuristic automation assistant. You help users understand how to automate workflows using n8n, Zapier, and AI. Keep responses concise and energetic.",
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
                    // Simple threshold to avoid sending silence constantly? 
                    // For now, stream everything as per guide.
                    const pcmBlob = createBlob(inputData);
                    
                    // Critical: resolve promise then send
                    sessionPromise.then(session => {
                        session.sendRealtimeInput({
                            media: {
                                mimeType: 'audio/pcm;rate=16000',
                                data: window.btoa(
                                    String.fromCharCode(...new Uint8Array(new Int16Array(inputData.map(n => n * 32768)).buffer))
                                )
                            }
                        });
                    });
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
                    source.connect(ctx.destination); // Simple connection to output
                    
                    source.addEventListener('ended', () => {
                        sourcesRef.current.delete(source);
                    });
                    
                    source.start(nextStartTimeRef.current);
                    nextStartTimeRef.current += audioBuffer.duration;
                    sourcesRef.current.add(source);
                }
            },
            onclose: () => {
                console.log("Session closed");
                setStatus('disconnected');
            },
            onerror: (err) => {
                console.error("Session error", err);
                setStatus('error');
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
    
    // Cleanup Audio
    if (inputAudioContextRef.current) inputAudioContextRef.current.close();
    if (outputAudioContextRef.current) outputAudioContextRef.current.close();
    
    // Close Session if we could (the current SDK abstraction handles close via callback mainly, 
    // but in a real app we'd call a close method on the session object if available).
    // Assuming simple disconnect for this UI demo.
    window.location.reload(); // Hard reset for demo purposes to clear audio streams cleanly
  };

  return (
    <section className="py-24 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
        
        <div className="container mx-auto px-4 text-center z-10 relative">
            <Badge variant="outline" className="mb-4 border-primary/50 text-primary">
                <Sparkles className="w-3 h-3 mr-2" /> AI IN ACTION
            </Badge>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                See <span className="text-primary">Automation</span> Live
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
                Watch how AI-powered automation responds to real business challenges
            </p>

            <div className="max-w-4xl mx-auto relative group">
                {/* Main Interactive Card */}
                <div className="glass-card rounded-3xl p-8 md:p-12 border border-primary/20 shadow-2xl relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center">
                    
                    {/* Header */}
                    <div className="absolute top-6 left-6 flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`} />
                        <span className="text-sm font-semibold text-muted-foreground">
                            {status === 'connected' ? 'AI Automation Assistant Active' : 'AI Automation Assistant'}
                        </span>
                    </div>

                    <div className="absolute top-6 right-6 flex gap-3">
                         <Badge variant="secondary" className="bg-primary text-white hover:bg-primary/90 cursor-pointer">
                            <Radio className="w-3 h-3 mr-1" /> Chat
                         </Badge>
                         <Badge variant="outline" className="cursor-pointer">
                             <Workflow className="w-3 h-3 mr-1" /> Workflow
                         </Badge>
                         <Badge variant="outline" className="cursor-pointer">
                             <BarChart3 className="w-3 h-3 mr-1" /> Analysis
                         </Badge>
                    </div>

                    {/* Central Visualizer */}
                    <div className="relative w-64 h-64 flex items-center justify-center mb-8">
                        <canvas ref={canvasRef} width={300} height={300} className="absolute inset-0 w-full h-full" />
                        {!isActive && (
                            <div className="z-10 text-center animate-pulse-slow">
                                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                                    <Bot className="w-10 h-10 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold">Start a Conversation</h3>
                                <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
                                    Ask me about automating your business processes, integrating tools, or building custom workflows!
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="w-full max-w-md mx-auto relative z-10">
                         {isActive ? (
                             <Button 
                                variant="outline" 
                                size="lg" 
                                onClick={stopSession}
                                className="w-full border-red-500/50 text-red-500 hover:bg-red-500/10 hover:text-red-400"
                            >
                                <MicOff className="w-4 h-4 mr-2" /> End Session
                             </Button>
                         ) : (
                             <div className="relative">
                                 <input 
                                    type="text" 
                                    placeholder="Ask AI to automate anything..." 
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-full py-4 pl-6 pr-14 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                                    disabled
                                 />
                                 <Button 
                                    className="absolute right-2 top-2 rounded-full w-10 h-10 p-0 bg-primary hover:bg-primary/90"
                                    onClick={startSession}
                                 >
                                    <Mic className="w-5 h-5" />
                                 </Button>
                             </div>
                         )}
                    </div>
                </div>

                {/* Decorative floating elements */}
                <div className="absolute -left-12 top-1/2 -translate-y-1/2 hidden xl:block space-y-4">
                    <CardFloat title="Real-time Processing" subtitle="Instant responses and automation triggers" />
                </div>
                <div className="absolute -right-12 top-1/2 -translate-y-1/2 hidden xl:block space-y-4">
                    <CardFloat title="Multi-tool Integration" subtitle="Connect 100+ apps and services" />
                    <CardFloat title="Smart Decision Making" subtitle="AI-powered logic and workflows" />
                </div>
            </div>
        </div>
    </section>
  );
};

// Helper sub-component for floating cards
import { Bot, BarChart3, Workflow } from "lucide-react";

const CardFloat = ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div className="glass-card p-4 rounded-xl border border-white/10 w-64 transform hover:scale-105 transition-transform duration-300">
        <h4 className="text-sm font-bold text-white mb-1">{title}</h4>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
);

export default VoiceAgent;