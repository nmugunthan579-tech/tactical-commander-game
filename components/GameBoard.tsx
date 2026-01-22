
import React from 'react';
import { BlockColor, Position, GRID_SIZE } from '../types';

interface GameBoardProps {
  grid: BlockColor[][];
  onBlockClick: (pos: Position) => void;
  hintPos?: Position;
}

const colorMap: Record<BlockColor, string> = {
  red: 'bg-red-500 shadow-red-500/50',
  blue: 'bg-blue-500 shadow-blue-500/50',
  green: 'bg-emerald-500 shadow-emerald-500/50',
  yellow: 'bg-yellow-400 shadow-yellow-400/50',
  purple: 'bg-purple-500 shadow-purple-500/50',
};

const GameBoard: React.FC<GameBoardProps> = ({ grid, onBlockClick, hintPos }) => {
  return (
    <div className="grid grid-cols-8 gap-1 p-2 bg-slate-800/50 rounded-lg border border-slate-700/50 backdrop-blur-sm">
      {grid.map((row, y) =>
        row.map((color, x) => {
          const isHint = hintPos?.x === x && hintPos?.y === y;
          return (
            <button
              key={`${x}-${y}`}
              onClick={() => onBlockClick({ x, y })}
              className={`
                w-10 h-10 md:w-14 md:h-14 rounded-md transition-all duration-200 
                hover:scale-105 active:scale-95 shadow-lg
                ${colorMap[color]}
                ${isHint ? 'ring-4 ring-white animate-pulse scale-110 z-10' : 'ring-1 ring-white/10'}
              `}
            />
          );
        })
      )}
    </div>
  );
};

export default GameBoard;
