import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Award, ExternalLink } from 'lucide-react'

const certifications = [
    {
        title: 'AI & Web Development',
        issuer: 'NASSCOM',
        description: 'Certified in Artificial Intelligence and Web Development fundamentals.',
        color: 'from-blue-500 to-cyan-500',
    },
    {
        title: 'Deep Learning & LLMs',
        issuer: 'NVIDIA',
        description: 'Completed certification in Deep Learning and Large Language Models.',
        color: 'from-green-500 to-emerald-500',
    },
    {
        title: 'Microsoft Excel Associate',
        issuer: 'Microsoft',
        description: 'Certified Microsoft Office Specialist in Excel data analysis and visualization.',
        color: 'from-violet-500 to-purple-500',
    },
]

export default function Certifications() {
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
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5 },
        },
    }

    return (
        <section
            id="certifications"
            className="section relative"
            aria-label="Certifications section"
        >
            {/* Background accents */}
            <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-accent-blue/5 rounded-full blur-3xl" />

            <div ref={ref} className="relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
                        <span className="gradient-text">Certifications</span>
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-accent-blue to-accent-violet mx-auto rounded-full" />
                    <p className="font-body text-gray-400 mt-4 max-w-2xl mx-auto">
                        Professional certifications and achievements
                    </p>
                </motion.div>

                {/* Certifications Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
                >
                    {certifications.map((cert) => (
                        <motion.div
                            key={cert.title}
                            variants={cardVariants}
                            className="glass rounded-2xl p-6 card-hover group text-center"
                        >
                            {/* Icon */}
                            <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${cert.color} p-4 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                <Award className="w-full h-full text-white" />
                            </div>

                            {/* Title */}
                            <h3 className="font-heading text-lg font-semibold text-white mb-2">
                                {cert.title}
                            </h3>

                            {/* Issuer */}
                            <p className="font-body text-accent-blue font-medium text-sm mb-3">
                                {cert.issuer}
                            </p>

                            {/* Description */}
                            <p className="font-body text-gray-400 text-sm">
                                {cert.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
