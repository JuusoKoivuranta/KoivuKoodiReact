export const isValidMove = (piece, from, to) => {
  const fromSquare = from.id;
  const toSquare = to.id;
  const pieceType = piece.type;

  switch (pieceType) {
    case 'Pawn':
      return isPawnMove(piece, fromSquare, toSquare, to.piece);
    case 'Rook':
      return isRookMove(fromSquare, toSquare);
    case 'Knight':
      return isKnightMove(fromSquare, toSquare);
    case 'Bishop':
      return isBishopMove(fromSquare, toSquare);
    case 'Queen':
      return isQueenMove(fromSquare, toSquare);
    case 'King':
      return isKingMove(fromSquare, toSquare);
    default:
      return false;
  }
};

function isPawnMove(piece, fromSquare, toSquare, existingPiece) {
  const startColumn = fromSquare[0];
  const targetColumn = toSquare[0];
  const fromRow = parseInt(fromSquare[1]);
  const toRow = parseInt(toSquare[1]);
  const direction = piece.color === 'White' ? 1 : -1;
  const startingRow = piece.color === 'White' ? 2 : 7;

  // Regular move
  if (startColumn === targetColumn && !existingPiece) {
    if (fromRow === startingRow) {
      return toRow - fromRow === direction * 2 || toRow - fromRow === direction;
    }
    return toRow - fromRow === direction;
  }

  // Capture move
  if (Math.abs(startColumn.charCodeAt(0) - targetColumn.charCodeAt(0)) === 1 &&
      toRow - fromRow === direction && existingPiece) {
    return true;
  }

  return false;
}

function isRookMove(fromSquare, toSquare) {
  return fromSquare[0] === toSquare[0] || fromSquare[1] === toSquare[1];
}

function isKnightMove(fromSquare, toSquare) {
  const columnDiff = Math.abs(fromSquare[0].charCodeAt(0) - toSquare[0].charCodeAt(0));
  const rowDiff = Math.abs(parseInt(fromSquare[1]) - parseInt(toSquare[1]));
  return (columnDiff === 2 && rowDiff === 1) || (columnDiff === 1 && rowDiff === 2);
}

function isBishopMove(fromSquare, toSquare) {
  const columnDiff = Math.abs(fromSquare[0].charCodeAt(0) - toSquare[0].charCodeAt(0));
  const rowDiff = Math.abs(parseInt(fromSquare[1]) - parseInt(toSquare[1]));
  return columnDiff === rowDiff;
}

function isQueenMove(fromSquare, toSquare) {
  return isRookMove(fromSquare, toSquare) || isBishopMove(fromSquare, toSquare);
}

function isKingMove(fromSquare, toSquare) {
  const columnDiff = Math.abs(fromSquare[0].charCodeAt(0) - toSquare[0].charCodeAt(0));
  const rowDiff = Math.abs(parseInt(fromSquare[1]) - parseInt(toSquare[1]));
  return columnDiff <= 1 && rowDiff <= 1;
}
