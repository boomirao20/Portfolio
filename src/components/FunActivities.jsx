import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState, useMemo, useCallback, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, Preload, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { Github, ExternalLink, Sparkles, GripHorizontal } from 'lucide-react'

const PROJECTS = [
    {
        title: 'Flower E-commerce',
        tech: 'Django · OpenAI · PostgreSQL',
        desc: 'Full-stack e-commerce with AI-powered recommendations.',
        github: 'https://github.com/boomi-rao',
        lat: 28.6, lng: 77.2,
        color: '#3B82F6',
    },
    {
        title: 'Weather Checker',
        tech: 'JavaScript · REST API · CSS',
        desc: 'Real-time weather data and forecasts worldwide.',
        github: 'https://github.com/boomi-rao',
        lat: 40.7, lng: -74.0,
        color: '#06B6D4',
    },
    {
        title: 'Cricket Dashboard',
        tech: 'Power BI · DAX · Data Modeling',
        desc: 'Interactive analytics for cricket performance.',
        github: 'https://github.com/boomi-rao',
        lat: 19.1, lng: 72.9,
        color: '#10B981',
    },
    {
        title: 'Mobile OS Analysis',
        tech: 'Tableau · Data Visualization',
        desc: 'Market trends and user behavior analysis.',
        github: 'https://github.com/boomi-rao',
        lat: 37.8, lng: -122.4,
        color: '#F59E0B',
    },
    {
        title: 'Delicacy E-commerce',
        tech: 'HTML · CSS · JavaScript',
        desc: 'Fresh produce delivery with inventory management.',
        github: 'https://github.com/boomi-rao',
        lat: -33.9, lng: 18.4,
        color: '#EC4899',
    },
    {
        title: 'Portfolio Website',
        tech: 'React · Three.js · Tailwind',
        desc: 'The very site you\'re looking at right now!',
        github: 'https://github.com/boomi-rao',
        lat: 51.5, lng: -0.1,
        color: '#8B5CF6',
    },
]

function latLngToVec3(lat, lng, r) {
    const phi = (90 - lat) * (Math.PI / 180)
    const theta = (lng + 180) * (Math.PI / 180)
    return new THREE.Vector3(
        -(r * Math.sin(phi) * Math.cos(theta)),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
    )
}

// ── Globe Canvas Scene ───────────────────────────────────────────

function GlobeScene({ onHover, onSelect, selectedIdx }) {
    const mouseRef = useRef({ x: 0, y: 0 })
    const { pointer } = useThree()

    useFrame(() => {
        mouseRef.current.x += (pointer.x - mouseRef.current.x) * 0.05
        mouseRef.current.y += (pointer.y - mouseRef.current.y) * 0.05
    })

    return (
        <>
            <ambientLight intensity={0.12} />
            <pointLight position={[5, 5, 5]} intensity={0.9} color="#3B82F6" distance={20} />
            <pointLight position={[-5, -3, -5]} intensity={0.6} color="#8B5CF6" distance={20} />
            <pointLight position={[0, -5, 4]} intensity={0.3} color="#06B6D4" distance={15} />

            {/* OrbitControls: drag to rotate, scroll to zoom */}
            <OrbitControls
                enablePan={false}
                enableZoom={true}
                minDistance={3.5}
                maxDistance={8}
                autoRotate
                autoRotateSpeed={0.5}
                rotateSpeed={0.6}
                dampingFactor={0.08}
                enableDamping
            />

            <Globe mouse={mouseRef} onHover={onHover} onSelect={onSelect} selectedIdx={selectedIdx} />
            <GlobeParticles mouse={mouseRef} />
        </>
    )
}

// ── The Globe Mesh ───────────────────────────────────────────────

