import { Suspense, lazy, useState, useEffect, useRef, useCallback, Component } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FolderOpen, MessageCircle } from 'lucide-react'

// Lazy load the 3D canvas
const CanvasContainer = lazy(() => import('./CanvasContainer'))

// Error boundary for 3D canvas — catches WebGL crashes gracefully
class CanvasErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false }
    }
    static getDerivedStateFromError() {
        return { hasError: true }
    }
    componentDidCatch(error, info) {
        console.error('3D Canvas Error:', error, info)
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary via-secondary to-primary">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent-blue/20 rounded-full blur-3xl animate-float" />
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-violet/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
                </div>
            )
        }
        return this.props.children
    }
}

// ── Interactive Letter Component ──────────────────────────────────

function InteractiveLetter({ char, index, mousePos, isScattered, total }) {
    const letterRef = useRef(null)
    const [hover, setHover] = useState(false)

    // Scatter positions (random directions)
    const scatterX = useRef((Math.random() - 0.5) * 400)
    const scatterY = useRef((Math.random() - 0.5) * 300)
    const scatterRotate = useRef((Math.random() - 0.5) * 180)

    return (
        <motion.span
            ref={letterRef}
            className="hero-letter inline-block cursor-default select-none"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            animate={
                isScattered
                    ? {
                        x: scatterX.current,
                        y: scatterY.current,
                        rotate: scatterRotate.current,
                        opacity: 0.3,
                        scale: 0.6,
                    }
                    : {
                        x: 0,
                        y: 0,
                        rotate: 0,
                        opacity: 1,
                        scale: hover ? 1.15 : 1,
                    }
            }
            transition={
                isScattered
                    ? { type: 'spring', stiffness: 200, damping: 15, delay: index * 0.02 }
                    : { type: 'spring', stiffness: 300, damping: 20, delay: index * 0.03 }
            }
            style={{
                display: char === ' ' ? 'inline' : 'inline-block',
                textShadow: hover ? '0 0 30px rgba(99, 102, 241, 0.8)' : 'none',
            }}
        >
            {char === ' ' ? '\u00A0' : char}
        </motion.span>
    )
}

// ── Magnetic Button Component ─────────────────────────────────────

