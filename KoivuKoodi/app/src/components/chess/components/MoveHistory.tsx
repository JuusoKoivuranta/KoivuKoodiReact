import React from 'react';

interface MoveHistoryProps {
  moves: string[];
}

const MoveHistory: React.FC<MoveHistoryProps> = ({ moves }) => {
  return (
    <div id="moveHistory" className="moveHistory">
      {moves.map((move, index) => (
        <span
          key={index}
          className={index % 2 === 0 ? 'madeMoveW' : 'madeMoveB'}
        >
          {move}
        </span>
      ))}
    </div>
  );
};

export default MoveHistory;
