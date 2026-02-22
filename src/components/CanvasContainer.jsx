import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import Scene from './Scene'

/**
 * CanvasContainer
 * 
 * Wrapper for the Three.js R3F canvas with bloom post-processing.
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

            {/* Post-processing bloom */}
            <EffectComposer>
                <Bloom
                    intensity={0.8}
                    luminanceThreshold={0.2}
                    luminanceSmoothing={0.9}
                    mipmapBlur
                />
            </EffectComposer>

            <Preload all />
        </Canvas>
    )
}
