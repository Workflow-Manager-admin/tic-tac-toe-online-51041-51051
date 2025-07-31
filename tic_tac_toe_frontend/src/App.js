import React, { useState, useEffect } from "react";
import "./App.css";

// Theme color variables (sync with App.css for user-customization)
const THEME = {
  primary: "#1976D2",
  secondary: "#424242",
  accent: "#FFC107",
  boardBg: "#fff",
  boardBorder: "#e0e0e0",
  cellHover: "#F5F6FA",
};

// Square component for Tic Tac Toe cell
// PUBLIC_INTERFACE
function Square({ value, onClick, highlight }) {
  return (
    <button
      className={`ttt-cell${highlight ? " highlight" : ""}`}
      onClick={onClick}
      aria-label={value ? `Taken: ${value}` : "Choose this cell"}
      tabIndex={value ? -1 : 0}
      disabled={!!value}
      type="button"
    >
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
function Board({ squares, onCellClick, winLine }) {
  // Highlight winning squares
  const getHighlight = (i) => winLine && winLine.includes(i);

  return (
    <div className="ttt-board" role="grid" aria-label="Tic Tac Toe Board">
      {[0, 1, 2].map((row) => (
        <div className="ttt-row" key={row} role="row">
          {[0, 1, 2].map((col) => {
            const idx = row * 3 + col;
            return (
              <Square
                key={idx}
                value={squares[idx]}
                onClick={() => onCellClick(idx)}
                highlight={getHighlight(idx)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

// Calculates winner and winning line if present
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // columns
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ];
  for (let i = 0; i < lines.length; ++i) {
    const [a, b, c] = lines[i];
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return null;
}

// PUBLIC_INTERFACE
function StatusBar({ current, gameOver, winner, isDraw, onRestart }) {
  let status;
  if (gameOver) {
    if (winner) {
      status = (
        <span>
          <strong style={{ color: THEME.accent }}>{winner}</strong> wins!
        </span>
      );
    } else if (isDraw) {
      status = <span>It's a <strong style={{ color: THEME.secondary }}>Draw</strong>!</span>;
    }
  } else {
    status = (
      <span>
        Next:{" "}
        <strong
          style={{
            color: current === "X" ? THEME.primary : THEME.secondary,
          }}
        >
          {current}
        </strong>
      </span>
    );
  }
  return (
    <div className="ttt-statusbar">
      <div className="ttt-status">{status}</div>
      <button className="ttt-restart" onClick={onRestart} aria-label="Restart game" type="button">
        Restart Game
      </button>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  // Game state: 9 squares, X goes first
  const [history, setHistory] = useState([
    {
      squares: Array(9).fill(null),
      player: "X",
    },
  ]);
  const [step, setStep] = useState(0);

  // Sync document theme colors (light theme always, per requirements)
  useEffect(() => {
    document.documentElement.style.setProperty("--ttt-primary", THEME.primary);
    document.documentElement.style.setProperty("--ttt-secondary", THEME.secondary);
    document.documentElement.style.setProperty("--ttt-accent", THEME.accent);
  }, []);

  const current = history[step];
  const winnerInfo = calculateWinner(current.squares);
  const isDraw = !winnerInfo && current.squares.every(Boolean);

  // PUBLIC_INTERFACE
  const handleCellClick = (idx) => {
    if (current.squares[idx] || winnerInfo) return;
    const nextSquares = current.squares.slice();
    nextSquares[idx] = current.player;
    setHistory([
      ...history.slice(0, step + 1),
      {
        squares: nextSquares,
        player: current.player === "X" ? "O" : "X",
      },
    ]);
    setStep((s) => s + 1);
  };

  // PUBLIC_INTERFACE
  const handleRestart = () => {
    setHistory([
      {
        squares: Array(9).fill(null),
        player: "X",
      },
    ]);
    setStep(0);
  };

  // Game layout: center board, status above, mobile/desktop responsive
  return (
    <main className="ttt-root">
      <div className="ttt-container">
        <h1 className="ttt-title">
          <span
            className="ttt-icon"
            style={{
              color: THEME.primary,
              marginRight: 8,
              fontWeight: 700,
            }}
            aria-hidden="true"
          >
            &#9945;
          </span>
          Tic Tac Toe
        </h1>
        <StatusBar
          current={current.player}
          gameOver={!!winnerInfo || isDraw}
          winner={winnerInfo ? winnerInfo.winner : null}
          isDraw={isDraw}
          onRestart={handleRestart}
        />
        <Board
          squares={current.squares}
          onCellClick={handleCellClick}
          winLine={winnerInfo ? winnerInfo.line : null}
        />
        <footer className="ttt-footer">
          <span>
            Two player game &mdash; <span style={{
              color: THEME.primary,
              fontWeight: "bold",
            }}>Modern Minimal Design</span>
          </span>
        </footer>
      </div>
    </main>
  );
}

export default App;
