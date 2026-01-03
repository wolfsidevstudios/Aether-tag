import React, { useState } from 'react';
import { Terminal, Copy, Check, Server, Globe, Lock, Code } from 'lucide-react';

export const ApiView: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const ENDPOINT_URL = "https://api.aethertag.io/v1/inject";

  const generateKey = () => {
    const prefix = "sk_live_";
    const random = Array.from({ length: 32 }, () => Math.floor(Math.random() * 36).toString(36)).join('');
    setApiKey(`${prefix}${random}`);
  };

  const copyToClipboard = (text: string, setter: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-gray-800 pb-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white tracking-tight">API Dashboard</h2>
          <p className="text-gray-500 max-w-xl">
            Programmatic access to the AetherTag steganography engine. Integrate invisible watermarking directly into your image generation pipelines.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-900/20 border border-green-900/50 rounded text-green-500 text-xs font-mono font-bold uppercase tracking-wider">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          System Operational
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Col: Credentials */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#111] border border-gray-800 rounded-lg p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4 text-gray-500" />
              Access Credentials
            </h3>
            
            {apiKey ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 block mb-1.5">Your Secret Key</label>
                  <div className="relative group">
                    <code className="block w-full bg-black border border-gray-700 rounded p-3 text-emerald-400 text-xs font-mono break-all">
                      {apiKey}
                    </code>
                    <button 
                      onClick={() => copyToClipboard(apiKey, setCopiedKey)}
                      className="absolute right-2 top-2 p-1.5 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition-colors"
                    >
                      {copiedKey ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
                <div className="bg-yellow-900/10 border border-yellow-900/30 p-3 rounded">
                  <p className="text-yellow-600 text-xs leading-relaxed">
                    <strong>Security Warning:</strong> This key grants full write access. Do not expose it in client-side code.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Server className="w-6 h-6 text-gray-600" />
                </div>
                <button
                  onClick={generateKey}
                  className="w-full py-2 bg-white hover:bg-gray-200 text-black font-bold text-sm rounded transition-colors"
                >
                  Generate API Key
                </button>
              </div>
            )}
          </div>

          <div className="bg-[#111] border border-gray-800 rounded-lg p-6">
             <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Rate Limits</h3>
             <ul className="space-y-3">
               <li className="flex justify-between text-sm">
                 <span className="text-gray-500">Tier</span>
                 <span className="text-white font-mono">PRO_TRIAL</span>
               </li>
               <li className="flex justify-between text-sm">
                 <span className="text-gray-500">Requests</span>
                 <span className="text-white font-mono">5,000 / hr</span>
               </li>
               <li className="flex justify-between text-sm">
                 <span className="text-gray-500">Concurrent</span>
                 <span className="text-white font-mono">50</span>
               </li>
             </ul>
          </div>
        </div>

        {/* Right Col: Documentation */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Endpoint Card */}
          <div className="bg-[#111] border border-gray-800 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-800 bg-gray-900/30 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-500" />
                Public Endpoint
              </h3>
              <span className="text-[10px] font-mono bg-blue-900/20 text-blue-400 border border-blue-900/40 px-2 py-0.5 rounded">
                POST
              </span>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-black border border-gray-700 rounded px-4 py-3 font-mono text-sm text-gray-300">
                  {ENDPOINT_URL}
                </div>
                <button 
                  onClick={() => copyToClipboard(ENDPOINT_URL, setCopiedUrl)}
                  className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white px-4 py-3 rounded font-medium text-sm transition-colors"
                >
                  {copiedUrl ? "Copied" : "Copy"}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                   <span className="text-xs text-gray-500 uppercase font-bold">Body Params</span>
                   <div className="mt-2 space-y-2">
                     <div className="text-sm font-mono text-white">image <span className="text-gray-600">*</span></div>
                     <div className="text-sm font-mono text-white">metadata</div>
                   </div>
                </div>
                 <div className="col-span-2">
                   <span className="text-xs text-gray-500 uppercase font-bold">Type</span>
                   <div className="mt-2 space-y-2">
                     <div className="text-sm text-gray-400">Binary File (Multipart)</div>
                     <div className="text-sm text-gray-400">JSON String (Optional)</div>
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Code Example */}
          <div className="bg-[#111] border border-gray-800 rounded-lg overflow-hidden flex flex-col h-96">
            <div className="px-6 py-4 border-b border-gray-800 bg-gray-900/30 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Code className="w-4 h-4 text-gray-500" />
                Usage Example
              </h3>
              <div className="flex gap-2">
                 <span className="text-[10px] font-mono text-gray-500">cURL</span>
              </div>
            </div>
            <div className="flex-1 bg-black p-6 overflow-auto custom-scrollbar">
<pre className="font-mono text-xs md:text-sm leading-relaxed text-gray-300">
<span className="text-purple-400">curl</span> -X POST \<br/>
  {ENDPOINT_URL} \<br/>
  -H <span className="text-green-400">'x-api-key: {apiKey || 'YOUR_API_KEY'}'</span> \<br/>
  -F <span className="text-green-400">'image=@/path/to/source_image.png'</span> \<br/>
  -F <span className="text-green-400">'metadata={"author": "Midjourney_Bot", "license": "CC0"}'</span> \<br/>
  --output protected_image.png
</pre>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
