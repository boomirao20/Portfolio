import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Mail, Github, Linkedin, Send, Check } from 'lucide-react'

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

export default function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [copied, setCopied] = useState(false)

  const handleCopy = async (email) => {
    await navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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

        <div className="max-w-3xl mx-auto">
          {/* CTA Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <p className="font-body text-xl md:text-2xl text-gray-300 mb-4">
              Let’s build something impactful together.
            </p>
            <p className="font-body text-gray-400 max-w-xl mx-auto">
              I’m always open to discussing new projects, creative ideas,
              or opportunities to be part of your vision.
            </p>
          </motion.div>

          {/* Contact Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-6"
          >
            {contactLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.copy ? undefined : link.href}
                target={!link.copy ? '_blank' : undefined}
                rel="noopener noreferrer"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={
                  link.copy
                    ? (e) => {
                        e.preventDefault()
                        handleCopy(link.value)
                      }
                    : undefined
                }
                className={`glass relative rounded-xl p-6 flex items-center gap-4 card-hover group w-full sm:w-auto cursor-pointer ${link.color}`}
                aria-label={`Contact via ${link.name}`}
              >
                <div className="p-3 rounded-lg bg-gradient-to-br from-accent-blue/20 to-accent-violet/20 group-hover:scale-110 transition-transform">
                  <link.icon className="w-6 h-6 text-accent-blue" />
                </div>

                <div className="text-left">
                  <p className="font-heading font-semibold text-white text-sm">
                    {link.name}
                  </p>
                  <p className="font-body text-gray-400 text-xs">
                    {link.value}
                  </p>
                </div>

                {/* Copy feedback */}
                {link.copy && copied && (
                  <span className="absolute -top-3 right-3 flex items-center gap-1 text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded-full">
                    <Check size={12} /> Copied
                  </span>
                )}
              </motion.a>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-12"
          >
            <a
              href="mailto:boomirao0720@gmail.com"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-accent-blue to-accent-violet rounded-full font-heading font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-accent-blue/25 hover:scale-105"
            >
              <Send size={20} />
              Send me a message
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
