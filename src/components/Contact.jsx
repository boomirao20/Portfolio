import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import { Mail, Github, Linkedin, Send, Check, User, MessageSquare, Loader2, AlertCircle, Sparkles, Phone, FileText } from 'lucide-react'

const contactLinks = [
  {
    name: 'Email',
    value: 'boomirao0720@gmail.com',
    href: 'mailto:boomirao0720@gmail.com',
    icon: Mail,
    color: 'hover:text-red-400',
    copy: true,
  },
  {
    name: 'GitHub',
    value: 'github.com/boomirao20',
    href: 'https://github.com/boomirao20',
    icon: Github,
    color: 'hover:text-gray-100',
  },
  {
    name: 'LinkedIn',
    value: 'linkedin.com/in/boomirao20',
    href: 'https://www.linkedin.com/in/boomirao20/',
    icon: Linkedin,
    color: 'hover:text-blue-400',
  },
]

// Floating Label Input Component
function FloatingInput({ id, label, type = 'text', icon: Icon, value, onChange, error, required }) {
  const [focused, setFocused] = useState(false)
  const isActive = focused || value

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors duration-300 group-focus-within:text-accent-blue">
          <Icon size={18} className={focused ? 'text-accent-blue' : 'text-gray-500'} />
        </div>
        <input
          type={type}
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          className={`w-full pl-12 pr-4 pt-6 pb-2 bg-white/5 border rounded-xl font-body text-white placeholder-transparent transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 ${error ? 'border-red-500/50' : focused ? 'border-accent-blue/50' : 'border-white/10'
            }`}
          placeholder={label}
        />
        <label
          htmlFor={id}
          className={`absolute left-12 transition-all duration-300 pointer-events-none font-body ${isActive
            ? 'top-2 text-xs text-accent-blue'
            : 'top-1/2 -translate-y-1/2 text-gray-400'
            }`}
        >
          {label} {required && <span className="text-accent-violet">*</span>}
        </label>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-red-400 text-xs mt-1 flex items-center gap-1"
          >
            <AlertCircle size={12} /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

// Floating Label Textarea Component
function FloatingTextarea({ id, label, icon: Icon, value, onChange, error, required }) {
  const [focused, setFocused] = useState(false)
  const isActive = focused || value

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute left-4 top-4 text-gray-500 transition-colors duration-300">
          <Icon size={18} className={focused ? 'text-accent-blue' : 'text-gray-500'} />
        </div>
        <textarea
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          rows={5}
          className={`w-full pl-12 pr-4 pt-6 pb-2 bg-white/5 border rounded-xl font-body text-white placeholder-transparent transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 resize-none ${error ? 'border-red-500/50' : focused ? 'border-accent-blue/50' : 'border-white/10'
            }`}
          placeholder={label}
        />
        <label
          htmlFor={id}
          className={`absolute left-12 transition-all duration-300 pointer-events-none font-body ${isActive
            ? 'top-2 text-xs text-accent-blue'
            : 'top-4 text-gray-400'
            }`}
        >
          {label} {required && <span className="text-accent-violet">*</span>}
        </label>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-red-400 text-xs mt-1 flex items-center gap-1"
          >
            <AlertCircle size={12} /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [copied, setCopied] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle, submitting, success, error
  const [touched, setTouched] = useState({})

  const handleCopy = async (email) => {
    await navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Validation
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required'
        if (value.trim().length < 2) return 'Name must be at least 2 characters'
        return ''
      case 'email':
        if (!value.trim()) return 'Email is required'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email'
        return ''
      case 'phone':
        // Phone is optional, but if provided, validate format
        if (value.trim() && !/^[+]?[\d\s()-]{7,20}$/.test(value.trim())) {
          return 'Please enter a valid phone number'
        }
        return ''
      case 'subject':
        if (!value.trim()) return 'Subject is required'
        if (value.trim().length < 3) return 'Subject must be at least 3 characters'
        return ''
      case 'message':
        if (!value.trim()) return 'Message is required'
        if (value.trim().length < 10) return 'Message must be at least 10 characters'
        return ''
      default:
        return ''
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (touched[name]) {
      const error = validateField(name, value)
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const validateForm = () => {
    const newErrors = {}
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key])
      if (error) newErrors[key] = error
    })
    setErrors(newErrors)
    setTouched({ name: true, email: true, message: true })
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setStatus('submitting')

    // DEMO_MODE: Set to true for testing without a real Formspree endpoint
    const DEMO_MODE = false
    // Your Formspree form ID
    const FORMSPREE_ID = 'mwvnkjbk'

    if (DEMO_MODE) {
      // Simulate API call for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1500))
      setStatus('success')
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      setTouched({})
      setTimeout(() => setStatus('idle'), 5000)
      return
    }

    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
        setTouched({})
        setTimeout(() => setStatus('idle'), 5000)
      } else {
        throw new Error('Failed to send')
      }
    } catch (error) {
      // Fallback: Open mailto link
      const mailtoLink = `mailto:boomirao0720@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone || 'Not provided'}\n\nMessage:\n${formData.message}`
      )}`
      window.open(mailtoLink, '_blank')
      setStatus('success')
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      setTouched({})
      setTimeout(() => setStatus('idle'), 5000)
    }
  }

  return (
    <section
      id="contact"
      className="section relative bg-secondary/30"
      aria-label="Contact section"
    >
      {/* Background accents */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent-violet/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl" />
      </div>

      <div ref={ref} className="relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Get In Touch</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-accent-blue to-accent-violet mx-auto rounded-full" />
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* CTA Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <p className="font-body text-xl md:text-2xl text-gray-300 mb-4">
              Let's build something impactful together.
            </p>
            <p className="font-body text-gray-400 max-w-xl mx-auto">
              I'm always open to discussing new projects, creative ideas,
              or opportunities to be part of your vision.
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <FloatingInput
                  id="name"
                  label="Your Name"
                  icon={User}
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && errors.name}
                  required
                />

                <FloatingInput
                  id="email"
                  label="Email Address"
                  type="email"
                  icon={Mail}
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && errors.email}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FloatingInput
                    id="phone"
                    label="Phone (optional)"
                    type="tel"
                    icon={Phone}
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.phone && errors.phone}
                  />

                  <FloatingInput
                    id="subject"
                    label="Subject"
                    icon={FileText}
                    value={formData.subject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.subject && errors.subject}
                    required
                  />
                </div>

                <FloatingTextarea
                  id="message"
                  label="Your Message"
                  icon={MessageSquare}
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.message && errors.message}
                  required
                />

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={status === 'submitting'}
                  whileHover={{ scale: status === 'submitting' ? 1 : 1.02 }}
                  whileTap={{ scale: status === 'submitting' ? 1 : 0.98 }}
                  className={`w-full py-4 px-6 rounded-xl font-heading font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${status === 'success'
                    ? 'bg-green-500'
                    : status === 'error'
                      ? 'bg-red-500'
                      : 'bg-gradient-to-r from-accent-blue to-accent-violet hover:shadow-lg hover:shadow-accent-blue/25'
                    }`}
                >
                  <AnimatePresence mode="wait">
                    {status === 'idle' && (
                      <motion.span
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Send size={18} />
                        Send Message
                      </motion.span>
                    )}
                    {status === 'submitting' && (
                      <motion.span
                        key="submitting"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Loader2 size={18} className="animate-spin" />
                        Sending...
                      </motion.span>
                    )}
                    {status === 'success' && (
                      <motion.span
                        key="success"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Sparkles size={18} />
                        Message Sent!
                      </motion.span>
                    )}
                    {status === 'error' && (
                      <motion.span
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <AlertCircle size={18} />
                        Failed to send. Try again.
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Links Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-4"
            >
              <h3 className="font-heading text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-gradient-to-r from-accent-blue to-accent-violet rounded-full" />
                Or reach out directly
              </h3>

              {contactLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.copy ? undefined : link.href}
                  target={!link.copy ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  whileHover={{ x: 8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={
                    link.copy
                      ? (e) => {
                        e.preventDefault()
                        handleCopy(link.value)
                      }
                      : undefined
                  }
                  className={`glass relative rounded-xl p-5 flex items-center gap-4 card-hover group cursor-pointer ${link.color} block`}
                  aria-label={`Contact via ${link.name}`}
                >
                  <div className="p-3 rounded-lg bg-gradient-to-br from-accent-blue/20 to-accent-violet/20 group-hover:scale-110 transition-transform">
                    <link.icon className="w-5 h-5 text-accent-blue" />
                  </div>

                  <div className="text-left flex-1">
                    <p className="font-heading font-semibold text-white text-sm">
                      {link.name}
                    </p>
                    <p className="font-body text-gray-400 text-xs">
                      {link.value}
                    </p>
                  </div>

                  {/* Copy indicator for email */}
                  {link.copy && (
                    <span className="text-xs text-gray-500 group-hover:text-accent-blue transition-colors">
                      {copied ? 'Copied!' : 'Click to copy'}
                    </span>
                  )}

                  {/* Copy feedback */}
                  <AnimatePresence>
                    {link.copy && copied && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -10 }}
                        className="absolute -top-3 right-3 flex items-center gap-1 text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30"
                      >
                        <Check size={12} /> Copied!
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.a>
              ))}

              {/* Quick tip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-8 p-4 rounded-xl bg-gradient-to-br from-accent-blue/5 to-accent-violet/5 border border-white/5"
              >
                <p className="font-body text-sm text-gray-400">
                  💡 <span className="text-gray-300">Tip:</span> I typically respond within 24 hours. For urgent matters, feel free to reach out on LinkedIn!
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
