import { useRef, useMemo, useState, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Scene Component
 *
 * Interactive WebGL scene with:
 * - Neural Network Sphere (nodes + connecting lines)
 * - Depth-parallax starfield
 * - Mouse-responsive interactions
 */
export default function Scene({ isMobile }) {
    const mouseRef = useRef({ x: 0, y: 0 })
    const { pointer } = useThree()

    useFrame(() => {
        mouseRef.current.x = pointer.x
        mouseRef.current.y = pointer.y
    })

    return (
        <>
            {/* Lighting */}
            <ambientLight intensity={0.15} />
            <pointLight position={[5, 5, 5]} intensity={0.8} color="#3B82F6" />
            <pointLight position={[-5, -3, -5]} intensity={0.5} color="#8B5CF6" />
            <pointLight position={[0, -5, 3]} intensity={0.3} color="#06B6D4" />

            {/* Neural Network Sphere */}
            <NeuralNetworkSphere mouse={mouseRef} isMobile={isMobile} />

            {/* Starfield Background */}
            <Starfield mouse={mouseRef} isMobile={isMobile} />
        </>
    )
}

// ── Neural Network Sphere ──────────────────────────────────────────

function NeuralNetworkSphere({ mouse, isMobile }) {
    const groupRef = useRef()
    const nodesRef = useRef()
    const linesRef = useRef()
    const glowRef = useRef()
    const burstRef = useRef()
    const [reorganizing, setReorganizing] = useState(false)

    const nodeCount = isMobile ? 35 : 55
    const sphereRadius = isMobile ? 1.6 : 2.0
    const connectionDistance = 1.3

    // Generate node positions using fibonacci sphere distribution
    const { basePositions, nodePositions, nodeColors } = useMemo(() => {
        const positions = new Float32Array(nodeCount * 3)
        const colors = new Float32Array(nodeCount * 3)
        const base = []

        const goldenRatio = (1 + Math.sqrt(5)) / 2
        for (let i = 0; i < nodeCount; i++) {
            const theta = Math.acos(1 - 2 * (i + 0.5) / nodeCount)
            const phi = 2 * Math.PI * i / goldenRatio

            const x = sphereRadius * Math.sin(theta) * Math.cos(phi)
            const y = sphereRadius * Math.sin(theta) * Math.sin(phi)
            const z = sphereRadius * Math.cos(theta)

            positions[i * 3] = x
            positions[i * 3 + 1] = y
            positions[i * 3 + 2] = z
            base.push(new THREE.Vector3(x, y, z))

            // Blue-to-purple gradient per node
            const t = i / nodeCount
            const color = new THREE.Color().setHSL(0.6 + t * 0.15, 0.9, 0.65)
            colors[i * 3] = color.r
            colors[i * 3 + 1] = color.g
            colors[i * 3 + 2] = color.b
        }

        return { basePositions: base, nodePositions: positions, nodeColors: colors }
    }, [nodeCount, sphereRadius])

    // Generate connection lines between nearby nodes
    const linePositions = useMemo(() => {
        const positions = []
        for (let i = 0; i < basePositions.length; i++) {
            for (let j = i + 1; j < basePositions.length; j++) {
                if (basePositions[i].distanceTo(basePositions[j]) < connectionDistance) {
                    positions.push(
                        basePositions[i].x, basePositions[i].y, basePositions[i].z,
                        basePositions[j].x, basePositions[j].y, basePositions[j].z
                    )
                }
            }
        }
        return new Float32Array(positions)
    }, [basePositions, connectionDistance])

    const lineCount = linePositions.length / 3

    // Burst particles
    const burstCount = 40
    const burstPositions = useMemo(() => new Float32Array(burstCount * 3), [burstCount])
    const burstVelocities = useRef(new Float32Array(burstCount * 3))
    const burstAlpha = useRef(0)

    // Click to reorganize — use invisible sphere for raycasting
    const handleClick = useCallback(() => {
        if (reorganizing) return
        setReorganizing(true)

        // Trigger burst
        burstAlpha.current = 1.0
        for (let i = 0; i < burstCount; i++) {
            burstVelocities.current[i * 3] = (Math.random() - 0.5) * 4
            burstVelocities.current[i * 3 + 1] = (Math.random() - 0.5) * 4
            burstVelocities.current[i * 3 + 2] = (Math.random() - 0.5) * 4
        }
        if (burstRef.current) {
            const pos = burstRef.current.geometry.attributes.position
            for (let i = 0; i < burstCount; i++) {
                pos.array[i * 3] = 0
                pos.array[i * 3 + 1] = 0
                pos.array[i * 3 + 2] = 0
            }
            pos.needsUpdate = true
        }

        setTimeout(() => setReorganizing(false), 1200)
    }, [reorganizing, burstCount])

    useFrame((state, delta) => {
        if (!groupRef.current) return

        const time = state.clock.elapsedTime

        // Slow auto-rotation
        groupRef.current.rotation.y += delta * 0.08

        // Mouse tilt
        const mx = mouse.current.x
        const my = mouse.current.y
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
            groupRef.current.rotation.x, my * 0.3, 0.03
        )
        groupRef.current.rotation.z = THREE.MathUtils.lerp(
            groupRef.current.rotation.z, -mx * 0.15, 0.03
        )

        // Animate node colors (pulsing brightness)
        if (nodesRef.current) {
            const colorAttr = nodesRef.current.geometry.attributes.color
            for (let i = 0; i < nodeCount; i++) {
                const brightness = 0.55 + Math.sin(time * 2.0 + i * 0.5) * 0.2
                const shake = reorganizing ? Math.sin(time * 12 + i * 2) * 0.15 : 0
                const t = i / nodeCount
                const color = new THREE.Color().setHSL(0.6 + t * 0.15, 0.9, brightness + shake)
                colorAttr.array[i * 3] = color.r
                colorAttr.array[i * 3 + 1] = color.g
                colorAttr.array[i * 3 + 2] = color.b
            }
            colorAttr.needsUpdate = true
        }

        // Animate connection lines opacity
        if (linesRef.current) {
            linesRef.current.material.opacity = 0.12 + Math.sin(time * 0.5) * 0.04
        }

        // Glow shell pulse
        if (glowRef.current) {
            glowRef.current.material.opacity = 0.025 + Math.sin(time * 0.8) * 0.01
        }

        // Animate burst particles
        if (burstRef.current && burstAlpha.current > 0) {
            burstAlpha.current = Math.max(0, burstAlpha.current - delta * 1.5)
            burstRef.current.material.opacity = burstAlpha.current

            const pos = burstRef.current.geometry.attributes.position
            for (let i = 0; i < burstCount; i++) {
                pos.array[i * 3] += burstVelocities.current[i * 3] * delta
                pos.array[i * 3 + 1] += burstVelocities.current[i * 3 + 1] * delta
                pos.array[i * 3 + 2] += burstVelocities.current[i * 3 + 2] * delta
            }
            pos.needsUpdate = true
        }
    })

    return (
        <group ref={groupRef}>
            {/* Invisible sphere for click raycasting */}
            <mesh onClick={handleClick}>
                <sphereGeometry args={[sphereRadius + 0.3, 16, 16]} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>

            {/* Nodes as points */}
            <points ref={nodesRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={nodeCount}
                        array={nodePositions}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-color"
                        count={nodeCount}
                        array={nodeColors}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={isMobile ? 0.06 : 0.08}
                    vertexColors
                    sizeAttenuation
                    transparent
                    opacity={0.95}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </points>

            {/* Connection Lines */}
            {lineCount > 0 && (
                <lineSegments ref={linesRef}>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            count={lineCount}
                            array={linePositions}
                            itemSize={3}
                        />
                    </bufferGeometry>
                    <lineBasicMaterial
                        color="#6366F1"
                        transparent
                        opacity={0.12}
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                    />
                </lineSegments>
            )}

            {/* Glow shell */}
            <mesh ref={glowRef}>
                <sphereGeometry args={[sphereRadius + 0.1, 32, 32]} />
                <meshBasicMaterial
                    color="#3B82F6"
                    transparent
                    opacity={0.03}
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>

            {/* Particle burst on click */}
            <points ref={burstRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={burstCount}
                        array={burstPositions}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.05}
                    color="#8B5CF6"
                    transparent
                    opacity={0}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </points>
        </group>
    )
}

// ── Starfield Background ─────────────────────────────────────────

function Starfield({ mouse, isMobile }) {
    const pointsRef = useRef()
    const count = isMobile ? 200 : 600

    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            const i3 = i * 3
            pos[i3] = (Math.random() - 0.5) * 30
            pos[i3 + 1] = (Math.random() - 0.5) * 30
            pos[i3 + 2] = (Math.random() - 0.5) * 20 - 5
        }
        return pos
    }, [count])

    const starColors = useMemo(() => {
        const colors = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            const t = Math.random()
            const color = new THREE.Color().setHSL(
                0.55 + t * 0.2,
                0.3 + t * 0.5,
                0.5 + t * 0.4
            )
            colors[i * 3] = color.r
            colors[i * 3 + 1] = color.g
            colors[i * 3 + 2] = color.b
        }
        return colors
    }, [count])

    useFrame((state, delta) => {
        if (!pointsRef.current) return

        const mx = mouse.current.x
        const my = mouse.current.y

        // Depth-based parallax on mouse
        pointsRef.current.rotation.y = THREE.MathUtils.lerp(
            pointsRef.current.rotation.y, mx * 0.05, 0.02
        )
        pointsRef.current.rotation.x = THREE.MathUtils.lerp(
            pointsRef.current.rotation.x, my * 0.03, 0.02
        )

        // Slow drift
        pointsRef.current.rotation.z += delta * 0.003
    })

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={count}
                    array={starColors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.035}
                vertexColors
                sizeAttenuation
                transparent
                opacity={0.7}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    )
}
