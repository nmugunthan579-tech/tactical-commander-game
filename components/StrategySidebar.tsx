
import React, { useState } from 'react';
import { StrategicHint } from '../types';

interface StrategySidebarProps {
  hint?: StrategicHint;
  isAnalyzing: boolean;
  onApplyOverride: (directive: string) => void;
  onClearOverride: () => void;
  activeDirective: string;
  onReanalyze: () => void;
}

const StrategySidebar: React.FC<StrategySidebarProps> = ({
  hint,
  isAnalyzing,
  onApplyOverride,
  onClearOverride,
  activeDirective,
  onReanalyze
}) => {
  const [localDirective, setLocalDirective] = useState(activeDirective);

  const handleApply = () => {
    onApplyOverride(localDirective);
  };

  const handleClear = () => {
    setLocalDirective('');
    onClearOverride();
  };

  return (
    <div className="w-full lg:w-80 flex flex-col gap-4 h-full">
      {/* Strategy Display */}
      <div className={`p-4 rounded-xl bg-slate-900 border transition-all duration-500 ${activeDirective ? 'override-active border-indigo-500' : 'border-slate-700'}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <i className={`fas fa-brain text-indigo-400 ${isAnalyzing ? 'animate-bounce' : ''}`}></i>
            Flash Strategy
          </h2>
          {activeDirective && (
            <span className="text-[10px] uppercase font-bold px-2 py-1 bg-indigo-500 text-white rounded animate-pulse">
              Override Active
            </span>
          )}
        </div>

        {isAnalyzing ? (
          <div className="space-y-3 py-4">
            <div className="h-4 bg-slate-800 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-slate-800 rounded animate-pulse w-full"></div>
            <div className="h-4 bg-slate-800 rounded animate-pulse w-2/3"></div>
          </div>
        ) : hint ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-300">
              <i className="fas fa-crosshairs"></i>
              <span className="font-mono">Target: ({hint.target.x}, {hint.target.y})</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed italic">
              "{hint.reasoning}"
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-1000" 
                  style={{ width: `${hint.confidence * 100}%` }}
                ></div>
              </div>
              <span className="text-xs text-slate-500">{Math.round(hint.confidence * 100)}% Match</span>
            </div>
          </div>
        ) : (
          <p className="text-slate-500 text-sm py-4 text-center">
            Link established. Waiting for grid telemetry...
          </p>
        )}
        
        <button 
          onClick={onReanalyze}
          disabled={isAnalyzing}
          className="w-full mt-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-xs font-bold rounded uppercase tracking-widest transition-colors"
        >
          {isAnalyzing ? 'Scanning...' : 'Update Strategy'}
        </button>
      </div>

      {/* Tactical Override Input */}
      <div className="flex-1 flex flex-col p-4 rounded-xl bg-slate-900 border border-slate-700">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <i className="fas fa-terminal"></i>
          Tactical Directive
        </h3>
        <textarea
          value={localDirective}
          onChange={(e) => setLocalDirective(e.target.value)}
          placeholder="e.g., 'Focus on red blocks', 'Clear bottom row', 'Aim for corners'..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm font-mono text-indigo-100 focus:outline-none focus:border-indigo-500 transition-colors resize-none mb-3"
        />
        <div className="flex gap-2">
          <button
            onClick={handleApply}
            className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-sm transition-colors shadow-lg shadow-indigo-500/20"
          >
            Apply Override
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-bold text-sm transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default StrategySidebar;
