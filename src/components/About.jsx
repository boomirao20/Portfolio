import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { GraduationCap, Sparkles } from 'lucide-react'

export default function About() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-100px' })

    return (
        <section
            id="about"
            className="section relative"
            aria-label="About section"
        >
            {/* Background accent */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-accent-blue/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent-violet/5 rounded-full blur-3xl" />

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

                {/* Content Grid */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left - Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-6"
                    >
                        <div className="glass rounded-2xl p-6 card-hover">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-violet/20">
                                    <GraduationCap className="w-6 h-6 text-accent-blue" />
                                </div>
                                <div>
                                    <h3 className="font-heading text-xl font-semibold text-white mb-2">
                                        Education
                                    </h3>
                                    <p className="font-body text-gray-400">
                                        <span className="text-gray-200 font-medium">B.Voc in Artificial Intelligence & Data Science</span>
                                        <br />
                                        2023 – 2027
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="glass rounded-2xl p-6 card-hover">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-accent-violet/20 to-accent-cyan/20">
                                    <Sparkles className="w-6 h-6 text-accent-violet" />
                                </div>
                                <div>
                                    <h3 className="font-heading text-xl font-semibold text-white mb-2">
                                        Interests
                                    </h3>
                                    <p className="font-body text-gray-400">
                                        Passionate about <span className="text-accent-blue">Web Development</span>, <span className="text-accent-violet">Artificial Intelligence</span>, and <span className="text-accent-cyan">Data Analytics</span>.
                                        I love building solutions that bridge the gap between intelligent systems and user-friendly interfaces.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right - Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="relative"
                    >
                        <div className="glass rounded-2xl p-8 relative overflow-hidden">
                            {/* Decorative gradient */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent-blue/10 to-transparent rounded-bl-full" />

                            <p className="font-body text-lg text-gray-300 leading-relaxed relative z-10">
                                I'm a dedicated undergraduate student pursuing a <span className="text-white font-medium">B.Voc in Artificial Intelligence & Data Science</span>.
                                My journey combines technical expertise in web development with a deep interest in machine learning and data-driven solutions.
                            </p>
                            <p className="font-body text-lg text-gray-300 leading-relaxed mt-4 relative z-10">
                                I believe in creating technology that makes a meaningful impact — whether it's through intuitive user experiences,
                                intelligent automation, or insightful data visualization.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
