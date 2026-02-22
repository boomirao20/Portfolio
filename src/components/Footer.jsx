import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, ArrowUp, Heart } from 'lucide-react'

const socialLinks = [
    { name: 'GitHub', href: 'https://github.com/boomirao20', icon: Github },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/boomirao20/', icon: Linkedin },
    { name: 'Email', href: 'mailto:boomirao0720@gmail.com', icon: Mail },
]

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <footer className="relative border-t border-white/5">
            {/* Gradient line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-blue/50 to-transparent" />

            <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Brand */}
                    <div className="text-center md:text-left">
                        <span className="font-heading font-bold text-xl gradient-text">
                            Boomi Rao
                        </span>
                        <p className="font-body text-sm text-gray-500 mt-1">
                            AI & Data Science Student | Web Developer
                        </p>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center gap-4">
                        {socialLinks.map((link) => (
                            <motion.a
                                key={link.name}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.15, y: -3 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-3 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:border-accent-blue/30 hover:bg-white/10 transition-all duration-300"
                                aria-label={link.name}
                            >
                                <link.icon size={18} />
                            </motion.a>
                        ))}
                    </div>

                    {/* Back to top */}
                    <motion.button
                        onClick={scrollToTop}
                        whileHover={{ scale: 1.1, y: -3 }}
                        whileTap={{ scale: 0.9 }}
                        className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-accent-blue/10 to-accent-violet/10 border border-white/10 text-gray-300 hover:text-white hover:border-accent-blue/30 font-body text-sm transition-all duration-300"
                    >
                        <ArrowUp size={16} />
                        Back to Top
                    </motion.button>
                </div>

                {/* Bottom */}
                <div className="mt-10 pt-6 border-t border-white/5 text-center">
                    <p className="font-body text-sm text-gray-500 flex items-center justify-center gap-1">
                        © {new Date().getFullYear()} Boomi Rao. Made with
                        <Heart size={14} className="text-accent-violet inline" fill="currentColor" />
                        and lots of ☕
                    </p>
                </div>
            </div>
        </footer>
    )
}