function MagneticButton({ children, to, variant = 'primary', className = '' }) {
    const buttonRef = useRef(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const springX = useSpring(x, { stiffness: 200, damping: 15 })
    const springY = useSpring(y, { stiffness: 200, damping: 15 })
    const [ripple, setRipple] = useState(null)
    const [isHovered, setIsHovered] = useState(false)

    const handleMouseMove = useCallback((e) => {
        if (!buttonRef.current) return
        const rect = buttonRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        x.set((e.clientX - centerX) * 0.3)
        y.set((e.clientY - centerY) * 0.3)
    }, [x, y])

    const handleMouseLeave = useCallback(() => {
        x.set(0)
        y.set(0)
        setIsHovered(false)
    }, [x, y])

    const handleClick = useCallback((e) => {
        if (!buttonRef.current) return
        const rect = buttonRef.current.getBoundingClientRect()
        setRipple({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            id: Date.now(),
        })
        setTimeout(() => setRipple(null), 600)
    }, [])

    const baseClass = variant === 'primary'
        ? 'hero-btn-primary'
        : 'hero-btn-secondary'

    return (
        <motion.div
            ref={buttonRef}
            style={{ x: springX, y: springY }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            className="relative"
        >
            <Link
                to={to}
                className={`relative overflow-hidden flex items-center gap-2 px-8 py-4 rounded-full font-heading font-semibold transition-all duration-300 ${baseClass} ${className}`}
            >
                {children}

                {/* Ripple effect */}
                <AnimatePresence>
                    {ripple && (
                        <motion.span
                            key={ripple.id}
                            className="absolute rounded-full bg-white/20 pointer-events-none"
                            style={{
                                left: ripple.x,
                                top: ripple.y,
                                transform: 'translate(-50%, -50%)',
                            }}
                            initial={{ width: 0, height: 0, opacity: 0.6 }}
                            animate={{ width: 300, height: 300, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                        />
                    )}
                </AnimatePresence>
            </Link>

            {/* Glow pulse on hover */}
            {isHovered && variant === 'primary' && (
                <motion.div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{
                        boxShadow: '0 0 30px rgba(59, 130, 246, 0.5), 0 0 60px rgba(139, 92, 246, 0.3)',
                    }}
                />
            )}
        </motion.div>
    )
}

// ── Custom Cursor Component ───────────────────────────────────────

function CustomCursor() {
    const cursorRef = useRef(null)
    const trailRefs = useRef([])
    const [isInteractive, setIsInteractive] = useState(false)
    const pos = useRef({ x: -100, y: -100 })
    const trailPositions = useRef(Array.from({ length: 5 }, () => ({ x: -100, y: -100 })))

    useEffect(() => {
        const handleMouseMove = (e) => {
            pos.current.x = e.clientX
            pos.current.y = e.clientY
        }

        const handleMouseOver = (e) => {
            const target = e.target
            if (
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('a') ||
                target.closest('button') ||
                target.classList.contains('hero-letter')
            ) {
                setIsInteractive(true)
            } else {
                setIsInteractive(false)
            }
        }

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseover', handleMouseOver)

        let raf
        const animate = () => {
            // Main cursor
            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`
            }

            // Trail
            for (let i = trailPositions.current.length - 1; i > 0; i--) {
                trailPositions.current[i].x += (trailPositions.current[i - 1].x - trailPositions.current[i].x) * 0.3
                trailPositions.current[i].y += (trailPositions.current[i - 1].y - trailPositions.current[i].y) * 0.3
            }
            trailPositions.current[0].x += (pos.current.x - trailPositions.current[0].x) * 0.4
            trailPositions.current[0].y += (pos.current.y - trailPositions.current[0].y) * 0.4

            trailRefs.current.forEach((el, i) => {
                if (el) {
                    el.style.transform = `translate(${trailPositions.current[i].x}px, ${trailPositions.current[i].y}px)`
                    el.style.opacity = `${0.4 - i * 0.08}`
                }
            })

            raf = requestAnimationFrame(animate)
        }
        raf = requestAnimationFrame(animate)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseover', handleMouseOver)
            cancelAnimationFrame(raf)
        }
    }, [])

    return (
        <div className="custom-cursor-container">
            {/* Trail particles */}
            {Array.from({ length: 5 }).map((_, i) => (
                <div
                    key={i}
                    ref={(el) => (trailRefs.current[i] = el)}
                    className="cursor-trail"
                    style={{
                        width: `${8 - i * 1.2}px`,
                        height: `${8 - i * 1.2}px`,
                    }}
                />
            ))}

            {/* Main cursor orb */}
            <div
                ref={cursorRef}
                className={`cursor-orb ${isInteractive ? 'cursor-orb-interactive' : ''}`}
            />
        </div>
    )
}

// ── Hero Component ────────────────────────────────────────────────

export default function Hero() {
    const [isMobile, setIsMobile] = useState(false)
    const [showCanvas, setShowCanvas] = useState(false)
    const [isScattered, setIsScattered] = useState(false)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

    const nameText = 'Boomi Rao'
    const nameLetters = nameText.split('')

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)

        const timer = setTimeout(() => setShowCanvas(true), 100)

        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY })
        }
        window.addEventListener('mousemove', handleMouseMove)

        return () => {
            window.removeEventListener('resize', checkMobile)
            window.removeEventListener('mousemove', handleMouseMove)
            clearTimeout(timer)
        }
    }, [])

    const handleNameClick = useCallback(() => {
        if (isScattered) return
        setIsScattered(true)
        setTimeout(() => setIsScattered(false), 800)
    }, [isScattered])

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
                delayChildren: 0.5,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, ease: 'easeOut' },
        },
    }

    return (
        <section
            id="hero"
            className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden"
            aria-label="Hero section"
        >
            {/* Custom Cursor (desktop only) */}
            {!isMobile && <CustomCursor />}

            {/* WebGL Background — Desktop */}
            {!isMobile && showCanvas && (
                <div className="absolute inset-0 z-0">
                    <CanvasErrorBoundary>
                        <Suspense fallback={<div className="w-full h-full bg-primary" />}>
                            <CanvasContainer isMobile={isMobile} />
                        </Suspense>
                    </CanvasErrorBoundary>
                </div>
            )}

            {/* Fallback gradient — Mobile */}
            {isMobile && (
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary via-secondary to-primary">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent-blue/20 rounded-full blur-3xl animate-float" />
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-violet/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
                </div>
            )}

            {/* Content */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 text-center px-4 max-w-4xl mx-auto"
            >
                {/* Interactive Name */}
                <motion.h1
                    variants={itemVariants}
                    className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold mb-4 hero-name"
                    onClick={handleNameClick}
                >
                    {nameLetters.map((char, i) => (
                        <InteractiveLetter
                            key={`${char}-${i}`}
                            char={char}
                            index={i}
                            mousePos={mousePos}
                            isScattered={isScattered}
                            total={nameLetters.length}
                        />
                    ))}
                </motion.h1>

                {/* Title */}
                <motion.p
                    variants={itemVariants}
                    className="font-heading text-xl md:text-2xl text-gray-300 mb-6"
                >
                    AI & Data Science Student{' '}
                    <span className="text-accent-blue">|</span>{' '}
                    Web Developer
                </motion.p>

                {/* Tagline */}
                <motion.p
                    variants={itemVariants}
                    className="font-body text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto"
                >
                    Building intelligent, data-driven web experiences.
                </motion.p>

                {/* Magnetic CTA Buttons */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row gap-5 justify-center items-center"
                >
                    <MagneticButton to="/projects" variant="primary">
                        <FolderOpen size={20} />
                        View Projects
                    </MagneticButton>

                    <MagneticButton to="/contact" variant="secondary">
                        <MessageCircle size={20} />
                        Get In Touch
                    </MagneticButton>
                </motion.div>
            </motion.div>

            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary to-transparent z-5 pointer-events-none" />
        </section>
    )
}
