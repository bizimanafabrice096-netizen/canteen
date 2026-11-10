import React from 'react';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  label?: string;
}

/**
 * Deterministic vector QR pattern generator based on hash of the value.
 * Produces crisp, standard QR-matrix styled visual markers.
 */
export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ value, size = 180, label }) => {
  // Generate deterministic 21x21 grid
  const matrixSize = 21;
  const grid: boolean[][] = Array.from({ length: matrixSize }, () => Array(matrixSize).fill(false));

  // Helper to draw QR corner finder patterns (7x7)
  const drawFinder = (startX: number, startY: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 || // outer square
          (r >= 2 && r <= 4 && c >= 2 && c <= 4) // inner solid 3x3
        ) {
          grid[startY + r][startX + c] = true;
        } else {
          grid[startY + r][startX + c] = false;
        }
      }
    }
  };

  // Top-left, Top-right, Bottom-left finder patterns
  drawFinder(0, 0);
  drawFinder(matrixSize - 7, 0);
  drawFinder(0, matrixSize - 7);

  // Timing lines
  for (let i = 8; i < matrixSize - 8; i++) {
    grid[6][i] = i % 2 === 0;
    grid[i][6] = i % 2 === 0;
  }

  // Hash the value into pseudo-random deterministic bits for data area
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) - hash) + value.charCodeAt(i);
    hash |= 0;
  }

  // Fill data cells
  let seed = Math.abs(hash) + 12345;
  const pseudoRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      // Skip finder zones
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= matrixSize - 8;
      const inBottomLeft = r >= matrixSize - 8 && c < 8;
      if (inTopLeft || inTopRight || inBottomLeft) continue;
      if (r === 6 || c === 6) continue;

      grid[r][c] = pseudoRandom() > 0.48;
    }
  }

  const cellSize = size / matrixSize;

  return (
    <div className="flex flex-col items-center">
      <div 
        className="p-3 bg-white rounded-xl shadow-md border border-stone-200 inline-block"
        style={{ width: size + 24, height: size + 24 }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="shape-rendering-crispEdges block"
        >
          {grid.map((row, r) =>
            row.map((filled, c) =>
              filled ? (
                <rect
                  key={`${r}-${c}`}
                  x={c * cellSize}
                  y={r * cellSize}
                  width={cellSize}
                  height={cellSize}
                  fill="#0c0a09"
                />
              ) : null
            )
          )}
        </svg>
      </div>
      {label && (
        <span className="mt-2 text-xs font-mono-numbers text-stone-400 text-center select-all">
          {label}
        </span>
      )}
    </div>
  );
};
