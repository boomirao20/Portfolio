import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, Sparkles, Code2, Brain, Database, Trophy, Calendar, MapPin, ChevronRight, Zap, ArrowRight } from 'lucide-react'

// Animated counter component
function AnimatedCounter({ value, suffix = '', duration = 2 }) {
    const [count, setCount] = useState(0)
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })

    useState(() => {
        if (isInView) {
            let start = 0
            const end = parseInt(value)
            const incrementTime = (duration * 1000) / end
            const timer = setInterval(() => {
                start += 1
                setCount(start)
                if (start >= end) clearInterval(timer)
            }, incrementTime)
            return () => clearInterval(timer)
        }
    }, [isInView, value, duration])

    return (
        <span ref={ref} className="tabular-nums">
            {isInView ? count : 0}{suffix}
        </span>
    )
}

// Stats data
const stats = [
    { label: 'Projects Completed', value: '10', suffix: '+', icon: Code2 },
    { label: 'Technologies', value: '15', suffix: '+', icon: Zap },
    { label: 'Years Learning', value: '3', suffix: '+', icon: Calendar },
]

// Highlight tags
const highlights = [
    { text: 'Web Development', color: 'from-blue-500 to-cyan-500' },
    { text: 'AI & ML', color: 'from-violet-500 to-purple-500' },
    { text: 'Data Analytics', color: 'from-cyan-500 to-teal-500' },
    { text: 'React & Next.js', color: 'from-blue-400 to-indigo-500' },
    { text: 'Python', color: 'from-yellow-500 to-orange-500' },
    { text: 'Problem Solving', color: 'from-pink-500 to-rose-500' },
]

// Timeline data
const timeline = [
    {
        year: '2023',
        title: 'Started B.Voc in AI & Data Science',
        description: 'Began my journey into artificial intelligence and data science',
        icon: GraduationCap,
    },
    {
        year: '2024',
        title: 'Web Development Focus',
        description: 'Mastered React, Next.js, and modern frontend technologies',
        icon: Code2,
    },
    {
        year: '2025',
        title: 'Building Real Projects',
        description: 'Creating impactful solutions and expanding my portfolio',
        icon: Trophy,
    },
]

