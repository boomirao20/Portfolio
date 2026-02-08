import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Scene Component
 * 
 * Contains the 3D scene for the Hero section:
 * - Abstract sphere with distortion material
 * - Slow auto-rotation
 * - Mouse-based parallax interaction
 * - Particle field background
 */
export default function Scene() {
    return (
        <>
            {/* Ambient light for overall illumination */}
            <ambientLight intensity={0.3} />

            {/* Directional light for shadows and depth */}
            <directionalLight position={[5, 5, 5]} intensity={0.8} color="#3B82F6" />
            <directionalLight position={[-5, -5, -5]} intensity={0.4} color="#8B5CF6" />

            {/* Point lights for accent colors */}
            <pointLight position={[0, 3, 0]} intensity={0.5} color="#06B6D4" />

            {/* Main abstract sphere */}
            <AbstractSphere />

            {/* Particle field */}
            <ParticleField />
        </>
    )
}

/**
 * AbstractSphere
 * 
 * The main 3D object - a distorted sphere with gradient-like material
 * - Uses Float from drei for subtle floating animation
 * - MeshDistortMaterial for organic, abstract look
 * - Responds to mouse movement for parallax effect
 */
function AbstractSphere() {
    const meshRef = useRef()
    const { pointer } = useThree()

    useFrame((state, delta) => {
        if (meshRef.current) {
            // Slow auto-rotation
            meshRef.current.rotation.y += delta * 0.1
            meshRef.current.rotation.x += delta * 0.05

            // Mouse-based parallax (subtle)
            meshRef.current.position.x = THREE.MathUtils.lerp(
                meshRef.current.position.x,
                pointer.x * 0.5,
                0.02
            )
            meshRef.current.position.y = THREE.MathUtils.lerp(
                meshRef.current.position.y,
                pointer.y * 0.3,
                0.02
            )
        }
    })

    return (
        <Float
            speed={2}
            rotationIntensity={0.2}
            floatIntensity={0.3}
        >
            <Sphere ref={meshRef} args={[1.5, 64, 64]} position={[0, 0, 0]}>
                <MeshDistortMaterial
                    color="#3B82F6"
                    attach="material"
                    distort={0.4}
                    speed={1.5}
                    roughness={0.2}
                    metalness={0.8}
                    emissive="#1E3A8A"
                    emissiveIntensity={0.3}
                />
            </Sphere>
        </Float>
    )
}

/**
 * ParticleField
 * 
 * Creates a starfield-like background of particles
 * - Low-poly (just points, no geometry)
 * - Subtle movement for depth
 */
function ParticleField() {
    const pointsRef = useRef()
    const count = 500

    // Generate random positions for particles
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            const i3 = i * 3
            pos[i3] = (Math.random() - 0.5) * 15
            pos[i3 + 1] = (Math.random() - 0.5) * 15
            pos[i3 + 2] = (Math.random() - 0.5) * 15
        }
        return pos
    }, [])

    useFrame((state, delta) => {
        if (pointsRef.current) {
            // Slow rotation for subtle movement
            pointsRef.current.rotation.y += delta * 0.02
            pointsRef.current.rotation.x += delta * 0.01
        }
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
            </bufferGeometry>
            <pointsMaterial
                size={0.02}
                color="#8B5CF6"
                sizeAttenuation
                transparent
                opacity={0.8}
            />
        </points>
    )
}
