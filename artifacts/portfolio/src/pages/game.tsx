import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowLeft, Sun, Moon, RotateCcw } from "lucide-react";
import { useLocation } from "wouter";
import { useTheme } from "@/lib/theme";

const COLS = 20;
const ROWS = 20;
const CELL = 24;
const INITIAL_SPEED = 130;

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Pos = { x: number; y: number };

function random(exclude: Pos[]): Pos {
  let pos: Pos;
  do {
    pos = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
  } while (exclude.some((e) => e.x === pos.x && e.y === pos.y));
  return pos;
}

export default function Game() {
  const [, navigate] = useLocation();
  const { theme, toggle } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const snakeRef = useRef<Pos[]>([{ x: 10, y: 10 }]);
  const dirRef = useRef<Direction>("RIGHT");
  const nextDirRef = useRef<Direction>("RIGHT");
  const foodRef = useRef<Pos>(random([{ x: 10, y: 10 }]));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem("snake-best") || 0));
  const [state, setState] = useState<"idle" | "playing" | "dead">("idle");
  const [displayScore, setDisplayScore] = useState(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const isDark = document.documentElement.classList.contains("dark");

    const bg = isDark ? "#0d0d0d" : "#ffffff";
    const grid = isDark ? "#1a1a1a" : "#f0f0f0";
    const snake = isDark ? "#f2f2f2" : "#111111";
    const snakeHead = isDark ? "#ffffff" : "#000000";
    const food = isDark ? "#ffffff" : "#000000";

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);

    // Grid dots
    ctx.fillStyle = grid;
    for (let x = 0; x < COLS; x++) {
      for (let y = 0; y < ROWS; y++) {
        ctx.fillRect(x * CELL + CELL / 2 - 1, y * CELL + CELL / 2 - 1, 2, 2);
      }
    }

    // Food — pulsing square
    const f = foodRef.current;
    ctx.fillStyle = food;
    ctx.fillRect(f.x * CELL + 4, f.y * CELL + 4, CELL - 8, CELL - 8);

    // Snake
    const s = snakeRef.current;
    s.forEach((seg, i) => {
      const isHead = i === 0;
      const padding = isHead ? 2 : 3;
      ctx.fillStyle = isHead ? snakeHead : snake;
      ctx.fillRect(
        seg.x * CELL + padding,
        seg.y * CELL + padding,
        CELL - padding * 2,
        CELL - padding * 2
      );
    });
  }, []);

  const reset = useCallback(() => {
    snakeRef.current = [{ x: 10, y: 10 }];
    dirRef.current = "RIGHT";
    nextDirRef.current = "RIGHT";
    foodRef.current = random([{ x: 10, y: 10 }]);
    setScore(0);
    setDisplayScore(0);
    setState("idle");
    draw();
  }, [draw]);

  const tick = useCallback(() => {
    const snake = snakeRef.current;
    dirRef.current = nextDirRef.current;
    const head = snake[0];

    const delta: Record<Direction, Pos> = {
      UP: { x: 0, y: -1 },
      DOWN: { x: 0, y: 1 },
      LEFT: { x: -1, y: 0 },
      RIGHT: { x: 1, y: 0 },
    };
    const d = delta[dirRef.current];
    const next = { x: head.x + d.x, y: head.y + d.y };

    // Wall collision
    if (next.x < 0 || next.x >= COLS || next.y < 0 || next.y >= ROWS) {
      clearInterval(intervalRef.current!);
      setState("dead");
      return;
    }
    // Self collision
    if (snake.some((s) => s.x === next.x && s.y === next.y)) {
      clearInterval(intervalRef.current!);
      setState("dead");
      return;
    }

    const ate = next.x === foodRef.current.x && next.y === foodRef.current.y;
    const newSnake = [next, ...snake];
    if (!ate) newSnake.pop();

    snakeRef.current = newSnake;

    if (ate) {
      foodRef.current = random(newSnake);
      setScore((s) => {
        const n = s + 1;
        setDisplayScore(n);
        setBest((b) => {
          const nb = Math.max(b, n);
          localStorage.setItem("snake-best", String(nb));
          return nb;
        });
        return n;
      });
    }

    draw();
  }, [draw]);

  const start = useCallback(() => {
    reset();
    setState("playing");
    intervalRef.current = setInterval(tick, INITIAL_SPEED);
    draw();
  }, [reset, tick, draw]);

  // Restart after reset to playing
  useEffect(() => {
    if (state === "playing" && intervalRef.current === null) {
      intervalRef.current = setInterval(tick, INITIAL_SPEED);
    }
    return () => {
      if (state !== "playing" && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state, tick]);

  // Keys
  useEffect(() => {
    const map: Record<string, Direction> = {
      ArrowUp: "UP", w: "UP", W: "UP",
      ArrowDown: "DOWN", s: "DOWN", S: "DOWN",
      ArrowLeft: "LEFT", a: "LEFT", A: "LEFT",
      ArrowRight: "RIGHT", d: "RIGHT", D: "RIGHT",
    };
    const opp: Record<Direction, Direction> = {
      UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT",
    };
    const handler = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (state === "idle" || state === "dead") start();
        return;
      }
      const dir = map[e.key];
      if (!dir) return;
      e.preventDefault();
      if (dir !== opp[dirRef.current]) {
        nextDirRef.current = dir;
      }
      if (state === "idle") start();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [state, start]);

  // Mobile swipe
  useEffect(() => {
    let sx = 0, sy = 0;
    const opp: Record<Direction, Direction> = {
      UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT",
    };
    const ts = (e: TouchEvent) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; };
    const te = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      let dir: Direction;
      if (Math.abs(dx) > Math.abs(dy)) {
        dir = dx > 0 ? "RIGHT" : "LEFT";
      } else {
        dir = dy > 0 ? "DOWN" : "UP";
      }
      if (dir !== opp[dirRef.current]) nextDirRef.current = dir;
      if (state === "idle" || state === "dead") start();
    };
    window.addEventListener("touchstart", ts, { passive: true });
    window.addEventListener("touchend", te, { passive: true });
    return () => {
      window.removeEventListener("touchstart", ts);
      window.removeEventListener("touchend", te);
    };
  }, [state, start]);

  // Initial draw
  useEffect(() => {
    draw();
  }, [draw, theme]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const isDark = theme === "dark";

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="max-w-[1000px] mx-auto px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => { if (intervalRef.current) clearInterval(intervalRef.current); navigate("/"); }}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <span className="text-sm text-border">|</span>
            <span className="text-sm font-medium text-foreground">Snake</span>
          </div>
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center pt-14 pb-8 px-4">
        {/* Score bar */}
        <div className="w-full max-w-[480px] flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Score</p>
            <p className="text-3xl font-bold text-foreground tabular-nums">{displayScore}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Best</p>
            <p className="text-3xl font-bold text-foreground tabular-nums">{best}</p>
          </div>
        </div>

        {/* Canvas */}
        <div className="relative border border-border" style={{ width: COLS * CELL, height: ROWS * CELL }}>
          <canvas
            ref={canvasRef}
            width={COLS * CELL}
            height={ROWS * CELL}
            className="block"
          />

          {/* Overlay: idle */}
          {state === "idle" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
              <p className="text-2xl font-bold text-foreground mb-2">Snake</p>
              <p className="text-sm text-muted-foreground mb-6">Use arrow keys or WASD to move</p>
              <button
                onClick={start}
                className="bg-foreground text-background text-sm font-semibold px-6 py-2.5 hover:opacity-80 transition-opacity"
              >
                Start Game
              </button>
            </div>
          )}

          {/* Overlay: dead */}
          {state === "dead" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
              <p className="text-2xl font-bold text-foreground mb-1">Game Over</p>
              <p className="text-sm text-muted-foreground mb-6">
                Score: <span className="font-semibold text-foreground">{displayScore}</span>
                {displayScore === best && best > 0 && (
                  <span className="ml-2 text-xs font-semibold uppercase tracking-widest">· New best!</span>
                )}
              </p>
              <button
                onClick={start}
                className="flex items-center gap-2 bg-foreground text-background text-sm font-semibold px-6 py-2.5 hover:opacity-80 transition-opacity"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Play Again
              </button>
            </div>
          )}
        </div>

        {/* Controls hint */}
        <div className="mt-5 flex gap-6 text-xs text-muted-foreground">
          <span>↑ ↓ ← → or WASD to move</span>
          <span>Space / Enter to start</span>
        </div>

        {/* Mobile D-pad */}
        <div className="mt-6 grid grid-cols-3 gap-2 sm:hidden">
          {[
            { dir: "UP" as Direction, label: "↑", col: 2, row: 1 },
            { dir: "LEFT" as Direction, label: "←", col: 1, row: 2 },
            { dir: "DOWN" as Direction, label: "↓", col: 2, row: 2 },
            { dir: "RIGHT" as Direction, label: "→", col: 3, row: 2 },
          ].map(({ dir, label, col, row }) => {
            const opp: Record<Direction, Direction> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
            return (
              <button
                key={dir}
                style={{ gridColumn: col, gridRow: row }}
                onTouchStart={(e) => {
                  e.preventDefault();
                  if (dir !== opp[dirRef.current]) nextDirRef.current = dir;
                  if (state === "idle" || state === "dead") start();
                }}
                className="w-12 h-12 border border-border text-foreground text-lg font-medium flex items-center justify-center hover:bg-muted active:bg-muted transition-colors"
              >
                {label}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
