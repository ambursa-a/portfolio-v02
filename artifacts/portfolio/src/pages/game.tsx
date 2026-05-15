import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Sun, Moon, RotateCcw } from "lucide-react";
import { useLocation } from "wouter";
import { useTheme } from "@/lib/theme";
import { motion, AnimatePresence } from "framer-motion";

type Cell = "X" | "O" | null;
type Result = "X" | "O" | "draw" | null;

const WINS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function getWinLine(board: Cell[]): number[] | null {
  for (const line of WINS) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return line;
  }
  return null;
}

function getResult(board: Cell[]): Result {
  const line = getWinLine(board);
  if (line) return board[line[0]] as "X" | "O";
  if (board.every(Boolean)) return "draw";
  return null;
}

function aiMove(board: Cell[]): number {
  const empty = board.reduce<number[]>((a, c, i) => (c ? a : [...a, i]), []);
  // Win if possible
  for (const i of empty) {
    const b = [...board]; b[i] = "O";
    if (getResult(b) === "O") return i;
  }
  // Block player win
  for (const i of empty) {
    const b = [...board]; b[i] = "X";
    if (getResult(b) === "X") return i;
  }
  // Take centre
  if (empty.includes(4)) return 4;
  // Take corner
  const corners = [0, 2, 6, 8].filter(i => empty.includes(i));
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
  // Take any
  return empty[Math.floor(Math.random() * empty.length)];
}

const EMPTY: Cell[] = Array(9).fill(null);

export default function TicTacToe() {
  const [, navigate] = useLocation();
  const { theme, toggle } = useTheme();

  const [board, setBoard] = useState<Cell[]>([...EMPTY]);
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ttt-scores") || "{}"); }
    catch { return {}; }
  });
  const [status, setStatus] = useState<"playing" | "over">("playing");
  const [result, setResult] = useState<Result>(null);
  const [aiThinking, setAiThinking] = useState(false);

  const winLine = getWinLine(board);
  const wins = scores.wins || 0;
  const losses = scores.losses || 0;
  const draws = scores.draws || 0;

  const updateScores = useCallback((r: Result) => {
    setScores((prev: Record<string, number>) => {
      const next = {
        wins: (prev.wins || 0) + (r === "X" ? 1 : 0),
        losses: (prev.losses || 0) + (r === "O" ? 1 : 0),
        draws: (prev.draws || 0) + (r === "draw" ? 1 : 0),
      };
      localStorage.setItem("ttt-scores", JSON.stringify(next));
      return next;
    });
  }, []);

  const handleClick = useCallback((i: number) => {
    if (!xIsNext || board[i] || status === "over" || aiThinking) return;
    const next = [...board];
    next[i] = "X";
    setBoard(next);
    const r = getResult(next);
    if (r) {
      setResult(r); setStatus("over"); updateScores(r);
    } else {
      setXIsNext(false);
    }
  }, [board, xIsNext, status, aiThinking, updateScores]);

  // AI move
  useEffect(() => {
    if (xIsNext || status === "over") return;
    setAiThinking(true);
    const t = setTimeout(() => {
      const idx = aiMove(board);
      const next = [...board];
      next[idx] = "O";
      setBoard(next);
      const r = getResult(next);
      if (r) {
        setResult(r); setStatus("over"); updateScores(r);
      } else {
        setXIsNext(true);
      }
      setAiThinking(false);
    }, 400);
    return () => clearTimeout(t);
  }, [xIsNext, board, status, updateScores]);

  const reset = () => {
    setBoard([...EMPTY]);
    setXIsNext(true);
    setStatus("playing");
    setResult(null);
    setAiThinking(false);
  };

  const isDark = theme === "dark";

  const statusMsg = status === "over"
    ? result === "X" ? "You win!" : result === "O" ? "AI wins!" : "Draw!"
    : xIsNext ? "Your turn" : "AI thinking…";

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="max-w-[600px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <span className="text-muted-foreground text-sm">|</span>
            <span className="text-sm font-medium text-foreground">Tic Tac Toe</span>
          </div>
          <button onClick={toggle} aria-label="Toggle theme"
            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center pt-14 px-4 pb-12">
        {/* Score row */}
        <div className="w-full max-w-[340px] flex justify-between mb-8 text-center">
          {[{ label: "You (X)", val: wins, color: "text-foreground" },
            { label: "Draws", val: draws, color: "text-muted-foreground" },
            { label: "AI (O)", val: losses, color: "text-muted-foreground" },
          ].map(({ label, val, color }) => (
            <div key={label}>
              <p className={`text-3xl font-bold tabular-nums ${color}`}>{val}</p>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Status */}
        <div className="mb-6 h-7 flex items-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={statusMsg}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2 }}
              className={`text-sm font-semibold tracking-wide ${
                result === "X" ? "text-foreground" :
                result === "O" ? "text-muted-foreground" :
                "text-muted-foreground"
              }`}
            >
              {statusMsg}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Board */}
        <div className="relative">
          <div className="grid grid-cols-3 border border-border">
            {board.map((cell, i) => {
              const row = Math.floor(i / 3);
              const col = i % 3;
              const isWin = winLine?.includes(i);
              return (
                <motion.button
                  key={i}
                  onClick={() => handleClick(i)}
                  whileTap={!cell && xIsNext && status === "playing" ? { scale: 0.92 } : {}}
                  className={[
                    "w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center text-3xl sm:text-4xl font-bold transition-colors",
                    col < 2 ? "border-r border-border" : "",
                    row < 2 ? "border-b border-border" : "",
                    isWin ? "bg-foreground/8" : "",
                    !cell && xIsNext && status === "playing" ? "hover:bg-muted/60 cursor-pointer" : "cursor-default",
                  ].join(" ")}
                >
                  <AnimatePresence>
                    {cell && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className={cell === "X" ? "text-foreground" : "text-muted-foreground"}
                      >
                        {cell}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>

          {/* Win overlay line */}
          {winLine && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              className="absolute inset-0 pointer-events-none flex items-center justify-center"
            />
          )}
        </div>

        {/* Controls */}
        <div className="mt-8 flex gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 bg-foreground text-background text-sm font-semibold px-6 py-2.5 hover:opacity-80 transition-opacity"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {status === "over" ? "Play Again" : "Reset"}
          </button>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">You are X · AI is O</p>
      </main>
    </div>
  );
}
