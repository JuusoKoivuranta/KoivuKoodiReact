import React, { useState } from 'react';
import './Chess.css';
import ThemePanel from './components/ThemePanel';
import MoveHistory from './components/MoveHistory';
import NavControls from './components/NavControls';
import ChessGameArea from './components/ChessGameArea';
import { useChessGame } from './hooks/useChessGame';
import { resetBoardState } from './utils/boardUtils';

const Chess: React.FC = () => {
  const [isThemePanelOpen, setIsThemePanelOpen] = useState<boolean>(false);
  
  const {
    socket,
    gameState,
    playWhite,
    board,
    selectedPiece,
    timers,
    moves,
    userCount,
    setGameState,
    setPlayWhite,
    setBoard,
    setMoves,
    setMoveCounter,
    setSelectedPiece,
    setTimers,
    handlePieceClick,
    handleTimerUpdate
  } = useChessGame();

  const handleBoardReset = () => {
    const resetState = resetBoardState();
    setGameState(false);
    setBoard(resetState.board);
    setMoves(resetState.moves);
    setMoveCounter(resetState.moveCounter);
    setSelectedPiece(resetState.selectedPiece);
    setTimers(resetState.timers);
  };

  return (
    <div className="chess-container">
      <NavControls
        socket={socket}
        gameState={gameState}
        userCount={userCount}
        playWhite={playWhite}
        onGameStateChange={setGameState}
        onPlayWhiteChange={setPlayWhite}
        onBoardReset={handleBoardReset}
        onTimerSet={setTimers}
        onThemeToggle={() => setIsThemePanelOpen(!isThemePanelOpen)}
      />

      <ChessGameArea
        board={board}
        selectedPiece={selectedPiece}
        timers={timers}
        gameState={gameState}
        playWhite={playWhite}
        onSquareClick={handlePieceClick}
        onTimerUpdate={handleTimerUpdate}
      />

      <div className="right-panel">
        <MoveHistory moves={moves} />
      </div>

      <ThemePanel
        isOpen={isThemePanelOpen}
        onClose={() => setIsThemePanelOpen(false)}
        onThemeChange={(theme) => {
          // Apply theme colors to CSS custom properties
          const root = document.documentElement;
          root.style.setProperty('--primary-color', theme[0]);
          root.style.setProperty('--secondary-color', theme[1]);
          root.style.setProperty('--nav-background', theme[2]);
          root.style.setProperty('--button-background', theme[3]);
          root.style.setProperty('--white-square', theme[4]);
          root.style.setProperty('--black-square', theme[5]);
          root.style.setProperty('--text-color', theme[6] || '#333');
          root.style.setProperty('--timer-white-bg', theme[7] || '#ECE3CE');
          root.style.setProperty('--timer-white-text', theme[8] || '#333');
          root.style.setProperty('--timer-black-bg', theme[9] || '#3A4D39');
          root.style.setProperty('--timer-black-text', theme[10] || '#ECE3CE');
          
          console.log('Theme changed to:', theme);
        }}
      />
    </div>
  );
};

export default Chess;