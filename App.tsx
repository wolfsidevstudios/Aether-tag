import React, { useState } from 'react';
import { AppMode } from './types';
import { ProtectView } from './components/ProtectView';
import { DetectView } from './components/DetectView';
import { AboutView } from './components/AboutView';
import { ApiView } from './components/ApiView';
import { Ghost, Shield, Search, Info, Terminal } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.PROTECT);

  const renderContent = () => {
    switch (mode) {
      case AppMode.PROTECT:
        return <ProtectView />;
      case AppMode.DETECT:
        return <DetectView />;
      case AppMode.ABOUT:
        return <AboutView />;
      case AppMode.API:
        return <ApiView />;
      default:
        return <ProtectView />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-gray-200 font-sans selection:bg-primary/30">
      
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass-panel border-b-0 border-b-gray-800">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-secondary to-primary rounded-lg flex items-center justify-center shadow-lg shadow-purple-900/20">
              <Ghost className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">AetherTag</h1>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Steganography Tool</span>
            </div>
          </div>
          
          <nav className="flex bg-surfaceHighlight rounded-full p-1 border border-gray-800">
            <button
              onClick={() => setMode(AppMode.PROTECT)}
              className={`px-4 md:px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2
                ${mode === AppMode.PROTECT 
                  ? 'bg-secondary text-white shadow-lg shadow-secondary/20' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'}
              `}
            >
              <Shield className="w-4 h-4" />
              <span className="hidden md:inline">Protect</span>
            </button>
            <button
              onClick={() => setMode(AppMode.DETECT)}
              className={`px-4 md:px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2
                ${mode === AppMode.DETECT 
                  ? 'bg-primary text-black shadow-lg shadow-primary/20' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'}
              `}
            >
              <Search className="w-4 h-4" />
              <span className="hidden md:inline">Detect</span>
            </button>
            <button
              onClick={() => setMode(AppMode.API)}
              className={`px-4 md:px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2
                ${mode === AppMode.API 
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'}
              `}
            >
              <Terminal className="w-4 h-4" />
              <span className="hidden md:inline">API</span>
            </button>
            <button
              onClick={() => setMode(AppMode.ABOUT)}
              className={`px-4 md:px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2
                ${mode === AppMode.ABOUT 
                  ? 'bg-white text-black shadow-lg shadow-white/20' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'}
              `}
            >
              <Info className="w-4 h-4" />
              <span className="hidden md:inline">About</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
        <div className="relative">
          {/* Background Decorative Blobs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px] -z-10 pointer-events-none"></div>

          {renderContent()}
        </div>
      </main>

      <footer className="fixed bottom-6 left-6 text-xs text-gray-600 font-mono">
        SYSTEM_STATUS: ONLINE<br/>
        ENCRYPTION: LSB_STEGANOGRAPHY_V1
      </footer>

    </div>
  );
};

export default App;