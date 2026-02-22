import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import Scene from './Scene'

/**
 * CanvasContainer
 * 
 * Wrapper for the Three.js R3F canvas.
 * Glow effect achieved via additive blending and emissive materials
 * instead of postprocessing (avoids version conflicts).
 */
export default function CanvasContainer({ isMobile }) {
    return (
        <Canvas
            camera={{ position: [0, 0, 6], fov: 65 }}
            gl={{
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance',
            }}
            dpr={[1, isMobile ? 1.5 : 2]}
            style={{ background: 'transparent' }}
        >
            <Scene isMobile={isMobile} />
            <Preload all />
        </Canvas>
    )
}
