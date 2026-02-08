import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Briefcase, Calendar, MapPin } from 'lucide-react'

export default function Experience() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-100px' })

    return (
        <section
            id="experience"
            className="section relative bg-secondary/30"
            aria-label="Experience section"
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
                        <span className="gradient-text">Experience</span>
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-accent-blue to-accent-violet mx-auto rounded-full" />
                </motion.div>

                {/* Experience Card */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-3xl mx-auto"
                >
                    <div className="glass rounded-2xl p-8 card-hover relative overflow-hidden">
                        {/* Decorative gradient */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-blue via-accent-violet to-accent-cyan" />

                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-violet/20">
                                    <Briefcase className="w-6 h-6 text-accent-blue" />
                                </div>
                                <div>
                                    <h3 className="font-heading text-xl font-semibold text-white">
                                        Virtual Conferencing Intern
                                    </h3>
                                    <p className="font-body text-accent-violet font-medium">
                                        Collective Heads
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                <div className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    <span>Internship</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MapPin size={14} />
                                    <span>Remote</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-4 font-body text-gray-300">
                            <p>
                                Worked as an intern focusing on virtual conferencing operations and coordination.
                                This experience honed my professional skills in a remote work environment.
                            </p>

                            {/* Key Points */}
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent-blue mt-2 flex-shrink-0" />
                                    <span>
                                        <span className="text-white font-medium">Responsibility:</span> Managed virtual meeting logistics and ensured smooth conference operations
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent-violet mt-2 flex-shrink-0" />
                                    <span>
                                        <span className="text-white font-medium">Coordination:</span> Collaborated with team members across different time zones and departments
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan mt-2 flex-shrink-0" />
                                    <span>
                                        <span className="text-white font-medium">Professionalism:</span> Developed strong communication and organizational skills in a corporate setting
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
