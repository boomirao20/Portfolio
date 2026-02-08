import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Certifications from './components/Certifications'
import Contact from './components/Contact'
import Navbar from './components/Navbar'
import Chatbot from './components/Chatbot'

function App() {
    return (
        <div className="min-h-screen bg-primary text-gray-200">
            {/* Navigation */}
            <Navbar />

            {/* Main Content */}
            <main>
                <Hero />
                <About />
                <Skills />
                <Projects />
                <Experience />
                <Certifications />
                <Contact />
            </main>

            {/* Footer */}
            <footer className="py-8 text-center text-gray-500 border-t border-gray-800">
                <p className="font-body text-sm">
                    © {new Date().getFullYear()} Boomi Rao. Built with React & Three.js
                </p>
            </footer>

            {/* AI Chatbot */}
            <Chatbot />
        </div>
    )
}

export default App
