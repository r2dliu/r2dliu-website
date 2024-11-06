/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface Tile {
  owner: number;
  count: number;
  initialHeight: number;
}

interface GameState {
  updatePlayer: (player: number) => void;
  inProgress: boolean;
  activePlayer: number;
  board: Tile[][];
  initializeBoard: (boardSize: number) => void;
  updateTile: (x: number, y: number, owner: number, count: number) => void;
}

function calculateInitialHeight(boardSize: number, i: number, j: number) {
  if ((i === 0 || i === boardSize - 1) && (j === 0 || j === boardSize - 1)) {
    // corners have height 2
    return 2;
  } else if (i === 0 || i === boardSize - 1 || j === 0 || j === boardSize - 1) {
    // sides have height 1
    return 1;
  } else {
    return 0;
  }
}
export const useGameStore = create<GameState>()(
  devtools(
    immer((set) => ({
      inProgress: true,
      activePlayer: 1,
      board: [],
      initializeBoard: (boardSize: number) =>
        set((state: GameState) => {
          state.board = [...Array(boardSize).keys()].map((i) =>
            [...Array(boardSize).keys()].map((j) => ({
              owner: 0,
              count: 0,
              initialHeight: calculateInitialHeight(boardSize, i, j),
            })),
          );
        }),
      updateTile: (x, y, owner, count) =>
        set((state: GameState) => {
          state.board[x][y].owner = owner;
          state.board[x][y].count = count;
        }),
      updatePlayer: (player: number) =>
        set((state: GameState) => {
          state.activePlayer = player;
        }),
    })),
  ),
);
