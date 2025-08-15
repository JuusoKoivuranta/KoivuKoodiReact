// Game logic and turn management utilities
import { Square, ChessPiece } from './boardUtils';
import { isValidMove as validateMove } from './moveValidation';

export interface MoveData {
  from: string;
  to: string;
  piece: ChessPiece;
  moveNotation?: string;
}

export interface TimerState {
  white: number;
  black: number;
  currentPlayer: 'white' | 'black';
}

export const canSelectPiece = (
  square: Square, 
  playWhite: boolean, 
  moveCounter: number,
  gameState: boolean
): boolean => {
  if (!gameState || !square.piece) {
    return false;
  }

  const isWhiteTurn = moveCounter % 2 === 1;
  const isPieceWhite = square.piece.color === 'White';

  // First check: Can only select pieces of your assigned color
  if ((playWhite && !isPieceWhite) || (!playWhite && isPieceWhite)) {
    console.log('Cannot select opponent pieces - you play', playWhite ? 'white' : 'black', 'but piece is', isPieceWhite ? 'white' : 'black');
    return false;
  }

  // Second check: Can only move when it's your turn
  if ((playWhite && !isWhiteTurn) || (!playWhite && isWhiteTurn)) {
    console.log('Not your turn - it is', isWhiteTurn ? 'white' : 'black', 'turn but you play', playWhite ? 'white' : 'black');
    return false;
  }

  return true;
};

export const canMovePiece = (
  fromSquare: Square,
  toSquare: Square,
  playWhite: boolean,
  moveCounter: number,
  board: Square[]
): boolean => {
  if (!fromSquare.piece) return false;

  // Check turn and ownership
  const isWhiteTurn = moveCounter % 2 === 1;
  const isPieceWhite = fromSquare.piece.color === 'White';

  // Player must own the piece they're trying to move
  if ((playWhite && !isPieceWhite) || (!playWhite && isPieceWhite)) {
    console.log('Move validation failed: player does not own this piece');
    return false;
  }

  // It must be the player's turn
  if ((playWhite && !isWhiteTurn) || (!playWhite && isWhiteTurn)) {
    console.log('Move validation failed: not player\'s turn');
    return false;
  }

  // Use the proper move validation function
  return validateMove(fromSquare.piece, fromSquare, toSquare, board);
};

export const executeBoardMove = (
  board: Square[],
  fromSquare: Square,
  toSquare: Square
): Square[] => {
  const newBoard = [...board];
  const fromIndex = newBoard.findIndex(s => s.id === fromSquare.id);
  const toIndex = newBoard.findIndex(s => s.id === toSquare.id);

  if (fromIndex !== -1 && toIndex !== -1) {
    if (newBoard[toIndex].piece) {
      // Handle capture - could be expanded for capture logic
    }

    newBoard[toIndex].piece = newBoard[fromIndex].piece;
    delete newBoard[fromIndex].piece;
  }

  return newBoard;
};

export const createMoveNotation = (fromSquare: Square, toSquare: Square): string => {
  return `${fromSquare.piece!.type}${fromSquare.id}-${toSquare.id}`;
};

export const switchCurrentPlayer = (currentPlayer: 'white' | 'black'): 'white' | 'black' => {
  return currentPlayer === 'white' ? 'black' : 'white';
};
