import React from 'react';

const MoveHistory = ({ moves }) => {
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
