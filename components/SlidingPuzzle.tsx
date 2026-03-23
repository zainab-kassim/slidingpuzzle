'use client';
import { useState, useCallback, useRef, useEffect } from 'react';

const IMAGE_URL =
  'https://oqk3pkp15w.ufs.sh/f/H3vgRA928TvFQAJ53T7ugWwrjJ4pqYinMDP7NROVkxHdfK9B';

const GRID = 3;
const SIZE = 400; // total puzzle size px
const TILE = SIZE / GRID;

// Solved order: [0,1,2,3,4,5,6,7,8] where 8 = blank
function createShuffled(): number[] {
  // Start solved, then make N valid random moves so it's always solvable
  let tiles = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // 8 = blank
  let blankIdx = 8;

  const moves = 1000000;
  for (let i = 0; i < moves; i++) {
    const neighbors = getSwappable(blankIdx);
    const pick = neighbors[Math.floor(Math.random() * neighbors.length)];
    // swap
    [tiles[blankIdx], tiles[pick]] = [tiles[pick], tiles[blankIdx]];
    blankIdx = pick;
  }
  // Make sure it's not accidentally solved
  if (tiles.every((t, i) => t === i)) {
    [tiles[0], tiles[1]] = [tiles[1], tiles[0]];
  }
  return tiles;
}

function getSwappable(blankIdx: number): number[] {
  const row = Math.floor(blankIdx / GRID);
  const col = blankIdx % GRID;
  const neighbors: number[] = [];
  if (row > 0) neighbors.push(blankIdx - GRID); // up
  if (row < GRID - 1) neighbors.push(blankIdx + GRID); // down
  if (col > 0) neighbors.push(blankIdx - 1); // left
  if (col < GRID - 1) neighbors.push(blankIdx + 1); // right
  return neighbors;
}

function isSolved(tiles: number[]): boolean {
  return tiles.every((t, i) => t === i);
}

interface PuzzleProps {
  onSolved: () => void;
}

export default function SlidingPuzzle({ onSolved }: PuzzleProps) {
  const [tiles, setTiles] = useState<number[]>(() => createShuffled());
  const [moves, setMoves] = useState(0);
  const [justSolved, setJustSolved] = useState(false);
  const [hintTile, setHintTile] = useState<number | null>(null);

  // Drag state
  const dragRef = useRef<{
    tileIdx: number;      // index in tiles array being dragged
    startX: number;
    startY: number;
    el: HTMLElement | null;
  } | null>(null);

  const handleMove = useCallback(
    (tileArrayIdx: number) => {
      setTiles((prev) => {
        const blankIdx = prev.indexOf(8);
        const swappable = getSwappable(blankIdx);
        if (!swappable.includes(tileArrayIdx)) return prev;

        const next = [...prev];
        [next[blankIdx], next[tileArrayIdx]] = [next[tileArrayIdx], next[blankIdx]];

        if (isSolved(next)) {
          setTimeout(() => {
            setJustSolved(true);
            setTimeout(onSolved, 900);
          }, 200);
        }
        return next;
      });
      setMoves((m) => m + 1);
    },
    [onSolved]
  );

  // Click to move
  const handleTileClick = useCallback(
    (tileArrayIdx: number) => {
      handleMove(tileArrayIdx);
    },
    [handleMove]
  );

  // Drag: mouse
  const onMouseDown = useCallback(
    (e: React.MouseEvent, tileArrayIdx: number) => {
      e.preventDefault();
      dragRef.current = {
        tileIdx: tileArrayIdx,
        startX: e.clientX,
        startY: e.clientY,
        el: e.currentTarget as HTMLElement,
      };
    },
    []
  );

  const onMouseUp = useCallback(
    (e: React.MouseEvent) => {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      // treat as click if small movement
      if (dist < 8) {
        handleMove(dragRef.current.tileIdx);
      } else {
        // Swipe direction
        const blankIdx = tiles.indexOf(8);
        const tileIdx = dragRef.current.tileIdx;
        const tileRow = Math.floor(tileIdx / GRID);
        const tileCol = tileIdx % GRID;
        const blankRow = Math.floor(blankIdx / GRID);
        const blankCol = blankIdx % GRID;

        if (
          (tileRow === blankRow && Math.abs(tileCol - blankCol) === 1) ||
          (tileCol === blankCol && Math.abs(tileRow - blankRow) === 1)
        ) {
          handleMove(tileIdx);
        }
      }
      dragRef.current = null;
    },
    [handleMove, tiles]
  );

  // Touch support
  const onTouchStart = useCallback((e: React.TouchEvent, tileArrayIdx: number) => {
    const touch = e.touches[0];
    dragRef.current = {
      tileIdx: tileArrayIdx,
      startX: touch.clientX,
      startY: touch.clientY,
      el: e.currentTarget as HTMLElement,
    };
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!dragRef.current) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - dragRef.current.startX;
      const dy = touch.clientY - dragRef.current.startY;
      handleMove(dragRef.current.tileIdx);
      dragRef.current = null;
    },
    [handleMove]
  );



  const solved = isSolved(tiles);
  const progress = tiles.filter((t, i) => t === i && t !== 8).length / (GRID * GRID - 1);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Header */}
      <div className="text-center">
        <p className="text-black text-md">Tap or drag tiles to move them</p>
      </div>

      {/* Progress bar */}
      <div className="w-64 h-1.5 bg-white rounded-full overflow-hidden">
        <div
          className="h-full rounded-full progress-bar transition-all duration-500"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Puzzle grid */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          width: SIZE,
          height: SIZE,
          background: '#D9D9D9',
          transition: '0.5s ease',
        }}
        onMouseUp={onMouseUp}
      >
        {tiles.map((tileValue, tileArrayIdx) => {
          if (tileValue === 8) {
            // Blank tile
            return (
              <div
                key="blank"
                style={{
                  position: 'absolute',
                  width: TILE,
                  height: TILE,
                  left: (tileArrayIdx % GRID) * TILE,
                  top: Math.floor(tileArrayIdx / GRID) * TILE,
                  background: 'rgba(255,255,255,0.05)',
                  transition: 'left 0.15s ease, top 0.15s ease',
                }}
              />
            );
          }

          const srcCol = tileValue % GRID;
          const srcRow = Math.floor(tileValue / GRID);
          const destCol = tileArrayIdx % GRID;
          const destRow = Math.floor(tileArrayIdx / GRID);
          const isInPlace = tileValue === tileArrayIdx;
          const isHint = hintTile === tileArrayIdx;

          return (
            <div
              key={tileValue}
              className={'tile'}
              onClick={() => handleTileClick(tileArrayIdx)}
              onMouseDown={(e) => onMouseDown(e, tileArrayIdx)}
              onTouchStart={(e) => onTouchStart(e, tileArrayIdx)}
              onTouchEnd={onTouchEnd}
              style={{
                position: 'absolute',
                width: TILE - 4,
                height: TILE - 4,
                left: destCol * TILE + 2,
                top: destRow * TILE + 2,
                transition: 'left 0.15s ease, top 0.15s ease, box-shadow 0.2s ease',
                backgroundImage: `url(${IMAGE_URL})`,
                backgroundSize: `400px 400px`,
                backgroundPosition: `-${srcCol * TILE}px -${srcRow * TILE}px`,
                backgroundRepeat: 'no-repeat',
                borderRadius: '2px',
              }}
            />
          );
        })}

        {/* Solved overlay */}
        {justSolved && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: 'rgba(255,215,0,0.15)',
              backdropFilter: 'blur(2px)',
            }}
          >
          </div>
        )}
      </div>
    </div>
  );
}
