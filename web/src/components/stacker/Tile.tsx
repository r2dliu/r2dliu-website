import { memo, useMemo, useState } from 'react'
import { extend } from '@react-three/fiber'
import { BoxGeometry } from 'three'
import { Line2 } from 'three/examples/jsm/lines/Line2.js'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js'

import { useGameStore } from '../../stores/stacker/gameStore'
import type { JSX } from 'react'
import type { Vector3 } from 'three'

// Register these custom elements with R3F
extend({ Line2, LineMaterial, LineGeometry })

declare module '@react-three/fiber' {
  interface ThreeElements {
    line2: {
      key?: React.Key
      raycast?: () => null
      children?: React.ReactNode
    }
    lineMaterial: {
      attach?: string
      color?: string
      linewidth?: number
      worldUnits?: boolean
      alphaToCoverage?: boolean
      dashed?: boolean
      depthTest?: boolean
      polygonOffset?: boolean
      polygonOffsetFactor?: number
    }
    lineGeometry: {
      attach?: string
    }
  }
}

type TileProps = {
  count: number
  owner: number
  initialHeight: number
  position: Vector3
} & JSX.IntrinsicElements['mesh']

function getColorForPlayer(player: number) {
  if (player === 1) {
    return '#ff0000'
  }
  if (player === 2) {
    return '#0000ff'
  }

  return '#000000'
}

// Helper component for edge highlighting - only the 12 perimeter edges, no diagonals
const BoxEdges = ({
  color,
  lineWidth = 5,
  hideTop = false,
}: {
  color: string
  lineWidth?: number
  hideTop?: boolean
}) => {
  // Create 12 separate line segments for the box edges
  const segments = useMemo(() => {
    const w = 1.0 / 2 // half width
    const h = 0.5 / 2 // half height
    const d = 1.0 / 2 // half depth
    const offset = 0.001 // Small offset to prevent z-fighting

    const allSegments = [
      // Top face (4 edges)
      {
        start: [-w - offset, h + offset, -d - offset],
        end: [w + offset, h + offset, -d - offset],
        type: 'top',
      },
      {
        start: [w + offset, h + offset, -d - offset],
        end: [w + offset, h + offset, d + offset],
        type: 'top',
      },
      {
        start: [w + offset, h + offset, d + offset],
        end: [-w - offset, h + offset, d + offset],
        type: 'top',
      },
      {
        start: [-w - offset, h + offset, d + offset],
        end: [-w - offset, h + offset, -d - offset],
        type: 'top',
      },

      // Bottom face (4 edges)
      {
        start: [-w - offset, -h - offset, -d - offset],
        end: [w + offset, -h - offset, -d - offset],
        type: 'bottom',
      },
      {
        start: [w + offset, -h - offset, -d - offset],
        end: [w + offset, -h - offset, d + offset],
        type: 'bottom',
      },
      {
        start: [w + offset, -h - offset, d + offset],
        end: [-w - offset, -h - offset, d + offset],
        type: 'bottom',
      },
      {
        start: [-w - offset, -h - offset, d + offset],
        end: [-w - offset, -h - offset, -d - offset],
        type: 'bottom',
      },

      // Vertical edges (4 edges)
      {
        start: [-w - offset, -h - offset, -d - offset],
        end: [-w - offset, h + offset, -d - offset],
        type: 'vertical',
      },
      {
        start: [w + offset, -h - offset, -d - offset],
        end: [w + offset, h + offset, -d - offset],
        type: 'vertical',
      },
      {
        start: [w + offset, -h - offset, d + offset],
        end: [w + offset, h + offset, d + offset],
        type: 'vertical',
      },
      {
        start: [-w - offset, -h - offset, d + offset],
        end: [-w - offset, h + offset, d + offset],
        type: 'vertical',
      },
    ]

    // Filter out top edges if hideTop is true
    return hideTop
      ? allSegments.filter((seg) => seg.type !== 'top')
      : allSegments
  }, [hideTop])

  // Determine render order based on color (colored edges render on top)
  const isColoredBox = color !== '#404040' && color !== '#808080'
  const polygonOffsetFactor = isColoredBox ? -2 : -1

  return (
    <>
      {segments.map((segment, i) => {
        const lineGeometry = new LineGeometry()
        lineGeometry.setPositions([...segment.start, ...segment.end])

        return (
          <line2 key={i} raycast={() => null}>
            <primitive attach="geometry" object={lineGeometry} />
            <lineMaterial
              attach="material"
              color={color}
              linewidth={lineWidth}
              worldUnits={false}
              alphaToCoverage={true}
              dashed={false}
              depthTest={true}
              polygonOffset={true}
              polygonOffsetFactor={polygonOffsetFactor}
            />
          </line2>
        )
      })}
    </>
  )
}

const StackComponent = (
  props: {
    activePlayer: number
    owner: number
    count: number
    hovered: boolean
  } & React.ComponentProps<'mesh'>,
) => {
  const boxGeometry = useMemo(() => new BoxGeometry(1.0, 0.5, 1.0), [])

  if (props.count <= 0) {
    return null
  }

  const stack = [...Array(props.count).keys()].map((step) => (
    <mesh
      key={step}
      receiveShadow
      castShadow
      position={[0, (1 + step) * 0.5, 0]}
    >
      <meshPhysicalMaterial
        color={getColorForPlayer(props.owner)}
        emissive={
          props.hovered && props.activePlayer === props.owner
            ? getColorForPlayer(props.owner)
            : 'black'
        }
        transparent
        opacity={0.7}
        metalness={0.2}
        roughness={0.6}
        clearcoat={0.5}
        reflectivity={0.5}
      />
      <primitive attach="geometry" object={boxGeometry} />
      <BoxEdges color={getColorForPlayer(props.owner)} lineWidth={3} />
    </mesh>
  ))

  return <>{stack}</>
}

