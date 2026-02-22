import { Routes, Route } from 'react-router-dom'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import Chatbot from './components/Chatbot'
import AboutPage from './pages/AboutPage'
import SkillsPage from './pages/SkillsPage'
import ProjectsPage from './pages/ProjectsPage'
import ExperiencePage from './pages/ExperiencePage'
import CertificationsPage from './pages/CertificationsPage'
import ContactPage from './pages/ContactPage'

function HomePage() {
    return (
        <div className="min-h-screen bg-primary text-gray-200">
            <Navbar />
            <main>
                <Hero />
            </main>
            <Chatbot />
        </div>
    )
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/experience" element={<ExperiencePage />} />
            <Route path="/certifications" element={<CertificationsPage />} />
            <Route path="/contact" element={<ContactPage />} />
        </Routes>
    )
}

export default App