export default function About() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-100px' })
    const [activeHighlight, setActiveHighlight] = useState(null)
    const [hoveredTimeline, setHoveredTimeline] = useState(null)

    return (
        <section
            id="about"
            className="section relative overflow-hidden"
            aria-label="About section"
        >
            {/* Background accents */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-accent-blue/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent-violet/5 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-cyan/3 rounded-full blur-3xl" />

            <div ref={ref} className="relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
                        <span className="gradient-text">About Me</span>
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-accent-blue to-accent-violet mx-auto rounded-full" />
                </motion.div>

                {/* Stats Row */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid grid-cols-3 gap-4 md:gap-8 mb-16 max-w-2xl mx-auto"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="glass rounded-2xl p-4 md:p-6 text-center cursor-default group"
                        >
                            <div className="flex justify-center mb-3">
                                <div className="p-2 md:p-3 rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-violet/20 group-hover:scale-110 transition-transform">
                                    <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-accent-blue" />
                                </div>
                            </div>
                            <div className="font-heading text-2xl md:text-3xl font-bold gradient-text mb-1">
                                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                            </div>
                            <p className="font-body text-xs md:text-sm text-gray-400">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Left - Bio & Education */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="space-y-6"
                    >
                        {/* Bio Card */}
                        <div className="glass rounded-2xl p-6 md:p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent-blue/10 to-transparent rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity" />

                            <p className="font-body text-lg text-gray-300 leading-relaxed relative z-10">
                                I'm a dedicated undergraduate student pursuing a <span className="text-white font-medium">B.Voc in Artificial Intelligence & Data Science</span>.
                                My journey combines technical expertise in web development with a deep interest in machine learning and data-driven solutions.
                            </p>
                            <p className="font-body text-lg text-gray-300 leading-relaxed mt-4 relative z-10">
                                I believe in creating technology that makes a meaningful impact — whether it's through intuitive user experiences,
                                intelligent automation, or insightful data visualization.
                            </p>
                        </div>

                        {/* Education Card */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="glass rounded-2xl p-6 card-hover cursor-default"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-violet/20">
                                    <GraduationCap className="w-6 h-6 text-accent-blue" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-heading text-xl font-semibold text-white mb-2">
                                        Education
                                    </h3>
                                    <p className="font-body text-gray-200 font-medium">
                                        B.Voc in Artificial Intelligence & Data Science
                                    </p>
                                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} className="text-accent-blue" />
                                            2023 – 2027
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPin size={14} className="text-accent-violet" />
                                            India
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Interests Card */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="glass rounded-2xl p-6 card-hover cursor-default"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-accent-violet/20 to-accent-cyan/20">
                                    <Sparkles className="w-6 h-6 text-accent-violet" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-heading text-xl font-semibold text-white mb-3">
                                        What Drives Me
                                    </h3>
                                    <p className="font-body text-gray-400 leading-relaxed">
                                        I love building solutions that bridge the gap between intelligent systems and user-friendly interfaces.
                                        Every project is an opportunity to learn and create something impactful.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right - Timeline & Highlights */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="space-y-8"
                    >
                        {/* Interactive Skill Highlights */}
                        <div className="glass rounded-2xl p-6">
                            <h3 className="font-heading text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Brain className="w-5 h-5 text-accent-blue" />
                                Core Expertise
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {highlights.map((highlight, index) => (
                                    <motion.button
                                        key={highlight.text}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                        transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onMouseEnter={() => setActiveHighlight(index)}
                                        onMouseLeave={() => setActiveHighlight(null)}
                                        className={`px-4 py-2 rounded-full font-body text-sm transition-all duration-300 ${activeHighlight === index
                                            ? `bg-gradient-to-r ${highlight.color} text-white shadow-lg`
                                            : 'bg-white/5 text-gray-300 hover:bg-white/10'
                                            }`}
                                    >
                                        {highlight.text}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="glass rounded-2xl p-6">
                            <h3 className="font-heading text-lg font-semibold text-white mb-6 flex items-center gap-2">
                                <Database className="w-5 h-5 text-accent-violet" />
                                My Journey
                            </h3>
                            <div className="relative">
                                {/* Timeline line */}
                                <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-accent-blue via-accent-violet to-accent-cyan" />

                                <div className="space-y-6">
                                    {timeline.map((item, index) => (
                                        <motion.div
                                            key={item.year}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                                            transition={{ duration: 0.4, delay: 0.6 + index * 0.15 }}
                                            onMouseEnter={() => setHoveredTimeline(index)}
                                            onMouseLeave={() => setHoveredTimeline(null)}
                                            className="relative flex gap-4 cursor-default group"
                                        >
                                            {/* Timeline dot */}
                                            <motion.div
                                                animate={{
                                                    scale: hoveredTimeline === index ? 1.2 : 1,
                                                    boxShadow: hoveredTimeline === index
                                                        ? '0 0 20px rgba(99, 102, 241, 0.5)'
                                                        : '0 0 0px rgba(99, 102, 241, 0)'
                                                }}
                                                className="relative z-10 w-10 h-10 rounded-full bg-secondary border-2 border-accent-blue/50 flex items-center justify-center flex-shrink-0"
                                            >
                                                <item.icon className="w-4 h-4 text-accent-blue" />
                                            </motion.div>

                                            {/* Content */}
                                            <div className="flex-1 pb-2">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="px-2 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue text-xs font-medium">
                                                        {item.year}
                                                    </span>
                                                    <AnimatePresence>
                                                        {hoveredTimeline === index && (
                                                            <motion.span
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                exit={{ opacity: 0, x: -10 }}
                                                            >
                                                                <ChevronRight size={14} className="text-accent-violet" />
                                                            </motion.span>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                                <h4 className="font-heading font-semibold text-white group-hover:text-accent-blue transition-colors">
                                                    {item.title}
                                                </h4>
                                                <p className="font-body text-sm text-gray-400 mt-1">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Fun Fact */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ duration: 0.6, delay: 0.9 }}
                            whileHover={{ scale: 1.02 }}
                            className="p-4 rounded-xl bg-gradient-to-br from-accent-blue/5 to-accent-violet/5 border border-white/5 cursor-default"
                        >
                            <p className="font-body text-sm text-gray-400">
                                💡 <span className="text-gray-300">Fun fact:</span> I'm always exploring new technologies and love turning creative ideas into working solutions!
                            </p>
                        </motion.div>

                        {/* View Projects CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 1.0 }}
                        >
                            <Link
                                to="/projects"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-heading font-semibold text-white bg-gradient-to-r from-accent-blue to-accent-violet hover:shadow-lg hover:shadow-accent-blue/25 transition-all duration-300 group"
                            >
                                View Projects
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
