import React from 'react';
import { Cpu, EyeOff, Shield, Binary, FileSearch, Fingerprint, Info, ScanEye, Hash } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surfaceHighlight border border-gray-700 mb-4 shadow-xl">
          <Info className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white">
          The Science of Invisible Ink
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          AetherTag combines secure cryptographic hashing with classic steganography to create a digital chain of custody for your assets without relying on external AI services.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Card 1: Hashing */}
        <div className="glass-panel p-8 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Hash size={120} />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-6 text-secondary">
              <Fingerprint className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">1. Digital Fingerprinting</h3>
            <p className="text-gray-400 leading-relaxed">
              Before watermarking, we generate a unique <strong>SHA-256 Hash</strong> of your image. This cryptographic "fingerprint" is mathematically unique to your specific file. This ensures that the watermark contains a secure and verifiable ID generated directly from the image's raw data.
            </p>
          </div>
        </div>

        {/* Card 2: LSB */}
        <div className="glass-panel p-8 rounded-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Binary size={120} />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-6 text-primary">
              <EyeOff className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">2. LSB Encoding</h3>
            <p className="text-gray-400 leading-relaxed">
              We use <strong>Least Significant Bit (LSB) Steganography</strong>. We take the generated fingerprint and convert it into binary. Then, we modify the very last bit of the Blue color channel in specific pixels. The color change (e.g., from Blue 255 to 254) is imperceptible to the human eye but readable by code.
            </p>
          </div>
        </div>
      </div>

      {/* Process Flow */}
      <div className="glass-panel p-8 rounded-2xl border-t border-gray-800">
        <h3 className="text-xl font-bold text-white mb-8 text-center">The Verification Lifecycle</h3>
        
        <div className="grid md:grid-cols-3 gap-8 relative">
           {/* Connector Line */}
           <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>

           {/* Step 1 */}
           <div className="relative flex flex-col items-center text-center space-y-4">
             <div className="w-24 h-24 rounded-full bg-surface border border-gray-700 flex items-center justify-center z-10 shadow-lg">
                <Shield className="w-10 h-10 text-secondary" />
             </div>
             <div>
               <h4 className="font-bold text-white">Protection</h4>
               <p className="text-sm text-gray-500 mt-2">Signature embedded into pixel data & file renamed.</p>
             </div>
           </div>

           {/* Step 2 */}
            <div className="relative flex flex-col items-center text-center space-y-4">
             <div className="w-24 h-24 rounded-full bg-surface border border-gray-700 flex items-center justify-center z-10 shadow-lg">
                <FileSearch className="w-10 h-10 text-gray-400" />
             </div>
             <div>
               <h4 className="font-bold text-white">Distribution</h4>
               <p className="text-sm text-gray-500 mt-2">Image travels across the web. Renaming doesn't break the code.</p>
             </div>
           </div>

           {/* Step 3 */}
            <div className="relative flex flex-col items-center text-center space-y-4">
             <div className="w-24 h-24 rounded-full bg-surface border border-gray-700 flex items-center justify-center z-10 shadow-lg">
                <ScanEye className="w-10 h-10 text-primary" />
             </div>
             <div>
               <h4 className="font-bold text-white">Detection</h4>
               <p className="text-sm text-gray-500 mt-2">AetherTag scans the pixel bits to reconstruct the hidden signature.</p>
             </div>
           </div>
        </div>
      </div>

      <div className="text-center p-6 border border-yellow-500/20 bg-yellow-500/5 rounded-xl">
        <p className="text-yellow-200/80 text-sm">
          <strong>Note:</strong> This method relies on lossless compression (PNG). Converting to JPEG or resizing the image will destroy the delicate LSB data, effectively "breaking" the seal and indicating tampering.
        </p>
      </div>

    </div>
  );
};
