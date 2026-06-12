import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

/* ================================================================
   CHESS
   ================================================================ */

type PT = "K" | "Q" | "R" | "B" | "N" | "P";
type Col = "w" | "b";
type Piece = { t: PT; c: Col } | null;
type Board = Piece[][];
type Sq = [number, number];
type Castle = { wK: boolean; wQ: boolean; bK: boolean; bQ: boolean };

const PSYM: Record<PT, [string, string]> = {
  K: ["♔", "♚"],
  Q: ["♕", "♛"],
  R: ["♖", "♜"],
  B: ["♗", "♝"],
  N: ["♘", "♞"],
  P: ["♙", "♟"],
};

function makeBoard(): Board {
  const b: Board = Array.from({ length: 8 }, () => Array(8).fill(null));
  const BACK: PT[] = ["R", "N", "B", "Q", "K", "B", "N", "R"];
  BACK.forEach((t, c) => {
    b[0][c] = { t, c: "b" };
    b[7][c] = { t, c: "w" };
  });
  for (let c = 0; c < 8; c++) {
    b[1][c] = { t: "P", c: "b" };
    b[6][c] = { t: "P", c: "w" };
  }
  return b;
}

function cloneBoard(b: Board): Board {
  return b.map((r) => [...r]);
}

function isAttacked(board: Board, sr: number, sc: number, by: Col): boolean {
  const inB = (r: number, c: number) => r >= 0 && r < 8 && c >= 0 && c < 8;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (!p || p.c !== by) continue;
      const { t, c: pc } = p;
      if (t === "P") {
        const d = pc === "w" ? -1 : 1;
        if (r + d === sr && (c - 1 === sc || c + 1 === sc)) return true;
      } else if (t === "N") {
        if (
          [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]].some(
            ([dr, dc]) => r + dr === sr && c + dc === sc
          )
        )
          return true;
      } else if (t === "K") {
        if (Math.abs(r - sr) <= 1 && Math.abs(c - sc) <= 1 && (r !== sr || c !== sc))
          return true;
      } else {
        const slide = (dr: number, dc: number) => {
          let nr = r + dr,
            nc = c + dc;
          while (inB(nr, nc)) {
            if (nr === sr && nc === sc) return true;
            if (board[nr][nc]) break;
            nr += dr;
            nc += dc;
          }
          return false;
        };
        if (
          (t === "B" || t === "Q") &&
          [[-1, -1], [-1, 1], [1, -1], [1, 1]].some(([dr, dc]) => slide(dr, dc))
        )
          return true;
        if (
          (t === "R" || t === "Q") &&
          [[-1, 0], [1, 0], [0, -1], [0, 1]].some(([dr, dc]) => slide(dr, dc))
        )
          return true;
      }
    }
  }
  return false;
}

function getPseudo(b: Board, r: number, c: number, ep: Sq | null, ca: Castle): Sq[] {
  const p = b[r][c];
  if (!p) return [];
  const { t, c: col } = p;
  const opp: Col = col === "w" ? "b" : "w";
  const ms: Sq[] = [];
  const inB = (r: number, c: number) => r >= 0 && r < 8 && c >= 0 && c < 8;
  const emp = (r: number, c: number) => inB(r, c) && !b[r][c];
  const isOp = (r: number, c: number) => inB(r, c) && b[r][c]?.c === opp;
  const free = (r: number, c: number) => emp(r, c) || isOp(r, c);

  if (t === "P") {
    const d = col === "w" ? -1 : 1;
    const startR = col === "w" ? 6 : 1;
    if (emp(r + d, c)) {
      ms.push([r + d, c]);
      if (r === startR && emp(r + 2 * d, c)) ms.push([r + 2 * d, c]);
    }
    if (isOp(r + d, c - 1)) ms.push([r + d, c - 1]);
    if (isOp(r + d, c + 1)) ms.push([r + d, c + 1]);
    if (ep && r + d === ep[0] && Math.abs(c - ep[1]) === 1) ms.push(ep);
  } else if (t === "N") {
    for (const [dr, dc] of [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1],
    ])
      if (free(r + dr, c + dc)) ms.push([r + dr, c + dc]);
  } else if (t === "K") {
    for (const [dr, dc] of [
      [-1, -1], [-1, 0], [-1, 1], [0, -1],
      [0, 1], [1, -1], [1, 0], [1, 1],
    ])
      if (free(r + dr, c + dc)) ms.push([r + dr, c + dc]);
    const row = col === "w" ? 7 : 0;
    const canK = col === "w" ? ca.wK : ca.bK;
    const canQ = col === "w" ? ca.wQ : ca.bQ;
    if (r === row && c === 4 && !isAttacked(b, row, 4, opp)) {
      if (canK && emp(row, 5) && emp(row, 6) && !isAttacked(b, row, 5, opp) && !isAttacked(b, row, 6, opp))
        ms.push([row, 6]);
      if (canQ && emp(row, 3) && emp(row, 2) && emp(row, 1) && !isAttacked(b, row, 3, opp) && !isAttacked(b, row, 2, opp))
        ms.push([row, 2]);
    }
  } else {
    const DIRS: Record<string, [number, number][]> = {
      B: [[-1, -1], [-1, 1], [1, -1], [1, 1]],
      R: [[-1, 0], [1, 0], [0, -1], [0, 1]],
      Q: [[-1, -1], [-1, 1], [1, -1], [1, 1], [-1, 0], [1, 0], [0, -1], [0, 1]],
    };
    for (const [dr, dc] of DIRS[t] ?? []) {
      let nr = r + dr, nc = c + dc;
      while (inB(nr, nc)) {
        if (emp(nr, nc)) ms.push([nr, nc]);
        else {
          if (isOp(nr, nc)) ms.push([nr, nc]);
          break;
        }
        nr += dr;
        nc += dc;
      }
    }
  }
  return ms;
}

