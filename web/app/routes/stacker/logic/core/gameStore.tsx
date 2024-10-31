/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface Tile {
  owner: 0 | 1 | 2;
  count: number;
}

interface GameState {
  board: Tile[][];
  initializeBoard: (boardSize: number) => void;
  updateTile: (x: number, y: number, owner: 0 | 1 | 2, count: number) => void;
}

export const useGameStore = create<GameState>()(
  devtools(
    immer((set) => ({
      board: [],
      initializeBoard: (boardSize: number) =>
        set((state: GameState) => {
          state.board = [...Array(boardSize)].map(() =>
            [...Array(boardSize)].map(() => ({ owner: 0, count: 0 })),
          );
        }),
      updateTile: (x, y, owner, count) =>
        set((state: GameState) => {
          state.board[x][y].owner = owner;
          state.board[x][y].count = count;
        }),
    })),
  ),
);
