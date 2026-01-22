
import React from 'react';

interface DebuggerProps {
  directive: string;
  isAnalyzing: boolean;
  score: number;
}

const Debugger: React.FC<DebuggerProps> = ({ directive, isAnalyzing, score }) => {
  return (
    <div className="mt-4 p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[10px] text-emerald-400/80">
      <div className="flex justify-between items-center mb-2 border-b border-slate-800 pb-1">
        <span>STRAT_NODE_DEBUG_v3.1</span>
        <span className={isAnalyzing ? 'animate-pulse text-indigo-400' : ''}>
          {isAnalyzing ? 'ANALYZING...' : 'IDLE'}
        </span>
      </div>
      <div>[SESSION_STRENGTH]: STABLE</div>
      <div>[SCORE_BUFFER]: {score.toString().padStart(6, '0')}</div>
      <div className="mt-2 text-slate-500 uppercase font-bold">Injected Fragment:</div>
      <div className="mt-1 p-2 bg-black/40 rounded border border-slate-900 text-slate-400 overflow-hidden text-ellipsis whitespace-nowrap">
        {directive ? `FORCE_INTENT: "${directive}"` : 'USE_HEURISTIC: DEFAULT_MODE'}
      </div>
    </div>
  );
};

export default Debugger;