function getLegal(b: Board, r: number, c: number, ep: Sq | null, ca: Castle): Sq[] {
  const p = b[r][c];
  if (!p) return [];
  const col = p.c;
  return getPseudo(b, r, c, ep, ca).filter(([tr, tc]) => {
    let nb = cloneBoard(b);
    nb[tr][tc] = nb[r][c];
    nb[r][c] = null;
    if (p.t === "P" && ep && tr === ep[0] && tc === ep[1])
      nb[col === "w" ? tr + 1 : tr - 1][tc] = null;
    if (p.t === "K") {
      const row = col === "w" ? 7 : 0;
      if (r === row && c === 4) {
        if (tc === 6) { nb[row][5] = nb[row][7]; nb[row][7] = null; }
        if (tc === 2) { nb[row][3] = nb[row][0]; nb[row][0] = null; }
      }
    }
    for (let i = 0; i < 8; i++)
      for (let j = 0; j < 8; j++)
        if (nb[i][j]?.t === "K" && nb[i][j]?.c === col)
          return !isAttacked(nb, i, j, col === "w" ? "b" : "w");
    return true;
  });
}

function anyLegal(b: Board, col: Col, ep: Sq | null, ca: Castle): boolean {
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++)
      if (b[r][c]?.c === col && getLegal(b, r, c, ep, ca).length > 0) return true;
  return false;
}

const SQ = 33;

