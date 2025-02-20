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
  boardSize: number;
  updatePlayer: (player: number) => void;
  inProgress: boolean;
  notCascading: boolean;
  activePlayer: number;
  board: Tile[][];
  allowMove: () => boolean;
  cascade: () => Promise<void>;
  initializeBoard: () => void;
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
    immer((set, get) => ({
      boardSize: 6,
      inProgress: true as boolean,
      notCascading: true as boolean,
      activePlayer: 1,
      board: [] as Tile[][],
      allowMove: () => {
        return get().inProgress && get().notCascading;
      },
      initializeBoard: () =>
        set((state: GameState) => {
          state.board = [...Array(get().boardSize).keys()].map((i) =>
            [...Array(get().boardSize).keys()].map((j) => ({
              owner: 0,
              count: 0,
              initialHeight: calculateInitialHeight(get().boardSize, i, j),
            })),
          );
        }),
      cascade: async () => {
        let changed = false;
        await set((state: GameState) => {
          state.notCascading = false;
          const updatedBoard = structuredClone(get().board);
          state.board.forEach((column, i) => {
            column.forEach((tile, j) => {
              if (tile.count + tile.initialHeight >= 4) {
                changed = true;
                // collapse the tiles outwards in cardinal directions
                updatedBoard[i][j].count = Math.max(
                  tile.count + tile.initialHeight - 4,
                  0,
                );
                if (j > 0) {
                  // left
                  updatedBoard[i][j - 1].count =
                    state.board[i][j - 1].count + 1;
                  updatedBoard[i][j - 1].owner = state.board[i][j].owner;
                }
                if (j < get().boardSize - 1) {
                  // right
                  updatedBoard[i][j + 1].count =
                    state.board[i][j + 1].count + 1;
                  updatedBoard[i][j + 1].owner = state.board[i][j].owner;
                }
                if (i > 0) {
                  // down
                  updatedBoard[i - 1][j].count =
                    state.board[i - 1][j].count + 1;
                  updatedBoard[i - 1][j].owner = state.board[i][j].owner;
                }
                if (i < get().boardSize - 1) {
                  // up
                  updatedBoard[i + 1][j].count =
                    state.board[i + 1][j].count + 1;
                  updatedBoard[i + 1][j].owner = state.board[i][j].owner;
                }
                // reset owner if no tiles remaining on that square
                if (state.board[i][j].count === 0) {
                  updatedBoard[i][j].owner = 0;
                }
              }
            });
          });
          state.board = updatedBoard;
        });

        if (!changed) {
          await set((state: GameState) => {
            state.notCascading = true;
          });
        } else {
          await new Promise((r) => setTimeout(r, 1000));
          await get().cascade();
        }
      },
      updateTile: (x, y, owner, count) => {
        set((state: GameState) => {
          state.board[x][y].owner = owner;
          state.board[x][y].count = count;
        });
      },
      updatePlayer: (player: number) =>
        set((state: GameState) => {
          state.activePlayer = player;
        }),
    })),
  ),
);
