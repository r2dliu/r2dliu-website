import { useState, type FC } from "react";

export const Tile: FC<JSX.IntrinsicElements[`mesh`]> = ({ ...props }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <mesh
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      scale={[1, 0.5, 1]}
      receiveShadow
      castShadow
      {...props}
    >
      <meshPhysicalMaterial
        reflectivity={1}
        color={"#ffffff"}
        emissive={hovered ? "red" : "black"}
        // emissiveIntensity={hovered ? 1 : 0}
        metalness={0.8}
        roughness={0.7}
        clearcoat={1.0}
        // envMapIntensity={0.15}
      />
      <boxGeometry />
    </mesh>
  );
};
