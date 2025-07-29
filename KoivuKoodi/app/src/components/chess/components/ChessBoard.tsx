import React from 'react';

interface ChessPiece {
  type: string;
  color: string;
  image: string;
}

interface Square {
  id: string;
  color: string;
  piece?: ChessPiece;
}

interface ChessBoardProps {
  board: Square[];
  selectedPiece: Square | null;
  onSquareClick: (square: Square) => void;
  playWhite: boolean;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ board, selectedPiece, onSquareClick, playWhite }) => {
  // Create a display order based on whether player is playing white or black
  // If playing white (playWhite = true): display normally (a1-h8)
  // If playing black (playWhite = false): display flipped (h8-a1)
  
  const getDisplayBoard = () => {
    if (playWhite) {
      // Normal order: a8, b8, c8... to a1, b1, c1
      return board;
    } else {
      // Flipped order: h1, g1, f1... to h8, g8, f8
      return [...board].reverse();
    }
  };

  const displayBoard = getDisplayBoard();

  return (
    <div className="chess-board">
      {displayBoard.map((square) => (
        <div
          key={square.id}
          className={`square ${square.color} ${selectedPiece?.id === square.id ? 'selected' : ''}`}
          onClick={() => onSquareClick(square)}
        >
          {square.piece && (
            <img
              src={square.piece.image}
              alt={square.piece.type}
              className="chesspiece"
            />
          )}
          <span className="squareId">
            {square.id}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ChessBoard;
