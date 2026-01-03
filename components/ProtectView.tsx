import React, { useState } from 'react';
import { Upload, ShieldCheck, Zap, Download, Lock, FileImage, Server, ArrowRight } from 'lucide-react';
import { generateImageSignature } from '../services/geminiService';
import { embedWatermark } from '../utils/steganography'; // We keep this to simulate the server locally
import { WatermarkResult } from '../types';

export const ProtectView: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customText, setCustomText] = useState('');
  const [result, setResult] = useState<WatermarkResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  };

  // This function mimics the behavior of calling the Node.js API endpoint
  const protectImageViaAPI = async (file: File, meta: string) => {
    // SIMULATION: In a real app, this would be:
    // const formData = new FormData();
    // formData.append('image', file);
    // formData.append('metadata', meta);
    // await fetch('https://api.aethertag.io/v1/inject', { ... });
    
    // For this environment, we use the local util to generate the same result
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network latency
    const sig = await generateImageSignature(file);
    const fullSig = JSON.stringify({
       sig: sig,
       ts: Date.now(),
       meta: meta
    });
    const url = await embedWatermark(URL.createObjectURL(file), fullSig);
    return { url, sig };
  };

  const handleProtect = async () => {
    if (!file || !preview) return;
    setIsProcessing(true);

    try {
      const { url, sig } = await protectImageViaAPI(file, customText);

      const nameParts = file.name.split('.');
      nameParts.pop();
      const newFilename = `${nameParts.join('.')}_aether_protected.png`; 

      setResult({
        originalName: file.name,
        watermarkedName: newFilename,
        dataUrl: url,
        signature: sig,
        timestamp: Date.now()
      });

    } catch (error) {
      console.error(error);
      alert("API Error: Failed to process image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result.dataUrl;
    link.download = result.watermarkedName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      
      {/* Title Section */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-6">
        <div>
           <h2 className="text-2xl font-bold text-white tracking-tight">Protect Asset</h2>
           <p className="text-gray-500 text-sm mt-1">Upload files to the AetherTag Secure Enclave.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-gray-900 border border-gray-800 rounded text-xs font-mono text-gray-400">
           <Server size={12} />
           <span>CONNECTED: US-EAST-1</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Column */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* File Drop Area */}
          <div className="relative group">
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
            <div className={`
              relative z-10 h-80 rounded-lg border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-4
              ${file 
                ? 'bg-gray-900/50 border-gray-700' 
                : 'bg-[#09090b] border-gray-800 hover:border-gray-600 hover:bg-gray-900'}
            `}>
              {preview ? (
                <div className="relative w-full h-full p-4 flex items-center justify-center">
                   <img src={preview} alt="Preview" className="max-h-full max-w-full object-contain shadow-xl" />
                   <div className="absolute bottom-4 right-4 bg-black text-white text-xs font-mono px-2 py-1 rounded opacity-75">
                     {(file!.size / 1024 / 1024).toFixed(2)} MB
                   </div>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mb-2">
                    <Upload className="w-8 h-8 text-gray-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-medium">Drag & Drop or Click to Upload</p>
                    <p className="text-gray-600 text-sm mt-1">Supports PNG, JPG, WEBP (Max 25MB)</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Config */}
          <div className="bg-[#111] border border-gray-800 p-6 rounded-lg space-y-4">
             <div className="flex items-center justify-between">
               <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Metadata Injection</label>
               <span className="text-xs text-gray-600 font-mono">OPTIONAL</span>
             </div>
             <div className="relative">
                <input 
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="e.g. Copyright 2024, Project Alpha"
                  className="w-full bg-black border border-gray-800 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors font-mono"
                />
             </div>
             
             <button
              onClick={handleProtect}
              disabled={!file || isProcessing}
              className={`w-full py-4 rounded font-bold text-sm tracking-widest transition-all flex items-center justify-center gap-3 uppercase
                ${!file || isProcessing 
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                  : 'bg-white text-black hover:bg-gray-200'}
              `}
            >
              {isProcessing ? (
                <>
                  <Zap className="w-4 h-4 animate-pulse" />
                  Sending to API...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Encrypt & Embed
                </>
              )}
            </button>
          </div>

        </div>

        {/* Output Column */}
        <div className="lg:col-span-5">
           <div className={`h-full border border-gray-800 rounded-lg bg-[#111] p-6 flex flex-col transition-all duration-500 ${result ? 'opacity-100' : 'opacity-50 grayscale'}`}>
              
              <div className="flex items-center gap-3 mb-8 border-b border-gray-800 pb-4">
                <div className={`w-3 h-3 rounded-full ${result ? 'bg-green-500' : 'bg-gray-700'}`}></div>
                <h3 className="font-bold text-white uppercase tracking-wider text-sm">Output Console</h3>
              </div>

              {result ? (
                <div className="flex-1 flex flex-col space-y-6">
                   <div className="bg-black border border-gray-800 p-4 rounded font-mono text-xs space-y-2">
                      <div className="flex justify-between">
                         <span className="text-gray-500">STATUS</span>
                         <span className="text-green-500">200 OK</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-gray-500">LATENCY</span>
                         <span className="text-white">124ms</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-gray-500">ALGORITHM</span>
                         <span className="text-white">LSB_SHA256</span>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-xs text-gray-500 font-bold uppercase">Fingerprint Hash</label>
                      <div className="bg-gray-900 p-3 rounded border border-gray-800 text-white font-mono text-xs break-all">
                        {result.signature}
                      </div>
                   </div>

                   <div className="mt-auto pt-6">
                      <button 
                        onClick={downloadImage}
                        className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 py-3 rounded font-bold flex items-center justify-center gap-2 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download Artifact
                      </button>
                   </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
                   <FileImage className="w-12 h-12 text-gray-700" />
                   <p className="text-gray-600 text-sm">
                     Waiting for processed data from API...
                   </p>
                </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
};
