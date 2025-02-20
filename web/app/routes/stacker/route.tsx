import { Stats, CameraControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import MouseButtons from "camera-controls";
import cn from "classnames";
import { useEffect, useRef, useState } from "react";
import { Vector3 } from "three";

import { useGameStore } from "./logic/core/gameStore";
import { Tile } from "./renderables/tile/tile";
import styles from "./stacker.module.css";

export default function Stacker() {
  const cameraControlsRef = useRef<CameraControls>(null);
  const initializeBoard = useGameStore((state) => state.initializeBoard);
  const board = useGameStore((state) => state.board);

  useEffect(() => initializeBoard(), [initializeBoard]); // TODO add boardsize to initializeBoard
  const [visible, setVisible] = useState(false);

  const centerPoint = board.length / 2.0 - 0.5;
  const distance = board.length * 2; // Adjust this value to zoom in/out

  return (
    <div className={styles.Stacker}>
      <Canvas
        className={cn(styles.canvas, { [styles.visible]: visible })}
        camera={{
          position: [
            centerPoint + distance, // X
            distance, // Y
            centerPoint + distance, // Z
          ],
          near: 0.1,
          far: 1000,
        }}
      >
        {/* Camera helper to visualize camera position */}
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
          onStart={() => {
            cameraControlsRef.current?.setTarget(centerPoint, 0, centerPoint);
            setVisible(true);
          }}
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
  );
}
