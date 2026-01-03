import React, { useState } from 'react';
import { Upload, ScanEye, Check, X, ShieldCheck, Fingerprint, Calendar, FileCheck, AlertTriangle, Terminal } from 'lucide-react';
import { extractWatermark } from '../utils/steganography';
import { DetectionResult } from '../types';

export const DetectView: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  };

  const handleDetect = async () => {
    if (!file || !preview) return;
    setIsAnalyzing(true);
    setResult(null);

    try {
      const filenameHasTag = file.name.includes('_aether_protected');
      const rawWatermark = await extractWatermark(preview);
      
      let parsedData;
      try {
        parsedData = rawWatermark ? JSON.parse(rawWatermark) : null;
      } catch (e) {
        parsedData = { sig: rawWatermark };
      }

      await new Promise(r => setTimeout(r, 600));

      if (parsedData && parsedData.sig) {
        setResult({
          detected: true,
          signature: parsedData.sig,
          timestamp: parsedData.ts,
          filenameVerified: filenameHasTag
        });
      } else {
        setResult({
          detected: false,
          filenameVerified: filenameHasTag
        });
      }

    } catch (error) {
      console.error(error);
      alert("Analysis failed.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
       
      <div className="flex items-center justify-between border-b border-gray-800 pb-6">
        <div>
           <h2 className="text-2xl font-bold text-white tracking-tight">Verify Integrity</h2>
           <p className="text-gray-500 text-sm mt-1">Decoding engine v1.0.4</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Input */}
        <div className="space-y-6">
           <div className="relative group h-64">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className={`h-full border-2 border-dashed transition-all duration-300 rounded-lg flex flex-col items-center justify-center bg-[#09090b] ${file ? 'border-white/30' : 'border-gray-800 hover:border-gray-600'}`}>
                {preview ? (
                   <div className="relative w-full h-full p-4 flex items-center justify-center">
                      <img src={preview} alt="Preview" className="max-h-full max-w-full object-contain" />
                      {isAnalyzing && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                          <div className="font-mono text-xs text-white animate-pulse">DECODING BITSTREAM...</div>
                        </div>
                      )}
                   </div>
                ) : (
                  <>
                    <ScanEye className="w-8 h-8 text-gray-600 mb-2" />
                    <span className="text-xs font-mono text-gray-500">SELECT SOURCE IMAGE</span>
                  </>
                )}
              </div>
            </div>

            <button
            onClick={handleDetect}
            disabled={!file || isAnalyzing}
            className={`w-full py-3 rounded font-bold text-xs font-mono tracking-widest transition-all uppercase border
              ${!file || isAnalyzing
                ? 'bg-black border-gray-800 text-gray-600 cursor-not-allowed' 
                : 'bg-white border-white text-black hover:bg-gray-200'}
            `}
          >
            {isAnalyzing ? "Processing..." : "Run Diagnostics"}
          </button>
        </div>

        {/* Right: Output */}
        <div>
           {result ? (
              result.detected ? (
                <div className="bg-[#111] border border-gray-800 rounded-lg h-full p-6 flex flex-col animate-slide-up">
                    <div className="flex items-center gap-2 mb-6 text-emerald-500">
                      <ShieldCheck className="w-5 h-5" />
                      <span className="font-bold text-sm uppercase tracking-wider">Verified Authentic</span>
                    </div>

                    <div className="space-y-4">
                       <div className="space-y-1">
                          <label className="text-[10px] text-gray-500 font-bold uppercase">Signature ID</label>
                          <div className="font-mono text-sm text-white break-all bg-black p-3 border border-gray-800 rounded">
                            {result.signature}
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                             <label className="text-[10px] text-gray-500 font-bold uppercase">Timestamp</label>
                             <div className="font-mono text-xs text-gray-300">
                                {result.timestamp ? new Date(result.timestamp).toLocaleDateString() : 'N/A'}
                             </div>
                          </div>
                           <div className="space-y-1">
                             <label className="text-[10px] text-gray-500 font-bold uppercase">Filename Check</label>
                             <div className={`font-mono text-xs ${result.filenameVerified ? 'text-emerald-500' : 'text-yellow-500'}`}>
                                {result.filenameVerified ? 'MATCH' : 'MISMATCH'}
                             </div>
                          </div>
                       </div>
                    </div>
                </div>
              ) : (
                <div className="bg-[#111] border border-gray-800 rounded-lg h-full p-6 flex flex-col animate-slide-up">
                    <div className="flex items-center gap-2 mb-6 text-rose-500">
                      <AlertTriangle className="w-5 h-5" />
                      <span className="font-bold text-sm uppercase tracking-wider">No Signature</span>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Deep scan completed. No LSB steganographic data was found in the provided image.
                    </p>
                </div>
              )
           ) : (
             <div className="h-full border border-gray-800 border-dashed rounded-lg flex flex-col items-center justify-center p-8 text-gray-700">
                <Terminal className="w-8 h-8 mb-3 opacity-50" />
                <p className="text-xs font-mono">Awaiting Analysis...</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
