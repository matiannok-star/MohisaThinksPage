import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Blog from './components/pages/Blog';
import Navigation from './components/Navigation';
import { Toaster } from './components/ui/toaster';
import { VoiceAgentProvider } from './components/voice/voice-agent';
import { VantaBackground } from './components/VantaBackground';

const App = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <HashRouter>
        <VoiceAgentProvider>
          <VantaBackground />
          <div className="relative z-10 min-h-screen text-foreground overflow-x-hidden selection:bg-primary/30 selection:text-primary-foreground">
            <Navigation />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/blog" element={<Blog />} />
              </Routes>
            </main>
            <Toaster />
          </div>
        </VoiceAgentProvider>
      </HashRouter>
    </ThemeProvider>
  );
};

export default App;
