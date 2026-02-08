import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ExternalLink, Github, Layers } from 'lucide-react'

const projects = [
    {
        title: 'Flower E-commerce Platform',
        problem: 'Built a full-stack e-commerce platform for flower sales with AI-powered recommendations and seamless checkout experience.',
        stack: ['Django', 'OpenAI', 'PostgreSQL'],
        github: 'https://github.com/boomi-rao',
        demo: '#',
    },
    {
        title: 'Weather Checker Web App',
        problem: 'Developed a responsive weather application that provides real-time weather data and forecasts for any location worldwide.',
        stack: ['JavaScript', 'REST API', 'CSS'],
        github: 'https://github.com/boomi-rao',
        demo: '#',
    },
    {
        title: 'Cricket Performance Dashboard',
        problem: 'Created an interactive analytics dashboard to visualize and analyze cricket player performance metrics and team statistics.',
        stack: ['Power BI', 'DAX', 'Data Modeling'],
        github: 'https://github.com/boomi-rao',
        demo: '#',
    },
    {
        title: 'Mobile OS Usage Analysis',
        problem: 'Analyzed mobile operating system market trends and user behavior patterns using data visualization techniques.',
        stack: ['Tableau', 'Data Analysis', 'Visualization'],
        github: 'https://github.com/boomi-rao',
        demo: '#',
    },
    {
        title: 'Delicacy – Fresh Produce E-commerce',
        problem: 'Designed and developed an e-commerce platform for fresh produce delivery with inventory management and order tracking.',
        stack: ['HTML', 'CSS', 'JavaScript'],
        github: 'https://github.com/boomi-rao',
        demo: '#',
    },
]

export default function Projects() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-100px' })

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    }

    const cardVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 },
        },
    }

    return (
        <section
            id="projects"
            className="section relative"
            aria-label="Projects section"
        >
            {/* Background accents */}
            <div className="absolute top-1/4 left-0 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent-violet/5 rounded-full blur-3xl" />

            <div ref={ref} className="relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
                        <span className="gradient-text">Projects</span>
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-accent-blue to-accent-violet mx-auto rounded-full" />
                    <p className="font-body text-gray-400 mt-4 max-w-2xl mx-auto">
                        A selection of projects I've worked on
                    </p>
                </motion.div>

                {/* Projects Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {projects.map((project, index) => (
                        <motion.article
                            key={project.title}
                            variants={cardVariants}
                            className="glass rounded-2xl overflow-hidden card-hover group"
                        >
                            {/* Card Header */}
                            <div className="h-2 bg-gradient-to-r from-accent-blue via-accent-violet to-accent-cyan" />

                            <div className="p-6">
                                {/* Icon & Title */}
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-accent-blue/20 to-accent-violet/20 group-hover:scale-110 transition-transform">
                                        <Layers className="w-5 h-5 text-accent-blue" />
                                    </div>
                                    <h3 className="font-heading text-lg font-semibold text-white leading-tight">
                                        {project.title}
                                    </h3>
                                </div>

                                {/* Problem Statement */}
                                <p className="font-body text-gray-400 text-sm mb-4 line-clamp-3">
                                    {project.problem}
                                </p>

                                {/* Tech Stack */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.stack.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-3 py-1 text-xs font-body rounded-full bg-gray-800 text-gray-300 border border-gray-700"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                {/* Links */}
                                <div className="flex gap-4">
                                    <a
                                        href={project.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm font-body text-gray-400 hover:text-accent-blue transition-colors"
                                        aria-label={`View ${project.title} on GitHub`}
                                    >
                                        <Github size={16} />
                                        Code
                                    </a>
                                    <a
                                        href={project.demo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm font-body text-gray-400 hover:text-accent-violet transition-colors"
                                        aria-label={`View ${project.title} live demo`}
                                    >
                                        <ExternalLink size={16} />
                                        Live Demo
                                    </a>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
