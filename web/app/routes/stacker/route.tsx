import { Stats, CameraControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import cn from "classnames";
import { useEffect, useRef, useState } from "react";

import { useGameStore } from "./logic/core/gameStore";
import { Tile } from "./renderables/tile/tile";
import styles from "./stacker.module.css";

export default function Stacker() {
  const cameraControlsRef = useRef<CameraControls>(null);
  const initializeBoard = useGameStore((state) => state.initializeBoard);
  const board = useGameStore((state) => state.board);

  useEffect(() => initializeBoard(6), [initializeBoard]);
  const [visible, setVisible] = useState(false);

  const centerPoint = board.length / 2.0 - 0.5;
  const distance = board.length * 2; // Adjust this value to zoom in/out

  return (
    <div className={styles.Stacker}>
      testing
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
          minDistance={2}
          maxDistance={20}
          ref={cameraControlsRef}
          onStart={() => {
            cameraControlsRef.current?.setTarget(centerPoint, 0, centerPoint);
            setVisible(true);
            console.log("wow");
          }}
        />
        <ambientLight />
        <color attach="background" args={[255, 255, 255]} />
        {board.map((col, i) =>
          col.map((tile, j) => (
            <Tile
              key={`(${i.toString()},${j.toString()})`}
              position={[j, 0, i]}
            />
          )),
        )}
        <Stats />
      </Canvas>
    </div>
  );
}
