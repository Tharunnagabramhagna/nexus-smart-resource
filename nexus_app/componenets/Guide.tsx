
import React, { useState, useRef } from 'react';
import { Wand2, Video, Sparkles, Upload, ArrowRight, Loader2, Play, Eraser, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { editImage, generateVeoVideo } from '../services/geminiService';

// Fix: Removed conflicting 'declare global' block as 'aistudio' is already defined by the environment's 'AIStudio' type.

const AILab: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [activeTab, setActiveTab] = useState<'IMAGE' | 'VIDEO'>('IMAGE');
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [resultVideo, setResultVideo] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResultImage(null);
        setResultVideo(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImage = async () => {
    if (!image || !prompt) return;
    setLoading(true);
    setStatusMessage('Flash 2.5 is reimagining your space...');
    try {
      const base64Data = image.split(',')[1];
      const result = await editImage(base64Data, prompt);
      setResultImage(result);
    } catch (err) {
      alert("Failed to edit image.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!image || !prompt) return;
    
    // Fix: Using (window as any).aistudio to access the environment-provided helper methods for API key selection
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await (window as any).aistudio.openSelectKey();
    }

    setLoading(true);
    setStatusMessage('Veo is animating your vision. This may take a few minutes...');
    try {
      const base64Data = image.split(',')[1];
      const videoUrl = await generateVeoVideo(prompt, base64Data);
      setResultVideo(videoUrl);
    } catch (err: any) {
      // Fix: Follow guidelines to retry on "Requested entity was not found" error
      if (err?.message?.includes('Requested entity was not found')) {
        await (window as any).aistudio.openSelectKey();
      } else {
        alert("Video generation failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <header>
        <h2 className={`text-4xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>NEXUS AI LAB</h2>
        <p className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Generative workspace for facility visualization and media enhancement.</p>
      </header>

      <div className="flex gap-4 p-1 bg-indigo-500/10 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('IMAGE')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'IMAGE' ? 'bg-indigo-600 text-white shadow-lg' : (isDarkMode ? 'text-slate-400' : 'text-slate-600')}`}
        >
          <Wand2 size={20} /> Magic Edit
        </button>
        <button 
          onClick={() => setActiveTab('VIDEO')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'VIDEO' ? 'bg-indigo-600 text-white shadow-lg' : (isDarkMode ? 'text-slate-400' : 'text-slate-600')}`}
        >
          <Video size={20} /> Animate Space
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Controls */}
        <div className={`p-8 rounded-[2.5rem] border shadow-xl ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-slate-200/50'}`}>
          <div className="space-y-6">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`relative h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all group ${image ? 'border-indigo-500' : (isDarkMode ? 'border-slate-800 hover:border-slate-700' : 'border-slate-200 hover:border-slate-300')}`}
            >
              {image ? (
                <img src={image} className="w-full h-full object-cover rounded-3xl" alt="Input preview" />
              ) : (
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Upload size={32} />
                  </div>
                  <p className={`font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Upload Facility Photo</p>
                  <p className="text-sm text-slate-500 mt-1">PNG, JPG up to 10MB</p>
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>

            <div className="space-y-2">
              <label className={`block text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {activeTab === 'IMAGE' ? 'Enhancement Prompt' : 'Motion Prompt'}
              </label>
              <textarea 
                placeholder={activeTab === 'IMAGE' ? "e.g., 'Add a modern glass partition and some plants to this lab'" : "e.g., 'Slow cinematic drone shot moving towards the windows'"}
                className={`w-full p-5 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none h-32 ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-100'}`}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <button 
              onClick={activeTab === 'IMAGE' ? handleEditImage : handleGenerateVideo}
              disabled={loading || !image || !prompt}
              className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {activeTab === 'IMAGE' ? <Sparkles size={24} /> : <Play size={24} />}
                  {activeTab === 'IMAGE' ? 'Start Magic Edit' : 'Generate Cinematic Video'}
                </>
              )}
            </button>
            
            {activeTab === 'VIDEO' && (
              <p className="text-[10px] text-center text-slate-500 uppercase font-bold tracking-widest">
                Requires Video Generation API Access • Billing Enabled Key Required
              </p>
            )}
          </div>
        </div>

        {/* Output Display */}
        <div className={`p-8 rounded-[2.5rem] border flex flex-col items-center justify-center transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800 shadow-2xl shadow-indigo-500/5' : 'bg-white border-slate-200 shadow-xl'}`}>
          {loading ? (
            <div className="text-center animate-pulse">
              <div className="w-24 h-24 bg-indigo-500/20 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles size={48} className="animate-spin-slow" />
              </div>
              <h4 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Generating Masterpiece</h4>
              <p className="text-slate-500 max-w-xs">{statusMessage}</p>
            </div>
          ) : resultImage ? (
            <div className="w-full space-y-4 animate-scaleUp">
              <div className="relative group">
                <img src={resultImage} className="w-full h-auto rounded-3xl shadow-2xl" alt="AI result" />
                <div className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 size={12} /> FLASH 2.5 EDIT
                </div>
              </div>
              <button 
                onClick={() => window.open(resultImage, '_blank')}
                className={`w-full py-3 rounded-xl font-bold transition-all ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}
              >
                Download Image
              </button>
            </div>
          ) : resultVideo ? (
            <div className="w-full space-y-4 animate-scaleUp">
              <video controls src={resultVideo} className="w-full rounded-3xl shadow-2xl aspect-video bg-black"></video>
              <div className="flex gap-3">
                 <button 
                  onClick={() => window.open(resultVideo, '_blank')}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}
                >
                  Save Video
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center p-12 opacity-30">
              <div className="w-24 h-24 border-4 border-slate-400 border-dashed rounded-full flex items-center justify-center mx-auto mb-6">
                <ImageIcon size={48} />
              </div>
              <p className={`text-xl font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Output Workspace</p>
              <p className="text-sm">Your AI-generated assets will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AILab;