function Globe({ mouse, onHover, onSelect, selectedIdx }) {
    const groupRef = useRef()
    const wireRef = useRef()
    const glowRef = useRef()
    const [hovered, setHovered] = useState(null)

    const radius = 2.0

    const projectPositions = useMemo(() =>
        PROJECTS.map(p => latLngToVec3(p.lat, p.lng, radius))
        , [radius])

    // Arcs
    const arcCurves = useMemo(() => {
        const curves = []
        for (let i = 0; i < PROJECTS.length; i++) {
            const start = projectPositions[i]
            const end = projectPositions[(i + 1) % PROJECTS.length]
            const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
            mid.normalize().multiplyScalar(mid.length() + radius * 0.35)
            curves.push(new THREE.QuadraticBezierCurve3(start, mid, end))
        }
        return curves
    }, [projectPositions, radius])

    // Grid
    const gridGeo = useMemo(() => {
        const pts = []
        const seg = 64
        for (let lat = -60; lat <= 60; lat += 30) {
            for (let i = 0; i < seg; i++) {
                const a = latLngToVec3(lat, (i / seg) * 360 - 180, radius)
                const b = latLngToVec3(lat, ((i + 1) / seg) * 360 - 180, radius)
                pts.push(a.x, a.y, a.z, b.x, b.y, b.z)
            }
        }
        for (let lng = -180; lng < 180; lng += 30) {
            for (let i = 0; i < seg; i++) {
                const a = latLngToVec3((i / seg) * 180 - 90, lng, radius)
                const b = latLngToVec3(((i + 1) / seg) * 180 - 90, lng, radius)
                pts.push(a.x, a.y, a.z, b.x, b.y, b.z)
            }
        }
        return new Float32Array(pts)
    }, [radius])

    const handleHover = useCallback((idx) => {
        setHovered(idx)
        onHover(idx)
    }, [onHover])

    useFrame((state) => {
        if (!groupRef.current) return
        const t = state.clock.elapsedTime
        groupRef.current.position.y = Math.sin(t * 0.5) * 0.08
        if (wireRef.current) wireRef.current.material.opacity = 0.08 + Math.sin(t * 0.8) * 0.03
        if (glowRef.current) glowRef.current.material.opacity = 0.035 + Math.sin(t * 0.6) * 0.015
    })

    return (
        <group ref={groupRef}>
            {/* Solid body */}
            <mesh>
                <sphereGeometry args={[radius, 48, 48]} />
                <meshStandardMaterial
                    color="#0a0a1a"
                    emissive="#1e3a5f"
                    emissiveIntensity={0.1}
                    metalness={0.8}
                    roughness={0.3}
                    transparent
                    opacity={0.6}
                />
            </mesh>

            {/* Grid */}
            <lineSegments ref={wireRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" count={gridGeo.length / 3} array={gridGeo} itemSize={3} />
                </bufferGeometry>
                <lineBasicMaterial color="#3B82F6" transparent opacity={0.1} blending={THREE.AdditiveBlending} depthWrite={false} />
            </lineSegments>

            {/* Project markers */}
            {PROJECTS.map((proj, i) => {
                const pos = projectPositions[i]
                const tip = pos.clone().normalize().multiplyScalar(pos.length() + 0.18)
                const isActive = hovered === i || selectedIdx === i
                return (
                    <group key={proj.title}>
                        {/* Pillar */}
                        <line>
                            <bufferGeometry>
                                <bufferAttribute
                                    attach="attributes-position" count={2}
                                    array={new Float32Array([pos.x, pos.y, pos.z, tip.x, tip.y, tip.z])}
                                    itemSize={3}
                                />
                            </bufferGeometry>
                            <lineBasicMaterial color={proj.color} transparent opacity={isActive ? 0.8 : 0.4} blending={THREE.AdditiveBlending} depthWrite={false} />
                        </line>

                        {/* Dot */}
                        <MarkerDot
                            position={tip}
                            index={i}
                            project={proj}
                            isActive={isActive}
                            onHover={() => handleHover(i)}
                            onUnhover={() => handleHover(null)}
                            onSelect={() => onSelect(i)}
                        />

                        {/* Pulse ring on active */}
                        {isActive && <PulseRing position={tip} color={proj.color} />}

                        {/* Tooltip */}
                        {isActive && (
                            <Html position={[tip.x, tip.y + 0.22, tip.z]} center distanceFactor={6} style={{ pointerEvents: 'none' }}>
                                <div className="globe-tooltip" style={{ borderColor: proj.color + '60' }}>
                                    <div className="globe-tooltip-title">{proj.title}</div>
                                    <div className="globe-tooltip-tech">{proj.tech}</div>
                                </div>
                            </Html>
                        )}
                    </group>
                )
            })}

            {/* Arcs */}
            {arcCurves.map((curve, i) => (
                <ArcLine key={i} curve={curve} index={i} />
            ))}

            {/* Glow */}
            <mesh ref={glowRef}>
                <sphereGeometry args={[radius + 0.35, 32, 32]} />
                <meshBasicMaterial color="#6366F1" transparent opacity={0.03} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
        </group>
    )
}

// ── Marker Dot ───────────────────────────────────────────────────

function MarkerDot({ position, index, project, isActive, onHover, onUnhover, onSelect }) {
    const ref = useRef()
    useFrame((state) => {
        if (!ref.current) return
        const t = state.clock.elapsedTime
        const s = isActive ? 2.2 : 1 + Math.sin(t * 2 + index * 1.5) * 0.3
        ref.current.scale.setScalar(s)
        ref.current.material.emissiveIntensity = isActive ? 2.5 : 0.8 + Math.sin(t * 2.5 + index) * 0.4
    })
    return (
        <mesh
            ref={ref}
            position={position}
            onPointerOver={(e) => { e.stopPropagation(); onHover() }}
            onPointerOut={onUnhover}
            onClick={(e) => { e.stopPropagation(); onSelect() }}
        >
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial
                color={project.color}
                emissive={project.color}
                emissiveIntensity={1.0}
                metalness={0.5}
                roughness={0.2}
            />
        </mesh>
    )
}

// ── Pulse Ring (animated ring around active marker) ──────────────

function PulseRing({ position, color }) {
    const ref = useRef()
    useFrame((state) => {
        if (!ref.current) return
        const t = state.clock.elapsedTime
        const scale = 1 + (t % 1.5) * 1.5
        ref.current.scale.setScalar(scale)
        ref.current.material.opacity = Math.max(0, 0.6 - (t % 1.5) * 0.4)
    })
    return (
        <mesh ref={ref} position={position} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.06, 0.08, 32]} />
            <meshBasicMaterial
                color={color}
                transparent
                opacity={0.5}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </mesh>
    )
}

