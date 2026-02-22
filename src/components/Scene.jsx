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
            <pointLight position={[5, 5, 5]} intensity={0.6} color="#3B82F6" />
            <pointLight position={[-5, -3, -5]} intensity={0.4} color="#8B5CF6" />
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
    const burstRef = useRef()
    const [reorganizing, setReorganizing] = useState(false)

    const nodeCount = isMobile ? 40 : 60
    const sphereRadius = isMobile ? 1.8 : 2.2
    const connectionDistance = 1.2

    // Generate node positions on sphere surface using fibonacci spiral
    const { basePositions, nodePositions, nodeColors, nodeSizes } = useMemo(() => {
        const positions = new Float32Array(nodeCount * 3)
        const colors = new Float32Array(nodeCount * 3)
        const sizes = new Float32Array(nodeCount)
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

            // Neon blue/purple color range
            const t = i / nodeCount
            const color = new THREE.Color().setHSL(0.6 + t * 0.15, 0.9, 0.6)
            colors[i * 3] = color.r
            colors[i * 3 + 1] = color.g
            colors[i * 3 + 2] = color.b

            sizes[i] = 0.04 + Math.random() * 0.04
        }

        return { basePositions: base, nodePositions: positions, nodeColors: colors, nodeSizes: sizes }
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

    // Burst particles
    const burstCount = 50
    const burstPositions = useMemo(() => new Float32Array(burstCount * 3), [burstCount])
    const burstVelocities = useRef(new Float32Array(burstCount * 3))
    const burstAlpha = useRef(0)

    // Click handler — reorganize nodes
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
        groupRef.current.rotation.x += delta * 0.04

        // Mouse tilt
        const mx = mouse.current.x
        const my = mouse.current.y
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
            groupRef.current.rotation.x, my * 0.3, 0.03
        )
        groupRef.current.rotation.z = THREE.MathUtils.lerp(
            groupRef.current.rotation.z, -mx * 0.15, 0.03
        )

        // Animate node glow (pulsing sizes)
        if (nodesRef.current) {
            const sizeAttr = nodesRef.current.geometry.attributes.size
            const colorAttr = nodesRef.current.geometry.attributes.color
            for (let i = 0; i < nodeCount; i++) {
                const pulse = Math.sin(time * 2 + i * 0.5) * 0.01
                sizeAttr.array[i] = nodeSizes[i] + pulse + (reorganizing ? Math.sin(time * 10 + i) * 0.03 : 0)

                // Cursor proximity glow boost
                const brightness = 0.6 + Math.sin(time * 1.5 + i * 0.3) * 0.15
                const t = i / nodeCount
                const color = new THREE.Color().setHSL(0.6 + t * 0.15, 0.9, brightness)
                colorAttr.array[i * 3] = color.r
                colorAttr.array[i * 3 + 1] = color.g
                colorAttr.array[i * 3 + 2] = color.b
            }
            sizeAttr.needsUpdate = true
            colorAttr.needsUpdate = true
        }

        // Animate connection lines opacity
        if (linesRef.current) {
            linesRef.current.material.opacity = 0.15 + Math.sin(time * 0.5) * 0.05
        }

        // Animate burst particles
        if (burstRef.current && burstAlpha.current > 0) {
            burstAlpha.current -= delta * 1.5
            if (burstAlpha.current < 0) burstAlpha.current = 0
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
        <group ref={groupRef} onClick={handleClick}>
            {/* Nodes */}
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
                    <bufferAttribute
                        attach="attributes-size"
                        count={nodeCount}
                        array={nodeSizes}
                        itemSize={1}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.08}
                    vertexColors
                    sizeAttenuation
                    transparent
                    opacity={0.95}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </points>

            {/* Connection Lines */}
            <lineSegments ref={linesRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={linePositions.length / 3}
                        array={linePositions}
                        itemSize={3}
                    />
                </bufferGeometry>
                <lineBasicMaterial
                    color="#6366F1"
                    transparent
                    opacity={0.15}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </lineSegments>

            {/* Glow shell */}
            <mesh>
                <sphereGeometry args={[sphereRadius + 0.05, 32, 32]} />
                <meshBasicMaterial
                    color="#3B82F6"
                    transparent
                    opacity={0.03}
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Particle burst */}
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
    const count = isMobile ? 200 : 800

    const { positions, depths } = useMemo(() => {
        const pos = new Float32Array(count * 3)
        const dep = new Float32Array(count)
        for (let i = 0; i < count; i++) {
            const i3 = i * 3
            pos[i3] = (Math.random() - 0.5) * 30
            pos[i3 + 1] = (Math.random() - 0.5) * 30
            pos[i3 + 2] = (Math.random() - 0.5) * 20 - 5
            dep[i] = (pos[i3 + 2] + 15) / 30 // normalized depth 0–1
        }
        return { positions: pos, depths: dep }
    }, [count])

    const starColors = useMemo(() => {
        const colors = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            const t = Math.random()
            const color = new THREE.Color().setHSL(
                0.55 + t * 0.2, // blue to purple hue
                0.4 + t * 0.4,
                0.6 + t * 0.3
            )
            colors[i * 3] = color.r
            colors[i * 3 + 1] = color.g
            colors[i * 3 + 2] = color.b
        }
        return colors
    }, [count])

    useFrame((state, delta) => {
        if (!pointsRef.current) return

        const time = state.clock.elapsedTime
        const mx = mouse.current.x
        const my = mouse.current.y

        // Depth-based parallax on mouse move
        pointsRef.current.rotation.y = mx * 0.05
        pointsRef.current.rotation.x = my * 0.03

        // Slow drift
        pointsRef.current.rotation.z += delta * 0.005

        // Twinkle effect
        const posAttr = pointsRef.current.geometry.attributes.position
        for (let i = 0; i < count; i++) {
            const i3 = i * 3
            const twinkle = Math.sin(time * (0.5 + depths[i] * 2) + i * 1.3) * 0.003
            posAttr.array[i3 + 1] += twinkle
        }
        posAttr.needsUpdate = true
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
                size={0.03}
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
