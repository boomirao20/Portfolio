import { Suspense, lazy, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowDown, MessageCircle, FolderOpen } from 'lucide-react'

// Lazy load the 3D canvas for performance
const CanvasContainer = lazy(() => import('./CanvasContainer'))

export default function Hero() {
    const [isMobile, setIsMobile] = useState(false)
    const [showCanvas, setShowCanvas] = useState(false)

    useEffect(() => {
        // Check if mobile or small screen
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768 || window.matchMedia('(prefers-reduced-motion: reduce)').matches)
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)

        // Delay canvas loading for better initial paint
        const timer = setTimeout(() => setShowCanvas(true), 100)

        return () => {
            window.removeEventListener('resize', checkMobile)
            clearTimeout(timer)
        }
    }, [])

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut' },
        },
    }

    return (
        <section
            id="hero"
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
            aria-label="Hero section"
        >
            {/* WebGL Background - Only on desktop */}
            {!isMobile && showCanvas && (
                <div className="absolute inset-0 z-0">
                    <Suspense fallback={<div className="w-full h-full bg-primary" />}>
                        <CanvasContainer />
                    </Suspense>
                </div>
            )}

            {/* Fallback gradient for mobile */}
            {isMobile && (
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary via-secondary to-primary">
                    {/* Animated gradient orbs as fallback */}
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
                {/* Name */}
                <motion.h1
                    variants={itemVariants}
                    className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold mb-4"
                >
                    <span className="gradient-text">Boomi Rao</span>
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
                    "Building intelligent, data-driven web applications."
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                    <Link
                        to="/projects"
                        className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-accent-blue to-accent-violet rounded-full font-heading font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-accent-blue/25 hover:scale-105"
                    >
                        <FolderOpen size={20} />
                        View Projects
                    </Link>
                    <Link
                        to="/contact"
                        className="group flex items-center gap-2 px-8 py-4 border-2 border-gray-600 rounded-full font-heading font-semibold text-gray-300 transition-all duration-300 hover:border-accent-violet hover:text-white hover:scale-105"
                    >
                        <MessageCircle size={20} />
                        Get In Touch
                    </Link>
                </motion.div>
            </motion.div>
        </section>
    )
}
