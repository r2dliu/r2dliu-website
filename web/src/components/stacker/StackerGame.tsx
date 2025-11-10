import { CameraControls, Stats } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import MouseButtons from 'camera-controls'
import { useCallback, useEffect } from 'react'
import { Vector3 } from 'three'

import { useGameStore } from '../../stores/stacker/gameStore'
import { Tile } from './Tile'

export function StackerGame() {
  const initializeBoard = useGameStore((state) => state.initializeBoard)
  const board = useGameStore((state) => state.board)
  const boardSize = useGameStore((state) => state.boardSize)
  const winner = useGameStore((state) => state.winner)
  const resetGame = useGameStore((state) => state.resetGame)
  const notCascading = useGameStore((state) => state.notCascading)

  useEffect(() => {
    initializeBoard()
  }, [initializeBoard])

  // Center point should be at the middle of the board
  // For a board of size N, tiles go from 0 to N-1, so center is (N-1)/2
  const centerPoint = (boardSize - 1) / 2.0
  const distance = boardSize * 2

  const cameraControlsRef = useCallback(
    (controls: CameraControls | null) => {
      if (controls && board.length > 0) {
        controls.setLookAt(
          centerPoint + distance,
          distance,
          centerPoint + distance,
          centerPoint,
          0,
          centerPoint,
          true,
        )
      }
    },
    [board.length, centerPoint, distance],
  )

  const getPlayerName = (player: number) => {
    return player === 1 ? 'Red' : 'Blue'
  }

  const getPlayerColor = (player: number) => {
    return player === 1 ? '#ff0000' : '#0000ff'
  }

  return (
    <div className="relative h-full">
      {winner && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30">
          <div className="bg-black p-8 text-center">
            <h2 className="mb-6 font-['HelveticaNeueBold'] text-3xl">
              <span style={{ color: getPlayerColor(winner) }}>
                {getPlayerName(winner)}
              </span>{' '}
              Wins!
            </h2>
            <button
              onClick={resetGame}
              className="border-2 border-white bg-black px-6 py-2 font-['HelveticaNeueMedium'] text-white transition-colors hover:bg-white hover:text-black"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
      <Canvas
        className="h-full w-full"
        camera={{
          position: [centerPoint + distance, distance, centerPoint + distance],
          near: 0.1,
          far: 1000,
        }}
        shadows={notCascading}
      >
        <CameraControls
          mouseButtons={{
            left: MouseButtons.ACTION.ROTATE,
            wheel: MouseButtons.ACTION.ZOOM,
            right: MouseButtons.ACTION.TRUCK,
            middle: MouseButtons.ACTION.ROTATE,
          }}
          minDistance={2}
          maxDistance={20}
          ref={cameraControlsRef}
        />
        <ambientLight />
        <color attach="background" args={['#1a1a1a']} />
        {board.map((col, i) =>
          col.map((tile, j) => (
            <Tile
              key={`(${i.toString()},${j.toString()})`}
              position={new Vector3(j, 0, i)}
              initialHeight={tile.initialHeight}
              owner={tile.owner}
              count={tile.count}
            />
          )),
        )}
        <Stats />
      </Canvas>
    </div>
  )
}