// ── Arc Connections ──────────────────────────────────────────────

function ArcLine({ curve, index }) {
    const ref = useRef()
    const pts = useMemo(() => {
        const p = curve.getPoints(40)
        const a = new Float32Array(p.length * 3)
        p.forEach((v, i) => { a[i * 3] = v.x; a[i * 3 + 1] = v.y; a[i * 3 + 2] = v.z })
        return a
    }, [curve])

    useFrame((state) => {
        if (ref.current) ref.current.material.opacity = 0.12 + Math.sin(state.clock.elapsedTime * 1.5 + index * 1.2) * 0.08
    })

    return (
        <line ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={pts.length / 3} array={pts} itemSize={3} />
            </bufferGeometry>
            <lineBasicMaterial color="#8B5CF6" transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
        </line>
    )
}

// ── Background particles ─────────────────────────────────────────

function GlobeParticles({ mouse }) {
    const ref = useRef()
    const count = 200
    const { positions, colors } = useMemo(() => {
        const p = new Float32Array(count * 3)
        const c = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            p[i * 3] = (Math.random() - 0.5) * 18
            p[i * 3 + 1] = (Math.random() - 0.5) * 14
            p[i * 3 + 2] = (Math.random() - 0.5) * 10 - 3
            const t = Math.random()
            const col = new THREE.Color().setHSL(0.58 + t * 0.18, 0.6, 0.4 + t * 0.25)
            c[i * 3] = col.r; c[i * 3 + 1] = col.g; c[i * 3 + 2] = col.b
        }
        return { positions: p, colors: c }
    }, [count])

    useFrame((state, delta) => {
        if (!ref.current) return
        ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, mouse.current.x * 0.03, 0.01)
        ref.current.rotation.z += delta * 0.001
    })

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
                <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.025} vertexColors sizeAttenuation transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
        </points>
    )
}

// ── Main Export ──────────────────────────────────────────────────