function ChessGame() {
  const IC: Castle = { wK: true, wQ: true, bK: true, bQ: true };
  const [board, setBoard] = useState<Board>(makeBoard);
  const [turn, setTurn] = useState<Col>("w");
  const [sel, setSel] = useState<Sq | null>(null);
  const [legal, setLegal] = useState<Sq[]>([]);
  const [ep, setEp] = useState<Sq | null>(null);
  const [ca, setCa] = useState<Castle>(IC);
  const [status, setStatus] = useState<"ok" | "check" | "mate" | "stale">("ok");
  const [lastMove, setLastMove] = useState<[Sq, Sq] | null>(null);

  const reset = () => {
    setBoard(makeBoard());
    setTurn("w");
    setSel(null);
    setLegal([]);
    setEp(null);
    setCa(IC);
    setStatus("ok");
    setLastMove(null);
  };

  const doMove = (fr: number, fc: number, tr: number, tc: number) => {
    const p = board[fr][fc]!;
    const col = p.c;
    let nb = cloneBoard(board);
    nb[tr][tc] = nb[fr][fc];
    nb[fr][fc] = null;
    if (p.t === "P" && ep && tr === ep[0] && tc === ep[1])
      nb[col === "w" ? tr + 1 : tr - 1][tc] = null;
    if (p.t === "P" && (tr === 0 || tr === 7))
      nb[tr][tc] = { t: "Q", c: col };
    let nEp: Sq | null = null;
    if (p.t === "P" && Math.abs(tr - fr) === 2) nEp = [(fr + tr) / 2, tc];
    let nCa = { ...ca };
    if (p.t === "K") {
      const row = col === "w" ? 7 : 0;
      if (fr === row && fc === 4) {
        if (tc === 6) { nb[row][5] = nb[row][7]; nb[row][7] = null; }
        if (tc === 2) { nb[row][3] = nb[row][0]; nb[row][0] = null; }
        if (col === "w") { nCa.wK = false; nCa.wQ = false; }
        else { nCa.bK = false; nCa.bQ = false; }
      }
    }
    if (p.t === "R") {
      if (fr === 7 && fc === 0) nCa.wQ = false;
      if (fr === 7 && fc === 7) nCa.wK = false;
      if (fr === 0 && fc === 0) nCa.bQ = false;
      if (fr === 0 && fc === 7) nCa.bK = false;
    }
    if (tr === 7 && tc === 0) nCa.wQ = false;
    if (tr === 7 && tc === 7) nCa.wK = false;
    if (tr === 0 && tc === 0) nCa.bQ = false;
    if (tr === 0 && tc === 7) nCa.bK = false;

    const nt: Col = col === "w" ? "b" : "w";
    let ntKR = -1, ntKC = -1;
    for (let i = 0; i < 8; i++)
      for (let j = 0; j < 8; j++)
        if (nb[i][j]?.t === "K" && nb[i][j]?.c === nt) { ntKR = i; ntKC = j; }
    const check = isAttacked(nb, ntKR, ntKC, col);
    const hasL = anyLegal(nb, nt, nEp, nCa);
    const st: "ok" | "check" | "mate" | "stale" = !hasL
      ? check ? "mate" : "stale"
      : check ? "check" : "ok";

    setBoard(nb);
    setTurn(nt);
    setEp(nEp);
    setCa(nCa);
    setStatus(st);
    setSel(null);
    setLegal([]);
    setLastMove([[fr, fc], [tr, tc]]);
  };

  const click = (r: number, c: number) => {
    if (status === "mate" || status === "stale") return;
    if (sel && legal.some(([lr, lc]) => lr === r && lc === c)) {
      doMove(sel[0], sel[1], r, c);
      return;
    }
    if (board[r][c]?.c === turn) {
      setSel([r, c]);
      setLegal(getLegal(board, r, c, ep, ca));
    } else {
      setSel(null);
      setLegal([]);
    }
  };

  const msg =
    status === "mate" ? `${turn === "w" ? "Black" : "White"} wins!` :
    status === "stale" ? "Stalemate — draw" :
    status === "check" ? `${turn === "w" ? "White" : "Black"} in check!` :
    `${turn === "w" ? "White" : "Black"}'s turn`;

  return (
    <div className="flex flex-col items-center h-full py-1.5">
      <p className="text-[10px] font-semibold text-muted-foreground mb-1.5 tracking-wide">{msg}</p>
      <div className="border border-border">
        {Array.from({ length: 8 }, (_, r) => (
          <div key={r} className="flex">
            {Array.from({ length: 8 }, (_, c) => {
              const light = (r + c) % 2 === 0;
              const isSel = sel?.[0] === r && sel?.[1] === c;
              const isLegal = legal.some(([lr, lc]) => lr === r && lc === c);
              const isLast =
                lastMove &&
                ((lastMove[0][0] === r && lastMove[0][1] === c) ||
                  (lastMove[1][0] === r && lastMove[1][1] === c));
              const piece = board[r][c];
              return (
                <div
                  key={c}
                  onClick={() => click(r, c)}
                  style={{
                    width: SQ,
                    height: SQ,
                    fontSize: SQ * 0.72,
                    lineHeight: 1,
                    background: isSel
                      ? "rgba(255,200,0,0.6)"
                      : isLast
                      ? "rgba(255,220,50,0.28)"
                      : light
                      ? "hsl(var(--muted)/0.7)"
                      : "hsl(var(--foreground)/0.13)",
                  }}
                  className="relative flex items-center justify-center cursor-pointer select-none"
                >
                  {isLegal &&
                    (piece ? (
                      <div className="absolute inset-0.5 rounded-full border-2 border-black/30 pointer-events-none" />
                    ) : (
                      <div className="absolute w-2.5 h-2.5 rounded-full bg-black/25 pointer-events-none" />
                    ))}
                  {piece && (
                    <span
                      className={
                        piece.c === "w"
                          ? "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,1)]"
                          : "text-gray-900"
                      }
                    >
                      {PSYM[piece.t][piece.c === "w" ? 0 : 1]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <button
        onClick={reset}
        className="mt-2 text-[10px] font-semibold border border-border px-3 py-1 hover:bg-muted transition-colors"
      >
        New Game
      </button>
    </div>
  );
}

/* ================================================================
   TIC TAC TOE
   ================================================================ */

const LINES: [number, number, number][] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function TicTacToeGame() {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [xNext, setXNext] = useState(true);

  const win = LINES.find(
    ([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c]
  );
  const draw = !win && board.every(Boolean);

  const click = (i: number) => {
    if (board[i] || win) return;
    const nb = [...board];
    nb[i] = xNext ? "X" : "O";
    setBoard(nb);
    setXNext(!xNext);
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setXNext(true);
  };

  const msg = win ? `${board[win[0]]} wins!` : draw ? "Draw!" : null;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-3">
      <p className="text-[10px] font-semibold text-muted-foreground tracking-wide h-4">
        {msg ?? (xNext ? "X to move" : "O to move")}
      </p>
      <div className="grid grid-cols-3 border border-border">
        {board.map((cell, i) => {
          const isWin = win?.includes(i);
          return (
            <div
              key={i}
              onClick={() => click(i)}
              className={[
                "w-[76px] h-[76px] flex items-center justify-center text-2xl font-bold cursor-pointer select-none transition-colors",
                i % 3 < 2 ? "border-r border-border" : "",
                i < 6 ? "border-b border-border" : "",
                isWin ? "bg-foreground/10" : "hover:bg-muted/50",
              ].join(" ")}
            >
              <span className={cell === "X" ? "text-foreground" : "text-muted-foreground"}>
                {cell}
              </span>
            </div>
          );
        })}
      </div>
      <button
        onClick={reset}
        className="text-[10px] font-semibold border border-border px-3 py-1 hover:bg-muted transition-colors"
      >
        Reset
      </button>
    </div>
  );
}

/* ================================================================
   SNAKE
   ================================================================ */

const GW = 18, GH = 14, CS = 14;
type Pt = { x: number; y: number };
type D = "u" | "d" | "l" | "r";

function SnakeGame() {
  const initSnake = [{ x: 9, y: 7 }, { x: 8, y: 7 }, { x: 7, y: 7 }];
  const initFood = { x: 14, y: 7 };
  const [cells, setCells] = useState<{ snake: Pt[]; food: Pt }>({
    snake: initSnake,
    food: initFood,
  });
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<"idle" | "running" | "over">("idle");
  const dirRef = useRef<D>("r");
  const stateRef = useRef<{ snake: Pt[]; food: Pt; score: number; alive: boolean }>({
    snake: initSnake,
    food: initFood,
    score: 0,
    alive: false,
  });

  const randFood = (s: Pt[]): Pt => {
    let f: Pt;
    do {
      f = { x: Math.floor(Math.random() * GW), y: Math.floor(Math.random() * GH) };
    } while (s.some((p) => p.x === f.x && p.y === f.y));
    return f;
  };

  const steer = (d: D) => {
    const cur = dirRef.current;
    if (
      (d === "u" && cur !== "d") ||
      (d === "d" && cur !== "u") ||
      (d === "l" && cur !== "r") ||
      (d === "r" && cur !== "l")
    )
      dirRef.current = d;
  };

  const start = () => {
    const s = [{ x: 9, y: 7 }, { x: 8, y: 7 }, { x: 7, y: 7 }];
    const f = randFood(s);
    stateRef.current = { snake: s, food: f, score: 0, alive: true };
    dirRef.current = "r";
    setCells({ snake: s, food: f });
    setScore(0);
    setPhase("running");
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const m: Record<string, D> = {
        ArrowUp: "u", ArrowDown: "d", ArrowLeft: "l", ArrowRight: "r",
      };
      if (m[e.key]) { steer(m[e.key]); e.preventDefault(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  useEffect(() => {
    if (phase !== "running") return;
    let lastTime = 0;
    let rafId: number;
    const MOVE: Record<D, Pt> = {
      u: { x: 0, y: -1 }, d: { x: 0, y: 1 },
      l: { x: -1, y: 0 }, r: { x: 1, y: 0 },
    };
    const loop = (now: number) => {
      const speed = Math.max(90, 210 - stateRef.current.score * 8);
      if (now - lastTime >= speed) {
        lastTime = now;
        const { snake, food } = stateRef.current;
        const mv = MOVE[dirRef.current];
        const head = { x: snake[0].x + mv.x, y: snake[0].y + mv.y };
        if (
          head.x < 0 || head.x >= GW ||
          head.y < 0 || head.y >= GH ||
          snake.some((s) => s.x === head.x && s.y === head.y)
        ) {
          stateRef.current.alive = false;
          setPhase("over");
          return;
        }
        const ate = head.x === food.x && head.y === food.y;
        const ns = [head, ...snake];
        if (!ate) ns.pop();
        const nf = ate ? randFood(ns) : food;
        const newScore = stateRef.current.score + (ate ? 1 : 0);
        stateRef.current = { snake: ns, food: nf, score: newScore, alive: true };
        if (ate) setScore(newScore);
        setCells({ snake: ns, food: nf });
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [phase]);

  const DBtn = ({ d, lbl }: { d: D; lbl: string }) => (
    <button
      onClick={() => { steer(d); if (phase === "idle") start(); }}
      className="w-8 h-8 flex items-center justify-center border border-border text-xs font-bold hover:bg-muted active:scale-95 transition-all select-none"
    >
      {lbl}
    </button>
  );

  return (
    <div className="flex flex-col items-center h-full py-1.5 gap-2">
      <p className="text-[10px] font-semibold text-muted-foreground tracking-wide">Score: {score}</p>
      <div
        className="relative border border-border flex-shrink-0"
        style={{ width: GW * CS, height: GH * CS }}
      >
        {cells.snake.map((s, i) => (
          <div
            key={i}
            className="absolute bg-foreground"
            style={{ left: s.x * CS, top: s.y * CS, width: CS - 1, height: CS - 1 }}
          />
        ))}
        <div
          className="absolute bg-foreground rounded-full"
          style={{
            left: cells.food.x * CS + 1,
            top: cells.food.y * CS + 1,
            width: CS - 3,
            height: CS - 3,
          }}
        />
        {phase === "idle" && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/90">
            <button
              onClick={start}
              className="text-[10px] font-semibold border border-border px-3 py-1.5 hover:bg-muted"
            >
              Start
            </button>
          </div>
        )}
        {phase === "over" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 gap-1">
            <p className="text-xs font-bold text-foreground">Game Over</p>
            <p className="text-[10px] text-muted-foreground">Score: {score}</p>
            <button
              onClick={start}
              className="mt-0.5 text-[10px] font-semibold border border-border px-3 py-1 hover:bg-muted"
            >
              Restart
            </button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-3 gap-0.5" style={{ width: 32 * 3 + 4 }}>
        <div />
        <DBtn d="u" lbl="↑" />
        <div />
        <DBtn d="l" lbl="←" />
        <DBtn d="d" lbl="↓" />
        <DBtn d="r" lbl="→" />
      </div>
    </div>
  );
}

/* ================================================================
   WIDGET SHELL
   ================================================================ */

type TabId = "chess" | "ttt" | "snake";

const TABS: { id: TabId; icon: string; label: string }[] = [
  { id: "chess", icon: "♟", label: "Chess" },
  { id: "ttt", icon: "#", label: "Tic Tac Toe" },
  { id: "snake", icon: "≋", label: "Snake" },
];

function GamepadSVG() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="6" width="20" height="12" rx="6" />
      <path d="M8 12h4m-2-2v4" />
      <circle cx="17" cy="11" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="13" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

interface GameWidgetProps {
  externalOpen?: boolean;
  onExternalOpen?: (v: boolean) => void;
}

export function GameWidget({ externalOpen, onExternalOpen }: GameWidgetProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<TabId>("chess");
  const [gameKey, setGameKey] = useState(0);

  useEffect(() => {
    if (externalOpen) {
      setOpen(true);
      onExternalOpen?.(false);
    }
  }, [externalOpen, onExternalOpen]);

  const switchTab = (t: TabId) => {
    setTab(t);
    setGameKey((k) => k + 1);
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-4 left-4 z-50 w-10 h-10 flex items-center justify-center bg-foreground text-background rounded-full shadow-lg hover:shadow-xl transition-shadow"
        aria-label="Open games"
      >
        <GamepadSVG />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-16 left-4 z-50 w-[300px] flex flex-col bg-background border border-border rounded-[20px] shadow-2xl overflow-hidden"
            style={{ height: 520 }}
          >
            <div className="flex items-center justify-between px-4 h-11 border-b border-border flex-shrink-0">
              <span className="text-sm font-semibold text-foreground">
                {TABS.find((t) => t.id === tab)?.label}
              </span>
              <button
                onClick={() => setOpen(false)}
                className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden">
              {tab === "chess" && <ChessGame key={gameKey} />}
              {tab === "ttt" && <TicTacToeGame key={gameKey} />}
              {tab === "snake" && <SnakeGame key={gameKey} />}
            </div>

            <div className="h-12 border-t border-border flex flex-shrink-0">
              {TABS.map(({ id, icon, label }) => (
                <button
                  key={id}
                  onClick={() => switchTab(id)}
                  className={[
                    "flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors text-[9px] font-semibold tracking-wide uppercase",
                    tab === id
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                >
                  <span className="text-base leading-none">{icon}</span>
                  <span>{label.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
