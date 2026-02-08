import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Code2, Server, Database, Wrench } from 'lucide-react'

const skillCategories = [
    {
        title: 'Frontend',
        icon: Code2,
        color: 'from-blue-500 to-cyan-500',
        skills: ['HTML', 'CSS', 'JavaScript'],
    },
    {
        title: 'Backend',
        icon: Server,
        color: 'from-violet-500 to-purple-500',
        skills: ['Python', 'Django', 'Node.js'],
    },
    {
        title: 'Data & AI',
        icon: Database,
        color: 'from-emerald-500 to-teal-500',
        skills: ['SQL', 'Power BI', 'Tableau', 'Machine Learning'],
    },
    {
        title: 'Tools',
        icon: Wrench,
        color: 'from-orange-500 to-amber-500',
        skills: ['Git', 'GitHub', 'PostgreSQL', 'Excel'],
    },
]

export default function Skills() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-100px' })

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    }

    return (
        <section
            id="skills"
            className="section relative bg-secondary/30"
            aria-label="Skills section"
        >
            <div ref={ref}>
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
                        <span className="gradient-text">Skills</span>
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-accent-blue to-accent-violet mx-auto rounded-full" />
                    <p className="font-body text-gray-400 mt-4 max-w-2xl mx-auto">
                        Technologies and tools I work with
                    </p>
                </motion.div>

                {/* Skills Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {skillCategories.map((category, index) => (
                        <motion.div
                            key={category.title}
                            variants={cardVariants}
                            className="glass rounded-2xl p-6 card-hover group"
                        >
                            {/* Icon */}
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} p-3 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                <category.icon className="w-full h-full text-white" />
                            </div>

                            {/* Title */}
                            <h3 className="font-heading text-xl font-semibold text-white mb-4">
                                {category.title}
                            </h3>

                            {/* Skills List */}
                            <ul className="space-y-2">
                                {category.skills.map((skill) => (
                                    <li
                                        key={skill}
                                        className="font-body text-gray-400 flex items-center gap-2"
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${category.color}`} />
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