export default function FunActivities() {
    const sectionRef = useRef(null)
    const isInView = useInView(sectionRef, { once: true, margin: '-80px' })
    const [hoveredIdx, setHoveredIdx] = useState(null)
    const [selectedIdx, setSelectedIdx] = useState(null)

    const activeIdx = selectedIdx ?? hoveredIdx
    const activeProject = activeIdx !== null ? PROJECTS[activeIdx] : null

    const handleSelect = useCallback((idx) => {
        setSelectedIdx(prev => prev === idx ? null : idx)
    }, [])

    return (
        <section
            id="fun"
            className="relative py-20 px-4 md:px-8 overflow-hidden"
            aria-label="GitHub projects globe"
        >
            <div className="absolute top-1/4 left-0 w-80 h-80 bg-accent-violet/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-accent-blue/5 rounded-full blur-3xl" />

            <div ref={sectionRef} className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-8"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Sparkles className="w-6 h-6 text-accent-violet" />
                        <h2 className="font-heading text-4xl md:text-5xl font-bold">
                            <span className="gradient-text">My Projects</span>
                        </h2>
                        <Sparkles className="w-6 h-6 text-accent-blue" />
                    </div>
                    <div className="w-24 h-1 bg-gradient-to-r from-accent-blue to-accent-violet mx-auto rounded-full" />
                    <p className="font-body text-gray-400 mt-4 max-w-xl mx-auto flex items-center justify-center gap-2">
                        <GripHorizontal size={16} className="text-gray-500" />
                        Drag to rotate · Scroll to zoom · Click markers to explore
                    </p>
                </motion.div>

                {/* Globe + Project List side by side */}
                <div className="flex flex-col lg:flex-row items-center gap-8">
                    {/* Globe */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative w-full aspect-square max-w-[500px] flex-shrink-0"
                    >
                        <Canvas
                            camera={{ position: [0, 0, 5.5], fov: 50 }}
                            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                            dpr={[1, 1.5]}
                            style={{ background: 'transparent' }}
                        >
                            <Suspense fallback={null}>
                                <GlobeScene onHover={setHoveredIdx} onSelect={handleSelect} selectedIdx={selectedIdx} />
                                <Preload all />
                            </Suspense>
                        </Canvas>
                    </motion.div>

                    {/* Project List */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="w-full lg:max-w-sm space-y-3"
                    >
                        {PROJECTS.map((proj, i) => {
                            const isActive = activeIdx === i
                            return (
                                <motion.button
                                    key={proj.title}
                                    onClick={() => handleSelect(i)}
                                    onMouseEnter={() => setHoveredIdx(i)}
                                    onMouseLeave={() => setHoveredIdx(null)}
                                    whileHover={{ x: 6 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`w-full text-left glass rounded-xl p-4 transition-all duration-300 border ${isActive
                                            ? 'border-white/20 shadow-lg'
                                            : 'border-white/5 hover:border-white/10'
                                        }`}
                                    style={isActive ? { boxShadow: `0 0 25px ${proj.color}15, 0 4px 20px rgba(0,0,0,0.3)` } : {}}
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Color dot */}
                                        <div
                                            className="w-3 h-3 rounded-full flex-shrink-0 transition-transform duration-300"
                                            style={{
                                                backgroundColor: proj.color,
                                                boxShadow: isActive ? `0 0 10px ${proj.color}80` : 'none',
                                                transform: isActive ? 'scale(1.3)' : 'scale(1)',
                                            }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-heading text-sm font-semibold text-white truncate">
                                                {proj.title}
                                            </h3>
                                            <p className="font-body text-xs text-gray-500 truncate">{proj.tech}</p>
                                        </div>
                                        {isActive && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="flex-shrink-0"
                                            >
                                                <a
                                                    href={proj.github}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-white/20 transition-colors text-xs"
                                                >
                                                    <Github size={12} />
                                                    <ExternalLink size={10} />
                                                </a>
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Expanded description */}
                                    <AnimatePresence>
                                        {isActive && (
                                            <motion.p
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.25 }}
                                                className="font-body text-xs text-gray-400 mt-2 pl-6 leading-relaxed"
                                            >
                                                {proj.desc}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </motion.button>
                            )
                        })}
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
