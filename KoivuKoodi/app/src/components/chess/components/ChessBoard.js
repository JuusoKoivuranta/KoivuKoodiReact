import React from 'react';

const ChessBoard = ({ board, selectedPiece, onSquareClick, playWhite }) => {
  return (
    <div className="chess-board">
      {board.map((square) => (
        <div
          key={square.id}
          className={`square ${square.color}`}
          onClick={() => onSquareClick(square)}
        >
          {square.piece && (
            <img
              src={square.piece.image}
              alt={square.piece.type}
              className={`chesspiece ${selectedPiece?.id === square.id ? 'selected' : ''}`}
            />
          )}
          <span className="squareId">{square.id}</span>
        </div>
      ))}
    </div>
  );
};

export default ChessBoard;
