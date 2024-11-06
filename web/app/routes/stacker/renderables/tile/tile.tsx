import { useState } from "react";
import { Vector3 } from "three";

import { useGameStore } from "../../logic/core/gameStore";

type TileProps = {
  count: number;
  owner: number;
  initialHeight: number;
  position: Vector3;
} & JSX.IntrinsicElements["mesh"];

function getColorForPlayer(player: number) {
  if (player === 1) {
    return "#ff0000";
  }
  if (player === 2) {
    return "#0000ff";
  }

  return "#000000";
}

export const Stack = (
  props: {
    owner: number;
    count: number;
    hovered: boolean;
  } & JSX.IntrinsicElements["mesh"],
) => {
  const activePlayer = useGameStore((state) => state.activePlayer);
  console.log(props);
  if (props.count <= 0) {
    return null;
  }

  const stack = [...Array(props.count).keys()].map((step) => (
    <mesh
      key={step}
      receiveShadow
      castShadow
      {...props}
      position={new Vector3(0, (1 + step) * 0.5, 0)}
    >
      <meshPhysicalMaterial
        reflectivity={1}
        color={getColorForPlayer(props.owner)}
        emissive={
          props.hovered && activePlayer === props.owner
            ? getColorForPlayer(activePlayer)
            : "black"
        }
        // emissiveIntensity={hovered ? 1 : 0}
        metalness={0.8}
        roughness={0.7}
        clearcoat={1.0}
        // envMapIntensity={0.15}
      />
      <boxGeometry args={[0.8, 0.5, 0.8]} />
    </mesh>
  ));

  return stack;
};

export const Risers = (
  props: {
    height: number;
    count: number;
    owner: number;
    hovered: boolean;
  } & JSX.IntrinsicElements["mesh"],
) => {
  const activePlayer = useGameStore((state) => state.activePlayer);

  const stack = (
    <Stack count={props.count} owner={props.owner} hovered={props.hovered} />
  );

  if (props.height <= 0) {
    return stack;
  }

  const risers = [...Array(props.height).keys()].map((step) => (
    <mesh
      key={step}
      receiveShadow
      castShadow
      {...props}
      position={new Vector3(0, (1 + step) * 0.5, 0)}
    >
      <meshPhysicalMaterial
        reflectivity={1}
        color={"#ffffff"}
        emissive={
          props.hovered && (activePlayer === props.owner || props.owner === 0)
            ? getColorForPlayer(activePlayer)
            : "black"
        }
        // emissiveIntensity={hovered ? 1 : 0}
        transparent
        opacity={0.5}
        metalness={0.8}
        roughness={0.7}
        clearcoat={1.0}
        // envMapIntensity={0.15}
      />
      <boxGeometry args={[1.0, 0.5, 1.0]} />
      {stack}
    </mesh>
  ));

  return risers;
};

export const Tile = ({ ...props }: TileProps) => {
  const [hovered, setHovered] = useState(false);
  const updateTile = useGameStore((state) => state.updateTile);
  const updatePlayer = useGameStore((state) => state.updatePlayer);
  const activePlayer = useGameStore((state) => state.activePlayer);
  const inProgress = useGameStore((state) => state.inProgress);

  return (
    <mesh
      onPointerEnter={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onClick={async (e) => {
        e.stopPropagation();
        if (!inProgress) {
          return; // can't stack if game isn't running
        }

        if (props.owner !== 0 && activePlayer !== props.owner) {
          return; // can't stack if opponent already owns spot
        }

        console.log(props);
        await updateTile(
          props.position.z,
          props.position.x,
          activePlayer,
          props.count + 1,
        );
        if (activePlayer === 1) {
          await updatePlayer(2);
        } else if (activePlayer === 2) {
          await updatePlayer(1);
        } else {
          console.log("invalid player, this shouldn't have happened...");
          // todo handle error
        }
      }}
      onPointerLeave={() => setHovered(false)}
      receiveShadow
      castShadow
      {...props}
    >
      <meshPhysicalMaterial
        reflectivity={1}
        color={"#ffffff"}
        emissive={
          hovered && (activePlayer === props.owner || props.owner === 0)
            ? getColorForPlayer(activePlayer)
            : "black"
        }
        transparent
        opacity={0.5}
        // emissiveIntensity={hovered ? 1 : 0}
        metalness={0.8}
        roughness={0.7}
        clearcoat={1.0}
        // envMapIntensity={0.15}
      />
      <boxGeometry args={[1.0, 0.5, 1.0]} />
      <Risers
        height={props.initialHeight}
        hovered={hovered}
        owner={props.owner}
        count={props.count}
      />
    </mesh>
  );
};
