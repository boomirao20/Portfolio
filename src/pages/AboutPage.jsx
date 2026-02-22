import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Navbar from '../components/Navbar'
import About from '../components/About'
import Chatbot from '../components/Chatbot'

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-primary text-gray-200">
            <Navbar />
            <main className="pt-24">
                <div className="max-w-7xl mx-auto px-4 md:px-8 mb-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 font-body text-sm text-gray-400 hover:text-white transition-colors group"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </Link>
                    </motion.div>
                </div>
                <About />
            </main>
            <footer className="py-8 text-center text-gray-500 border-t border-gray-800">
                <p className="font-body text-sm">
                    © {new Date().getFullYear()} Boomi Rao. Built with React & Three.js
                </p>
            </footer>
            <Chatbot />
        </div>
    )
}
