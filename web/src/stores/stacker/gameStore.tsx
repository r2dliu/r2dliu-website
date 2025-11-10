import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface Tile {
  owner: number
  count: number
  initialHeight: number
}

interface GameState {
  boardSize: number
  updatePlayer: (player: number) => void
  inProgress: boolean
  notCascading: boolean
  activePlayer: number
  winner: number | null
  moveCount: number
  board: Array<Array<Tile>>
  allowMove: () => boolean
  cascade: () => Promise<void>
  initializeBoard: () => void
  updateTile: (x: number, y: number, owner: number, count: number) => void
  checkWinner: () => void
  resetGame: () => void
}

function calculateInitialHeight(boardSize: number, i: number, j: number) {
  if ((i === 0 || i === boardSize - 1) && (j === 0 || j === boardSize - 1)) {
    // corners have height 2
    return 2
  } else if (i === 0 || i === boardSize - 1 || j === 0 || j === boardSize - 1) {
    // sides have height 1
    return 1
  } else {
    return 0
  }
}

export const useGameStore = create<GameState>()(
  devtools(
    immer((set, get) => ({
      boardSize: 6,
      inProgress: true as boolean,
      notCascading: true as boolean,
      activePlayer: 1,
      winner: null as number | null,
      moveCount: 0,
      board: [] as Array<Array<Tile>>,
      allowMove: () => {
        return get().inProgress && get().notCascading && !get().winner
      },
      initializeBoard: () =>
        set((state: GameState) => {
          state.board = [...Array(get().boardSize).keys()].map((i) =>
            [...Array(get().boardSize).keys()].map((j) => ({
              owner: 0,
              count: 0,
              initialHeight: calculateInitialHeight(get().boardSize, i, j),
            })),
          )
        }),
      cascade: async () => {
        let changed = false
        set((state: GameState) => {
          state.notCascading = false
          const updatedBoard = structuredClone(get().board)
          state.board.forEach((column, i) => {
            column.forEach((tile, j) => {
              if (tile.count + tile.initialHeight >= 4) {
                changed = true
                // collapse the tiles outwards in cardinal directions
                const totalHeight = tile.count + tile.initialHeight
                updatedBoard[i][j].count = totalHeight - 4
                if (j > 0) {
                  // left
                  updatedBoard[i][j - 1].count += 1
                  updatedBoard[i][j - 1].owner = state.board[i][j].owner
                }
                if (j < get().boardSize - 1) {
                  // right
                  updatedBoard[i][j + 1].count += 1
                  updatedBoard[i][j + 1].owner = state.board[i][j].owner
                }
                if (i > 0) {
                  // down
                  updatedBoard[i - 1][j].count += 1
                  updatedBoard[i - 1][j].owner = state.board[i][j].owner
                }
                if (i < get().boardSize - 1) {
                  // up
                  updatedBoard[i + 1][j].count += 1
                  updatedBoard[i + 1][j].owner = state.board[i][j].owner
                }
                // reset owner if no tiles remaining on that square
                if (updatedBoard[i][j].count === 0) {
                  updatedBoard[i][j].owner = 0
                }
              }
            })
          })
          state.board = updatedBoard
        })

        // Check for winner after each cascade iteration (but keep cascading)
        get().checkWinner()

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!changed) {
          await set((state: GameState) => {
            state.notCascading = true
          })
        } else {
          await new Promise((r) => setTimeout(r, 500))
          await get().cascade()
        }
      },
      updateTile: (x, y, owner, count) => {
        set((state: GameState) => {
          state.board[x][y].owner = owner
          state.board[x][y].count = count
        })
      },
      updatePlayer: (player: number) =>
        set((state: GameState) => {
          state.activePlayer = player
          state.moveCount += 1
        }),
      checkWinner: () => {
        // Only check for winner after both players have made at least one move
        if (get().moveCount < 2) {
          return
        }

        const board = get().board
        let player1Tiles = 0
        let player2Tiles = 0

        // Count tiles for each player
        board.forEach((column) => {
          column.forEach((tile) => {
            if (tile.owner === 1 && tile.count > 0) {
              player1Tiles += tile.count
            } else if (tile.owner === 2 && tile.count > 0) {
              player2Tiles += tile.count
            }
          })
        })

        // Check if either player has 0 tiles
        if (player1Tiles === 0 && player2Tiles > 0) {
          set((state: GameState) => {
            state.winner = 2
            state.inProgress = false
          })
        } else if (player2Tiles === 0 && player1Tiles > 0) {
          set((state: GameState) => {
            state.winner = 1
            state.inProgress = false
          })
        }
      },
      resetGame: () =>
        set((state: GameState) => {
          state.winner = null
          state.moveCount = 0
          state.activePlayer = 1
          state.inProgress = true
          state.notCascading = true
          state.board = [...Array(get().boardSize).keys()].map((i) =>
            [...Array(get().boardSize).keys()].map((j) => ({
              owner: 0,
              count: 0,
              initialHeight: calculateInitialHeight(get().boardSize, i, j),
            })),
          )
        }),
    })),
  ),
)
