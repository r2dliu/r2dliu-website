import { extend, Object3DNode } from "@react-three/fiber";
import { useMemo, useState } from "react";
import { Vector3, BoxGeometry, EdgesGeometry } from "three";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";

import { useGameStore } from "../../logic/core/gameStore";

// Register these custom elements with R3F
extend({ Line2, LineMaterial, LineGeometry });

declare module "@react-three/fiber" {
  interface ThreeElements {
    line2: Object3DNode<Line2, typeof Line2>;
    lineMaterial: Object3DNode<LineMaterial, typeof LineMaterial>;
    lineGeometry: Object3DNode<LineGeometry, typeof LineGeometry>;
  }
}

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

// Helper component for edge highlighting
// Updated BoxEdges component using Line2
const BoxEdges = ({
  geometry,
  color,
  lineWidth = 5,
}: {
  geometry: BoxGeometry;
  color: string;
  lineWidth?: number;
}) => {
  const edgesGeometry = useMemo(() => new EdgesGeometry(geometry), [geometry]);

  // Convert EdgesGeometry to position array for LineGeometry
  const positions = useMemo(() => {
    const posArray = [];
    const posAttr = edgesGeometry.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      posArray.push(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
    }
    return posArray;
  }, [edgesGeometry]);

  const lineGeometry = useMemo(() => {
    const geometry = new LineGeometry();
    geometry.setPositions(positions);
    return geometry;
  }, [positions]);

  return (
    <line2 raycast={() => null}>
      <primitive attach="geometry" object={lineGeometry} />
      <lineMaterial
        attach="material"
        color={color}
        linewidth={lineWidth}
        worldUnits={false}
        alphaToCoverage={true}
        dashed={false}
      />
    </line2>
  );
};

export const Stack = (
  props: {
    activePlayer: number;
    owner: number;
    count: number;
    hovered: boolean;
  } & React.ComponentProps<"mesh">,
) => {
  if (props.count <= 0) {
    return null;
  }

  const stack = [...Array(props.count).keys()].map((step) => (
    <mesh
      key={step}
      receiveShadow
      castShadow
      position={[0, (1 + step) * 0.5, 0]}
    >
      <meshPhysicalMaterial
        reflectivity={1}
        color={getColorForPlayer(props.owner)}
        emissive={
          props.hovered && props.activePlayer === props.owner
            ? getColorForPlayer(props.owner)
            : "black"
        }
        transparent
        opacity={0.8}
        metalness={0.8}
        roughness={0.7}
        clearcoat={1.0}
      />
      <boxGeometry args={[1.0, 0.5, 1.0]} />
    </mesh>
  ));

  return <>{stack}</>;
};

export const Risers = (
  props: {
    height: number;
    count: number;
    owner: number;
    hovered: boolean;
    activePlayer: number;
  } & React.ComponentProps<"mesh">,
) => {
  const boxGeometry = useMemo(() => new BoxGeometry(1.0, 0.5, 1.0), []);

  if (props.height <= 0) {
    return (
      <Stack
        activePlayer={props.activePlayer}
        count={props.count}
        owner={props.owner}
        hovered={props.hovered}
      />
    );
  }

  return (
    <>
      {[...Array(props.height).keys()].map((step) => (
        <mesh
          key={step}
          receiveShadow
          castShadow
          position={[0, (1 + step) * 0.5, 0]}
        >
          <meshPhysicalMaterial
            reflectivity={1.0}
            color={"#ffffff"}
            emissive={
              props.hovered &&
              (props.activePlayer === props.owner || props.owner === 0)
                ? getColorForPlayer(props.activePlayer)
                : "black"
            }
            roughness={1.0}
          />
          <primitive attach="geometry" object={boxGeometry} />
          <BoxEdges geometry={boxGeometry} color={"#ffffff"} />
        </mesh>
      ))}
      <group position={[0, props.height * 0.5, 0]}>
        <Stack
          activePlayer={props.activePlayer}
          count={props.count}
          owner={props.owner}
          hovered={props.hovered}
        />
      </group>
    </>
  );
};

export const Tile = ({ ...props }: TileProps) => {
  const [hovered, setHovered] = useState(false);
  const updateTile = useGameStore((state) => state.updateTile);
  const cascade = useGameStore((state) => state.cascade);
  const updatePlayer = useGameStore((state) => state.updatePlayer);
  const activePlayer = useGameStore((state) => state.activePlayer);
  const inProgress = useGameStore((state) => state.inProgress);

  const boxGeometry = useMemo(() => new BoxGeometry(1.0, 0.5, 1.0), []);

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

        await updateTile(
          props.position.z,
          props.position.x,
          activePlayer,
          props.count + 1,
        );
        await cascade();
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
        color={"#ffffff"}
        emissive={
          hovered && (activePlayer === props.owner || props.owner === 0)
            ? getColorForPlayer(activePlayer)
            : "black"
        }
        roughness={1.0}
      />
      <primitive attach="geometry" object={boxGeometry} />
      <BoxEdges geometry={boxGeometry} color={"#ffffff"} />
      <Risers
        activePlayer={activePlayer}
        height={props.initialHeight}
        hovered={hovered}
        owner={props.owner}
        count={props.count}
      />
    </mesh>
  );
};
