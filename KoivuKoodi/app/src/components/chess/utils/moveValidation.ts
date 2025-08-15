// Chess move validation logic
import { Square, ChessPiece } from './boardUtils';

export const isValidMove = (piece: ChessPiece, from: Square, to: Square, board: Square[]): boolean => {
  const fromSquare = from.id;
  const toSquare = to.id;
  const pieceType = piece.type;

  // Can't move to the same square
  if (fromSquare === toSquare) {
    return false;
  }

  // Can't move to a square occupied by your own piece
  if (to.piece && to.piece.color === piece.color) {
    return false;
  }

  switch (pieceType) {
    case 'Pawn':
      return isPawnMove(piece, fromSquare, toSquare, to.piece);
    case 'Rook':
      return isRookMove(fromSquare, toSquare, board);
    case 'Knight':
      return isKnightMove(fromSquare, toSquare);
    case 'Bishop':
      return isBishopMove(fromSquare, toSquare, board);
    case 'Queen':
      return isQueenMove(fromSquare, toSquare, board);
    case 'King':
      return isKingMove(fromSquare, toSquare);
    default:
      return false;
  }
};

function isPawnMove(piece: ChessPiece, fromSquare: string, toSquare: string, existingPiece?: ChessPiece): boolean {
  const startColumn = fromSquare[0];
  const targetColumn = toSquare[0];
  const fromRow = parseInt(fromSquare[1]);
  const toRow = parseInt(toSquare[1]);
  const direction = piece.color === 'White' ? 1 : -1;
  const startingRow = piece.color === 'White' ? 2 : 7;

  // Pawns can only move forward
  const rowDifference = toRow - fromRow;
  if ((piece.color === 'White' && rowDifference <= 0) || 
      (piece.color === 'Black' && rowDifference >= 0)) {
    return false;
  }

  // Regular move (forward without capture)
  if (startColumn === targetColumn && !existingPiece) {
    // From starting position, can move 1 or 2 squares
    if (fromRow === startingRow) {
      return rowDifference === direction || rowDifference === direction * 2;
    }
    // Otherwise, can only move 1 square
    return rowDifference === direction;
  }

  // Capture move (diagonal)
  if (Math.abs(startColumn.charCodeAt(0) - targetColumn.charCodeAt(0)) === 1 &&
      rowDifference === direction && existingPiece && existingPiece.color !== piece.color) {
    return true;
  }

  return false;
}

function isRookMove(fromSquare: string, toSquare: string, board: Square[]): boolean {
  // Check if it's a valid rook move (horizontal or vertical)
  if (fromSquare[0] !== toSquare[0] && fromSquare[1] !== toSquare[1]) {
    return false;
  }

  // Check if path is clear
  return isPathClear(fromSquare, toSquare, board);
}

function isKnightMove(fromSquare: string, toSquare: string): boolean {
  const columnDiff = Math.abs(fromSquare[0].charCodeAt(0) - toSquare[0].charCodeAt(0));
  const rowDiff = Math.abs(parseInt(fromSquare[1]) - parseInt(toSquare[1]));
  
  // Knight moves in an L-shape: 2 squares in one direction, 1 in the other
  // Knights can jump over other pieces, so no path checking needed
  return (columnDiff === 2 && rowDiff === 1) || (columnDiff === 1 && rowDiff === 2);
}

function isBishopMove(fromSquare: string, toSquare: string, board: Square[]): boolean {
  const columnDiff = Math.abs(fromSquare[0].charCodeAt(0) - toSquare[0].charCodeAt(0));
  const rowDiff = Math.abs(parseInt(fromSquare[1]) - parseInt(toSquare[1]));
  
  // Check if it's a valid diagonal move
  if (columnDiff !== rowDiff) {
    return false;
  }

  // Check if path is clear
  return isPathClear(fromSquare, toSquare, board);
}

function isQueenMove(fromSquare: string, toSquare: string, board: Square[]): boolean {
  return isRookMove(fromSquare, toSquare, board) || isBishopMove(fromSquare, toSquare, board);
}

function isKingMove(fromSquare: string, toSquare: string): boolean {
  const columnDiff = Math.abs(fromSquare[0].charCodeAt(0) - toSquare[0].charCodeAt(0));
  const rowDiff = Math.abs(parseInt(fromSquare[1]) - parseInt(toSquare[1]));
  
  // King can only move one square in any direction
  return columnDiff <= 1 && rowDiff <= 1 && (columnDiff > 0 || rowDiff > 0);
}

// Helper function to check if the path between two squares is clear
function isPathClear(fromSquare: string, toSquare: string, board: Square[]): boolean {
  const fromCol = fromSquare[0].charCodeAt(0);
  const fromRow = parseInt(fromSquare[1]);
  const toCol = toSquare[0].charCodeAt(0);
  const toRow = parseInt(toSquare[1]);

  const colDirection = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;
  const rowDirection = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;

  let currentCol = fromCol + colDirection;
  let currentRow = fromRow + rowDirection;

  // Check each square along the path (excluding start and end squares)
  while (currentCol !== toCol || currentRow !== toRow) {
    const currentSquareId = String.fromCharCode(currentCol) + currentRow;
    const currentSquare = board.find(square => square.id === currentSquareId);
    
    if (currentSquare?.piece) {
      return false; // Path is blocked
    }

    currentCol += colDirection;
    currentRow += rowDirection;
  }

  return true; // Path is clear
}
