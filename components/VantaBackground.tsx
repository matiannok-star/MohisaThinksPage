import React, { useEffect, useRef, useState } from "react";

// Declare Vanta types for TypeScript
declare global {
  interface Window {
    VANTA?: {
      NET: (options: VantaNetOptions) => VantaEffect;
    };
    THREE?: unknown;
  }
}

interface VantaNetOptions {
  el: HTMLElement | string;
  mouseControls: boolean;
  touchControls: boolean;
  gyroControls: boolean;
  minHeight: number;
  minWidth: number;
  scale: number;
  scaleMobile: number;
  color: number | string;
  backgroundColor: number | string;
  points: number;
  maxDistance: number;
  spacing: number;
  showDots: boolean;
}

interface VantaEffect {
  destroy: () => void;
  setOptions: (options: Partial<VantaNetOptions>) => void;
}

export const VantaBackground = () => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<VantaEffect | null>(null);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  // Load scripts dynamically
  useEffect(() => {
    // Check if scripts are already loaded
    if (window.THREE && window.VANTA) {
      setScriptsLoaded(true);
      return;
    }

    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        // Check if script already exists in document
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }

        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject();
        document.head.appendChild(script);
      });
    };

    const initScripts = async () => {
      try {
        await loadScript("https://cdn.jsdelivr.net/npm/three@0.134.0/build/three.min.js");
        await loadScript("https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js");
        setScriptsLoaded(true);
      } catch (error) {
        console.warn("Failed to load Vanta scripts:", error);
      }
    };

    initScripts();

    return () => {
      // No cleanup for scripts needed as they are global
    };
  }, []);

  // Initialize Vanta effect
  useEffect(() => {
    if (!scriptsLoaded || !vantaRef.current || !window.VANTA) return;

    // Colors from tailwind config in index.html
    const primaryColor = 0x06b6d4; // Cyan
    const backgroundColor = 0x020617; // Slate-950

    const isMobile = window.innerWidth < 768;

    try {
      if (!vantaEffect.current) {
        vantaEffect.current = window.VANTA.NET({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: primaryColor,
          backgroundColor: backgroundColor,
          points: isMobile ? 8 : 12,
          maxDistance: isMobile ? 18 : 22,
          spacing: isMobile ? 17 : 15,
          showDots: true,
        });
      }
    } catch (error) {
      console.warn("Failed to initialize Vanta effect:", error);
    }

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, [scriptsLoaded]);

  return (
    <div
      ref={vantaRef}
      id="vanta-bg"
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{
        background: "#020617",
      }}
    />
  );
};