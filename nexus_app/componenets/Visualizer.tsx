
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

interface VisualizerProps {
  isDarkMode: boolean;
}

const Visualizer: React.FC<VisualizerProps> = ({ isDarkMode }) => {
  const [labName, setLabName] = useState('Quantum Computing Lab');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const textPrimary = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSecondary = isDarkMode ? 'text-white/40' : 'text-slate-500';
  const cardBg = isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white border-slate-200 shadow-sm';

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `A high-fidelity, photorealistic 16:9 cinematic shot of a futuristic ${labName} featuring sleek glass partitions, glowing cyan LED server racks, and holographic displays. Explicitly render the text '${labName}' in a clean, bold, white sans-serif font on the main glass entrance or a digital signage board within the room. Stark Industries aesthetic, cinematic lighting, 8k resolution.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9"
          }
        }
      });

      let foundImage = false;
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64Data = part.inlineData.data;
          setGeneratedImage(`data:image/png;base64,${base64Data}`);
          foundImage = true;
          break;
        }
      }

      if (!foundImage) {
        throw new Error('No image was returned from the model.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate facility visualization.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-8 animate-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div className="mb-12">
        <h2 className={`text-4xl font-light mb-2 ${textPrimary}`}>Facility <span className="font-bold text-cyan-500">Visualizer</span></h2>
        <p className={textSecondary + " text-sm mono"}>Neural-render facility concepts for spatial planning.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Controls Panel */}
        <div className="lg:col-span-4 space-y-8">
          <div className={`p-8 rounded-3xl border ${cardBg} backdrop-blur-md`}>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest mono text-white/30 block mb-3">Facility Designation</label>
                <input 
                  type="text"
                  value={labName}
                  onChange={(e) => setLabName(e.target.value)}
                  className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors ${textPrimary}`}
                  placeholder="e.g. Bio-Synthesis Wing"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest mono text-white/30 block mb-3">Environment Preset</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Cinematic', 'Minimalist', 'Technical', 'Overcast'].map(preset => (
                    <button key={preset} className="py-2 px-3 bg-white/5 border border-white/5 rounded-lg text-[10px] font-bold uppercase tracking-tighter text-white/40 hover:text-white transition-colors">
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-3 ${
                  isGenerating 
                  ? 'bg-white/5 text-white/20 cursor-wait' 
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/20 active:scale-95'
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Synthesizing Grids...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Generate Visualization
                  </>
                )}
              </button>

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] mono">
                  SYSTEM ERROR: {error}
                </div>
              )}
            </div>
          </div>

          <div className={`p-6 rounded-3xl border ${isDarkMode ? 'border-white/5 bg-white/[0.01]' : 'border-slate-100 bg-slate-50'} text-xs italic ${textSecondary}`}>
            "NEXUS uses the Gemini 2.5 Flash model to interpret spatial descriptions and render high-fidelity architectural concepts for planning approvals."
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-8">
          <div className={`relative aspect-video w-full rounded-3xl border-2 border-dashed overflow-hidden flex items-center justify-center transition-all ${
            isGenerating ? 'border-cyan-500/50 bg-cyan-500/5' : generatedImage ? 'border-transparent' : 'border-white/10 bg-black/40'
          }`}>
            {generatedImage ? (
              <img src={generatedImage} alt="Visualization Output" className="w-full h-full object-cover animate-in fade-in duration-1000" />
            ) : (
              <div className="flex flex-col items-center gap-4 text-center p-12">
                <svg className={`w-12 h-12 ${isGenerating ? 'text-cyan-500 animate-pulse' : 'text-white/10'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <div className={`text-xs mono uppercase tracking-widest ${textSecondary}`}>
                  {isGenerating ? 'Computing Light Path Tracing...' : 'Waiting for Visualization Trigger'}
                </div>
              </div>
            )}

            {/* Viewport HUD */}
            <div className="absolute top-6 left-6 flex flex-col gap-2">
               <div className="px-2 py-1 bg-black/60 border border-cyan-500/30 rounded text-[9px] mono font-bold text-cyan-400">VIEW_PORT: RENDER_A</div>
            </div>
            {generatedImage && (
              <button 
                onClick={() => setGeneratedImage(null)}
                className="absolute top-6 right-6 p-2 bg-black/60 border border-white/10 rounded-xl text-white/40 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>

          {generatedImage && !isGenerating && (
             <div className="mt-8 flex justify-between items-center animate-in slide-in-from-top-2">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0a0a0c] bg-cyan-600 flex items-center justify-center text-[10px] font-bold">A</div>
                    ))}
                  </div>
                  <span className={`text-[10px] mono uppercase tracking-widest ${textSecondary}`}>3 Approvals Pending</span>
                </div>
                <button className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">
                  Archive to Database
                </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Visualizer;
