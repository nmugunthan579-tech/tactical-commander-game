
import React, { useState, useEffect, useCallback } from 'react';
import { GameState, BlockColor, COLORS, GRID_SIZE, Position } from './types';
import { getStrategicHint } from './services/geminiService';
import GameBoard from './components/GameBoard';
import StrategySidebar from './components/StrategySidebar';
import Debugger from './components/Debugger';

const createEmptyGrid = (): BlockColor[][] => {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => COLORS[Math.floor(Math.random() * COLORS.length)])
  );
};

const App: React.FC = () => {
  const [state, setState] = useState<GameState>({
    grid: createEmptyGrid(),
    score: 0,
    moves: 20,
    isAnalyzing: false,
    directive: ''
  });

  const analyzeBoard = useCallback(async (grid: BlockColor[][], score: number, moves: number, directive: string) => {
    setState(prev => ({ ...prev, isAnalyzing: true }));
    const hint = await getStrategicHint(grid, score, moves, directive);
    setState(prev => ({ ...prev, lastHint: hint, isAnalyzing: false }));
  }, []);

  // Initial analysis
  useEffect(() => {
    analyzeBoard(state.grid, state.score, state.moves, state.directive);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBlockClick = (pos: Position) => {
    const clickedColor = state.grid[pos.y][pos.x];
    const toClear: Position[] = [];
    const visited = new Set<string>();

    const findCluster = (x: number, y: number) => {
      const key = `${x},${y}`;
      if (
        x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE ||
        visited.has(key) || state.grid[y][x] !== clickedColor
      ) return;

      visited.add(key);
      toClear.push({ x, y });
      findCluster(x + 1, y);
      findCluster(x - 1, y);
      findCluster(x, y + 1);
      findCluster(x, y - 1);
    };

    findCluster(pos.x, pos.y);

    if (toClear.length >= 2) {
      const newGrid = state.grid.map(row => [...row]);
      
      // Mark as cleared
      toClear.forEach(p => {
        newGrid[p.y][p.x] = null as any;
      });

      // Gravity logic
      for (let x = 0; x < GRID_SIZE; x++) {
        let emptySpot = GRID_SIZE - 1;
        for (let y = GRID_SIZE - 1; y >= 0; y--) {
          if (newGrid[y][x] !== null) {
            const temp = newGrid[y][x];
            newGrid[y][x] = null as any;
            newGrid[emptySpot][x] = temp;
            emptySpot--;
          }
        }
        // Refill from top
        for (let y = emptySpot; y >= 0; y--) {
          newGrid[y][x] = COLORS[Math.floor(Math.random() * COLORS.length)];
        }
      }

      const points = toClear.length * 10;
      const nextMoves = state.moves - 1;

      setState(prev => ({
        ...prev,
        grid: newGrid,
        score: prev.score + points,
        moves: nextMoves,
        lastHint: undefined // Clear old hint
      }));

      if (nextMoves > 0) {
        analyzeBoard(newGrid, state.score + points, nextMoves, state.directive);
      }
    }
  };

  const handleApplyOverride = (directive: string) => {
    setState(prev => ({ ...prev, directive }));
    analyzeBoard(state.grid, state.score, state.moves, directive);
  };

  const handleClearOverride = () => {
    setState(prev => ({ ...prev, directive: '' }));
    analyzeBoard(state.grid, state.score, state.moves, '');
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center justify-center gap-8 max-w-7xl mx-auto">
      <header className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent italic tracking-tighter">
            GEMINI TACTICAL COMMANDER
          </h1>
          <p className="text-slate-500 text-sm font-medium">STRATEGIC INTERFACE // RELEASE v3.1</p>
        </div>
        
        <div className="flex gap-6 items-center bg-slate-900/50 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
          <div className="text-center px-4 border-r border-slate-800">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Score</div>
            <div className="text-2xl font-mono text-indigo-400">{state.score.toLocaleString()}</div>
          </div>
          <div className="text-center px-4">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Moves Left</div>
            <div className={`text-2xl font-mono ${state.moves < 5 ? 'text-red-500 animate-pulse' : 'text-slate-100'}`}>
              {state.moves}
            </div>
          </div>
        </div>
      </header>

      <main className="w-full flex flex-col lg:flex-row gap-8 items-start justify-center">
        {/* Game Center */}
        <div className="flex-1 flex flex-col items-center">
          <GameBoard 
            grid={state.grid} 
            onBlockClick={handleBlockClick} 
            hintPos={state.lastHint?.target}
          />
          <div className="w-full max-w-lg">
            <Debugger 
              directive={state.directive} 
              isAnalyzing={state.isAnalyzing} 
              score={state.score} 
            />
          </div>
        </div>

        {/* Tactical Sidebar */}
        <StrategySidebar 
          hint={state.lastHint}
          isAnalyzing={state.isAnalyzing}
          activeDirective={state.directive}
          onApplyOverride={handleApplyOverride}
          onClearOverride={handleClearOverride}
          onReanalyze={() => analyzeBoard(state.grid, state.score, state.moves, state.directive)}
        />
      </main>

      {state.moves <= 0 && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full p-8 bg-slate-900 border border-slate-700 rounded-3xl text-center shadow-2xl shadow-indigo-500/20">
            <h2 className="text-3xl font-black text-white mb-2">OPERATION CONCLUDED</h2>
            <p className="text-slate-400 mb-6 italic">Tactical link severed. Final score verified.</p>
            <div className="text-6xl font-black text-indigo-500 mb-8 font-mono">
              {state.score.toLocaleString()}
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-lg"
            >
              INITIALIZE NEW SESSION
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
