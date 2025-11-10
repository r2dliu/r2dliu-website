import { Stats, CameraControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import MouseButtons from 'camera-controls'
import { useEffect, useRef, useState } from 'react'
import { Vector3 } from 'three'

import { useGameStore } from '../../stores/stacker/gameStore'
import { Tile } from './Tile'

export function StackerGame() {
  const cameraControlsRef = useRef<CameraControls>(null)
  const initializeBoard = useGameStore((state) => state.initializeBoard)
  const board = useGameStore((state) => state.board)

  useEffect(() => {
    initializeBoard()
  }, [initializeBoard])

  const centerPoint = board.length / 2.0 - 0.5
  const distance = board.length * 2

  useEffect(() => {
    if (cameraControlsRef.current) {
      cameraControlsRef.current.setTarget(centerPoint, 0, centerPoint)
    }
  }, [centerPoint])

  return (
    <div className="h-full">
      <Canvas
        className="h-full w-full"
        camera={{
          position: [
            centerPoint + distance,
            distance,
            centerPoint + distance,
          ],
          near: 0.1,
          far: 1000,
        }}
      >
        <CameraControls
          mouseButtons={{
            left: MouseButtons.ACTION.NONE,
            wheel: MouseButtons.ACTION.ZOOM,
            right: MouseButtons.ACTION.NONE,
            middle: MouseButtons.ACTION.ROTATE,
          }}
          minDistance={2}
          maxDistance={20}
          ref={cameraControlsRef}
        />
        <ambientLight />
        <color attach="background" args={[255, 255, 255]} />
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