export const Stack = memo(StackComponent)

const RisersComponent = (
  props: {
    height: number
    count: number
    owner: number
    hovered: boolean
    activePlayer: number
  } & React.ComponentProps<'mesh'>,
) => {
  const boxGeometry = useMemo(() => new BoxGeometry(1.0, 0.5, 1.0), [])

  if (props.height <= 0) {
    return (
      <Stack
        activePlayer={props.activePlayer}
        count={props.count}
        owner={props.owner}
        hovered={props.hovered}
      />
    )
  }

  return (
    <>
      {[...Array(props.height).keys()].map((step) => {
        const isTopOfRiser = step === props.height - 1
        const hasStackAbove = props.count > 0

        return (
          <mesh
            key={step}
            receiveShadow
            castShadow
            position={[0, (1 + step) * 0.5, 0]}
          >
            <meshPhysicalMaterial
              reflectivity={1.0}
              color={'#E6E6E6'}
              emissive={
                props.hovered &&
                (props.activePlayer === props.owner || props.owner === 0)
                  ? getColorForPlayer(props.activePlayer)
                  : 'black'
              }
              roughness={1.0}
            />
            <primitive attach="geometry" object={boxGeometry} />
            {/* Hide top edges on risers where they overlap with colored stacks */}
            <BoxEdges
              color={'#404040'}
              lineWidth={3}
              hideTop={isTopOfRiser && hasStackAbove}
            />
          </mesh>
        )
      })}
      <group position={[0, props.height * 0.5, 0]}>
        <Stack
          activePlayer={props.activePlayer}
          count={props.count}
          owner={props.owner}
          hovered={props.hovered}
        />
      </group>
    </>
  )
}

export const Risers = memo(RisersComponent)

const TileComponent = ({ ...props }: TileProps) => {
  const [hovered, setHovered] = useState(false)

  const boxGeometry = useMemo(() => new BoxGeometry(1.0, 0.5, 1.0), [])

  // Calculate ghost box position (on top of existing stack)
  // The stack group is at height * 0.5, and each box in the stack is at (1 + step) * 0.5
  // So the top of the stack is at: height * 0.5 + (1 + count - 1) * 0.5 = height * 0.5 + count * 0.5
  // The next box should be at: height * 0.5 + (1 + count) * 0.5
  const ghostBoxHeight = props.initialHeight * 0.5 + (1 + props.count) * 0.5

  return (
    <mesh
      onPointerEnter={(e) => {
        e.stopPropagation()
        setHovered(true)
      }}
      onClick={async (e) => {
        e.stopPropagation()
        const store = useGameStore.getState()

        if (!store.allowMove()) {
          return // can't stack if game isn't running or cascading
        }

        const activePlayer = store.activePlayer
        if (props.owner !== 0 && activePlayer !== props.owner) {
          return // can't stack if opponent already owns spot
        }

        // Hide ghost preview immediately on click
        setHovered(false)

        await store.updateTile(
          props.position.z,
          props.position.x,
          activePlayer,
          props.count + 1,
        )
        await store.cascade()
        if (activePlayer === 1) {
          await store.updatePlayer(2)
        } else if (activePlayer === 2) {
          await store.updatePlayer(1)
        } else {
          console.log("invalid player, this shouldn't have happened...")
          // todo handle error
        }
        store.checkWinner()
      }}
      onPointerLeave={() => setHovered(false)}
      receiveShadow
      castShadow
      {...props}
    >
      <meshPhysicalMaterial
        color={'#E6E6E6'}
        emissive={
          hovered && (useGameStore.getState().activePlayer === props.owner || props.owner === 0)
            ? getColorForPlayer(useGameStore.getState().activePlayer)
            : 'black'
        }
        roughness={1.0}
      />
      <primitive attach="geometry" object={boxGeometry} />
      <BoxEdges color={'#404040'} lineWidth={3} />
      <Risers
        activePlayer={useGameStore.getState().activePlayer}
        height={props.initialHeight}
        hovered={hovered}
        owner={props.owner}
        count={props.count}
      />
      {/* Ghost box preview - only show on empty tiles or tiles owned by active player */}
      {hovered && (props.owner === 0 || props.owner === useGameStore.getState().activePlayer) && (
        <mesh position={[0, ghostBoxHeight, 0]} raycast={() => null}>
          <meshPhysicalMaterial
            color={getColorForPlayer(useGameStore.getState().activePlayer)}
            transparent
            opacity={0.3}
            metalness={0.5}
            roughness={0.5}
            emissive={getColorForPlayer(useGameStore.getState().activePlayer)}
            emissiveIntensity={0.2}
          />
          <primitive attach="geometry" object={boxGeometry} />
          <BoxEdges color={getColorForPlayer(useGameStore.getState().activePlayer)} lineWidth={2} />
        </mesh>
      )}
    </mesh>
  )
}

// Memoize to prevent re-renders when props haven't changed
export const Tile = memo(TileComponent, (prevProps, nextProps) => {
  return (
    prevProps.count === nextProps.count &&
    prevProps.owner === nextProps.owner &&
    prevProps.initialHeight === nextProps.initialHeight &&
    prevProps.position.equals(nextProps.position)
  )
})
