import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import LandingPage from './components/pages/LandingPage';
import Blog from './components/pages/Blog';
import Navigation from './components/Navigation';
import { Toaster } from './components/ui/toaster';
import { VoiceAgentProvider } from './components/voice/voice-agent';

const App = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <HashRouter>
        <VoiceAgentProvider>
          <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30 selection:text-primary-foreground">
            <Navigation />
            <main>
              <Routes>
                <Route path="/" element={<LandingPage />} />
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