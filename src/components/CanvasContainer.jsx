import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import Scene from './Scene'

/**
 * CanvasContainer
 * 
 * Wrapper component for the Three.js canvas.
 * Handles the R3F Canvas setup with proper configuration.
 */
export default function CanvasContainer() {
    return (
        <Canvas
            camera={{ position: [0, 0, 5], fov: 75 }}
            gl={{
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance',
            }}
            dpr={[1, 2]} // Responsive pixel ratio (min 1, max 2 for retina)
            style={{ background: 'transparent' }}
        >
            {/* Scene with 3D objects */}
            <Scene />

            {/* Preload all assets */}
            <Preload all />
        </Canvas>
    )
}
