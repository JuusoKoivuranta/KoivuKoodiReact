// Board initialization and utility functions

export interface ChessPiece {
  type: string;
  color: string;
  image: string;
}

export interface Square {
  id: string;
  color: string;
  piece?: ChessPiece;
}

export const initializeBoard = (): Square[] => {
  const newBoard: Square[] = [];
  const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const pieces: { [key: number]: string[] } = {
    1: ['Rook', 'Knight', 'Bishop', 'Queen', 'King', 'Bishop', 'Knight', 'Rook'],
    2: Array(8).fill("Pawn"),
    7: Array(8).fill("Pawn"),
    8: ['Rook', 'Knight', 'Bishop', 'Queen', 'King', 'Bishop', 'Knight', 'Rook']
  };

  for (let i = 8; i > 0; i--) {
    for (let j = 0; j < 8; j++) {
      const square: Square = {
        id: letters[j] + i,
        color: (i + j) % 2 === 0 ? 'white' : 'black'
      };

      if (pieces[i]) {
        const pieceColor = i <= 2 ? 'White' : 'Black';
        square.piece = {
          type: pieces[i][j],
          color: pieceColor,
          image: `/images/pieces/${pieceColor}${pieces[i][j]}.webp`
        };
      }

      newBoard.push(square);
    }
  }
  return newBoard;
};

export const resetBoardState = () => ({
  board: initializeBoard(),
  moves: [] as string[],
  moveCounter: 1,
  selectedPiece: null as Square | null,
  timers: {
    white: 600,
    black: 600,
    currentPlayer: 'white' as 'white' | 'black'
  }
});
