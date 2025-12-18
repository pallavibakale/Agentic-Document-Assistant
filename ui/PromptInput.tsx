import React, { useState } from 'react';

interface PromptInputProps {
  onGenerate: (prompt: string) => Promise<void>;
  isGenerating: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-10">
      <div className="bg-white p-1 rounded-xl shadow-lg border border-gray-200">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
            placeholder="e.g. Draft a 1-page NDA between a startup and a contractor"
            className="flex-1 px-4 py-3 text-gray-700 placeholder-gray-400 bg-transparent border-none focus:ring-0 focus:outline-none text-lg"
          />
          <button
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            className={`
              px-6 py-2.5 rounded-lg font-medium text-white transition-all
              ${!prompt.trim() || isGenerating 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transform active:scale-95'}
            `}
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Drafting...
              </span>
            ) : (
              'Generate Draft'
            )}
          </button>
        </form>
      </div>
      <p className="text-center text-xs text-gray-400 mt-3">
        AI generates structured blocks, not raw text. You can refine each section later.
      </p>
    </div>
  );
};
