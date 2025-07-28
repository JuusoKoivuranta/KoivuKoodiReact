import React, { useState } from 'react';
import './Minesweeper.css';

// Define types
interface Square {
  id: string;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighbors: number;
}

type Board = Square[][] | null;

const Minesweeper: React.FC = () => {
  const [board, setBoard] = useState<Board>(null);
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [mineNum, setMineNum] = useState<string>('');
  const [assignedMines, setAssignedMines] = useState<Set<string>>(new Set());
  const [winCondition, setWinCondition] = useState<number>(0);
  const [flagNum, setFlagNum] = useState<number>(0);
  const [gameResult, setGameResult] = useState<string>('');
  const [showResult, setShowResult] = useState<boolean>(false);

  const readInputValues = (): void => {
    const widthNum = parseInt(width, 10);
    const heightNum = parseInt(height, 10);
    const mineNumber = parseInt(mineNum, 10);

    if (isNaN(widthNum) || isNaN(heightNum) || isNaN(mineNumber)) {
      alert('Input all values!');
      return;
    } else if (mineNumber > widthNum * heightNum) {
      alert('Too Many Mines!');
      return;
    }

    setShowResult(false);
    setAssignedMines(new Set());
    setFlagNum(mineNumber);
    setWinCondition(mineNumber);
    createBoard(widthNum, heightNum, mineNumber);
  };

  const createBoard = (width: number, height: number, mineNum: number): void => {
    const newBoard: Square[][] = [];
    for (let h = 0; h < height; h++) {
      const row: Square[] = [];
      for (let w = 0; w < width; w++) {
        row.push({
          id: `${w},${h}`,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighbors: 0
        });
      }
      newBoard.push(row);
    }
    placeMines(newBoard, width, height, mineNum);
    setBoard(newBoard);
  };

  const placeMines = (board: Square[][], width: number, height: number, mineNum: number): void => {
    let minesToPlace = mineNum;
    const newAssignedMines = new Set<string>();

    while (minesToPlace > 0) {
      const rndX = Math.floor(Math.random() * width);
      const rndY = Math.floor(Math.random() * height);
      const squareId = `${rndX},${rndY}`;

      if (!newAssignedMines.has(squareId)) {
        board[rndY][rndX].isMine = true;
        newAssignedMines.add(squareId);
        minesToPlace--;
      }
    }
    setAssignedMines(newAssignedMines);
  };

  const handleLeftClick = (x: number, y: number): void => {
    if (!board) return;
    if (board[y][x].isFlagged || board[y][x].isRevealed) return;

    if (board[y][x].isMine) {
      setShowResult(true);
      setGameResult('GAME LOST :(');
      const newBoard = [...board];
      newBoard[y][x].isRevealed = true;
      setBoard(newBoard);
      return;
    }

    floodFill(x, y);
  };

  const floodFill = (x: number, y: number): void => {
    if (!board) return;
    if (x < 0 || x >= board[0].length || y < 0 || y >= board.length) return;
    if (board[y][x].isRevealed || board[y][x].isFlagged) return;

    const newBoard = [...board];
    newBoard[y][x].isRevealed = true;

    let mineCount = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;

        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < board[0].length && ny >= 0 && ny < board.length) {
          if (board[ny][nx].isMine) {
            mineCount++;
          }
        }
      }
    }

    newBoard[y][x].neighbors = mineCount;
    setBoard(newBoard);

    // Check for win condition - all non-mine squares are revealed
    const hasWon = newBoard.every(row =>
      row.every(square =>
        (square.isMine && !square.isRevealed) || (!square.isMine && square.isRevealed)
      )
    );

    if (hasWon) {
      setShowResult(true);
      setGameResult('GAME WON :)');
    }

    if (mineCount === 0) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          floodFill(x + dx, y + dy);
        }
      }
    }
  };

  const handleRightClick = (e: React.MouseEvent<HTMLDivElement>, x: number, y: number): void => {
    e.preventDefault();
    if (!board || board[y][x].isRevealed) return;

    const newBoard = [...board];
    const square = newBoard[y][x];

    if (square.isFlagged) {
      square.isFlagged = false;
      setFlagNum(prev => prev + 1);
      if (square.isMine) {
        setWinCondition(prev => prev + 1);
      }
    } else if (flagNum > 0) {
      square.isFlagged = true;
      setFlagNum(prev => prev - 1);
      if (square.isMine) {
        setWinCondition(prev => prev - 1);
      }
    }

    setBoard(newBoard);

    // Check if all mines are correctly flagged and no other squares are flagged
    const hasWon = newBoard.every(row =>
      row.every(square =>
        (square.isMine && square.isFlagged) || (!square.isMine && !square.isFlagged)
      )
    );

    if (hasWon) {
      setShowResult(true);
      setGameResult('GAME WON :)');
    }
  };

  const renderSquare = (square: Square): React.ReactNode => {
    if (square.isRevealed) {
      if (square.isMine) {
        return <img src="/images/minesweeper/bomb.png" alt="bomb" />;
      }
      if (square.neighbors > 0) {
        return <img src={`/images/minesweeper/ruutu_${square.neighbors}.png`} alt={`${square.neighbors}`} />;
      }
      return null;
    }
    if (square.isFlagged) {
      return <img src="/images/minesweeper/flag.png" alt="flag" />;
    }
    return null;
  };

  return (
    <div className="minesweeper-container">
      <div className="inputBox">
        <input
          type="number"
          value={mineNum}
          onChange={(e) => setMineNum(e.target.value)}
          placeholder="Number of Mines"
        />
        <input
          type="number"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
          placeholder="Width of Board"
        />
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          placeholder="Height of Board"
        />
        <button onClick={readInputValues}>Start Game!</button>
        <h2 className="flag-count">Number of remaining flags: {flagNum}</h2>
      </div>

      <div className="board-container">
        {board && (
          <div className="board" style={{ gridTemplateColumns: `repeat(${board[0].length}, 5vh)` }}>
            {board.map((row, y) =>
              row.map((square, x) => (
                <div
                  key={square.id}
                  className={`${square.isRevealed ? 'emptySquare' : 'square'} ${square.isMine ? 'mine' : ''} ${square.neighbors > 0 ? 'number' : ''}`}
                  onClick={() => handleLeftClick(x, y)}
                  onContextMenu={(e) => handleRightClick(e, x, y)}
                >
                  {renderSquare(square)}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {showResult && (
        <div className="gameResultBox">
          <h1>{gameResult}</h1>
        </div>
      )}
    </div>
  );
};

export default Minesweeper;
