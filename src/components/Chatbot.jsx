import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react'
import { generateAIContext, portfolioData } from '../data/portfolioData'

// Quick question presets
const quickQuestions = [
    "What are your skills?",
    "Tell me about your projects",
    "What's your experience?",
    "How can I contact you?",
]

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: `Hi! I'm ${portfolioData.personal.name}'s AI assistant. Ask me anything about skills, projects, experience, or how to get in touch!`,
        },
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus()
        }
    }, [isOpen])

    // Send message to AI
    const sendMessage = async (messageText) => {
        if (!messageText.trim() || isLoading) return

        const userMessage = { role: 'user', content: messageText.trim() }
        setMessages((prev) => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        try {
            // Get AI context from portfolio data
            const context = generateAIContext()

            // Call Gemini API
            // IMPORTANT: Replace 'YOUR_API_KEY' with your actual Gemini API key
            // Get your free API key at: https://aistudio.google.com/apikey
            const API_KEY = 'YOUR_API_KEY'

            if (API_KEY === 'YOUR_API_KEY') {
                // Demo mode - provide helpful responses without API
                const demoResponse = generateDemoResponse(messageText)
                setMessages((prev) => [...prev, { role: 'assistant', content: demoResponse }])
                setIsLoading(false)
                return
            }

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [
                                    {
                                        text: `${context}\n\nUser question: ${messageText}\n\nProvide a helpful, concise response:`,
                                    },
                                ],
                            },
                        ],
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 500,
                        },
                    }),
                }
            )

            const data = await response.json()

            if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
                const aiResponse = data.candidates[0].content.parts[0].text
                setMessages((prev) => [...prev, { role: 'assistant', content: aiResponse }])
            } else {
                throw new Error('Invalid response')
            }
        } catch (error) {
            console.error('Chat error:', error)
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: "I'm having trouble connecting right now. Please try again or use the contact form to reach out directly!",
                },
            ])
        } finally {
            setIsLoading(false)
        }
    }

    // Demo response generator (works without API key)
    const generateDemoResponse = (question) => {
        const q = question.toLowerCase()
        const { personal, skills, projects, experience, certifications, education } = portfolioData

        if (q.includes('skill') || q.includes('know') || q.includes('tech')) {
            return `${personal.name} is skilled in:\n\n**Frontend:** ${skills.frontend.join(', ')}\n**Backend:** ${skills.backend.join(', ')}\n**Data & AI:** ${skills.dataAndAI.join(', ')}\n**Tools:** ${skills.tools.join(', ')}\n\nWould you like to know more about any specific skill?`
        }

        if (q.includes('project') || q.includes('work') || q.includes('built') || q.includes('made')) {
            const projectList = projects.slice(0, 3).map(p => `• **${p.title}**: ${p.description.slice(0, 80)}...`).join('\n')
            return `Here are some of ${personal.name}'s projects:\n\n${projectList}\n\nCheck out the Projects section for more details!`
        }

        if (q.includes('experience') || q.includes('job') || q.includes('intern')) {
            const exp = experience[0]
            return `${personal.name} worked as a **${exp.role}** at **${exp.company}** (${exp.type}, ${exp.location}).\n\n${exp.description}\n\nKey responsibilities included managing virtual meetings and collaborating across teams.`
        }

        if (q.includes('contact') || q.includes('email') || q.includes('reach') || q.includes('hire')) {
            return `You can reach ${personal.name} through:\n\n📧 **Email:** ${personal.email}\n🔗 **LinkedIn:** linkedin.com/in/boomirao20\n💻 **GitHub:** github.com/boomirao20\n\nFeel free to use the contact form below or scroll to the Contact section!`
        }

        if (q.includes('education') || q.includes('study') || q.includes('degree') || q.includes('college')) {
            return `${personal.name} is pursuing a **${education.degree}** (${education.duration}).\n\nMain interests include ${education.interests.join(', ')}.`
        }

        if (q.includes('certif') || q.includes('badge') || q.includes('credential')) {
            const certList = certifications.map(c => `• **${c.title}** by ${c.issuer}`).join('\n')
            return `${personal.name} holds these certifications:\n\n${certList}\n\nThese demonstrate expertise in AI, data analysis, and professional tools.`
        }

        if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
            return `Hello! 👋 I'm here to help you learn about ${personal.name}. You can ask me about:\n\n• Skills & technologies\n• Projects & work\n• Experience & education\n• How to get in touch\n\nWhat would you like to know?`
        }

        // Default response
        return `I'd be happy to help! You can ask me about:\n\n• **Skills** - Technologies ${personal.name} works with\n• **Projects** - Work and portfolio pieces\n• **Experience** - Professional background\n• **Contact** - How to reach out\n\nWhat would you like to know?`
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        sendMessage(input)
    }

    const handleQuickQuestion = (question) => {
        sendMessage(question)
    }

    return (
        <>
            {/* Chat Toggle Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-accent-blue to-accent-violet text-white shadow-lg shadow-accent-blue/25 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={isOpen ? 'Close chat' : 'Open chat'}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                        >
                            <X size={24} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="open"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                        >
                            <MessageCircle size={24} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-8rem)] glass rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-white/10"
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-accent-blue/20 to-accent-violet/20 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-accent-blue to-accent-violet flex items-center justify-center">
                                    <Sparkles size={20} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-heading font-semibold text-white">AI Assistant</h3>
                                    <p className="text-xs text-gray-400">Ask me about {portfolioData.personal.name}</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((message, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    {/* Avatar */}
                                    <div
                                        className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${message.role === 'user'
                                                ? 'bg-accent-violet/20'
                                                : 'bg-gradient-to-r from-accent-blue/20 to-accent-violet/20'
                                            }`}
                                    >
                                        {message.role === 'user' ? (
                                            <User size={16} className="text-accent-violet" />
                                        ) : (
                                            <Bot size={16} className="text-accent-blue" />
                                        )}
                                    </div>

                                    {/* Message Bubble */}
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl font-body text-sm whitespace-pre-wrap ${message.role === 'user'
                                                ? 'bg-accent-violet/20 text-white rounded-tr-none'
                                                : 'bg-white/5 text-gray-200 rounded-tl-none'
                                            }`}
                                    >
                                        {message.content}
                                    </div>
                                </motion.div>
                            ))}

                            {/* Loading Indicator */}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex gap-3"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent-blue/20 to-accent-violet/20 flex items-center justify-center">
                                        <Bot size={16} className="text-accent-blue" />
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                                        <Loader2 size={16} className="text-accent-blue animate-spin" />
                                        <span className="text-gray-400 text-sm">Thinking...</span>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Questions */}
                        {messages.length <= 2 && (
                            <div className="px-4 pb-2">
                                <div className="flex flex-wrap gap-2">
                                    {quickQuestions.map((question) => (
                                        <button
                                            key={question}
                                            onClick={() => handleQuickQuestion(question)}
                                            className="px-3 py-1.5 text-xs font-body rounded-full bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                                        >
                                            {question}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Input */}
                        <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
                            <div className="flex gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask me anything..."
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl font-body text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue/50 disabled:opacity-50"
                                />
                                <motion.button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-10 h-10 rounded-xl bg-gradient-to-r from-accent-blue to-accent-violet text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send size={18} />
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
