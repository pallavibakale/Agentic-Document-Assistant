import React from 'react';
import { SectionActionType } from '../types';

interface SectionToolbarProps {
  onAction: (action: SectionActionType) => void;
  isProcessing: boolean;
  position: { top: number; left: number } | null;
  sectionTitle: string;
}

export const SectionToolbar: React.FC<SectionToolbarProps> = ({ 
  onAction, 
  isProcessing, 
  position,
  sectionTitle
}) => {
  if (!position) return null;

  return (
    <div 
      className="absolute z-50 flex flex-col gap-1 p-1 bg-white rounded-lg shadow-xl border border-gray-200 transform -translate-x-full ml-[-1rem] animate-in fade-in zoom-in duration-200"
      style={{ top: position.top, left: position.left }}
    >
      <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 mb-1">
        {sectionTitle.length > 20 ? sectionTitle.substring(0, 20) + '...' : sectionTitle}
      </div>
      
      {isProcessing ? (
        <div className="p-2 flex items-center justify-center text-blue-600">
           <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
           </svg>
        </div>
      ) : (
        <>
          <ActionButton onClick={() => onAction('rewrite_formal')} label="Make Formal" icon="⚖️" />
          <ActionButton onClick={() => onAction('rewrite_simple')} label="Simplify" icon="💡" />
          <ActionButton onClick={() => onAction('summarize')} label="Summarize" icon="📝" />
          <ActionButton onClick={() => onAction('expand')} label="Expand" icon="🔍" />
        </>
      )}
    </div>
  );
};

const ActionButton: React.FC<{ onClick: () => void; label: string; icon: string }> = ({ onClick, label, icon }) => (
  <button
    onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
    }}
    className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors text-left w-full whitespace-nowrap"
  >
    <span>{icon}</span>
    <span>{label}</span>
  </button>
);
