// Centralized Portfolio Data
// This file is the single source of truth for all portfolio content.
// When you update this file, both the website and AI chatbot will reflect the changes.

export const portfolioData = {
    // Personal Information
    personal: {
        name: 'Boomi Rao',
        title: 'AI & Data Science Student | Web Developer',
        email: 'boomirao0720@gmail.com',
        phone: '9167280514',
        github: 'https://github.com/boomirao20',
        linkedin: 'https://www.linkedin.com/in/boomirao20/',
        location: 'India',
        bio: `I'm a dedicated undergraduate student pursuing a B.Voc in Artificial Intelligence & Data Science. 
My journey combines technical expertise in web development with a deep interest in machine learning and data-driven solutions. 
I believe in creating technology that makes a meaningful impact — whether it's through intuitive user experiences, intelligent automation, or insightful data visualization.`,
    },

    // Education
    education: {
        degree: 'B.Voc in Artificial Intelligence & Data Science',
        duration: '2023 – 2027',
        interests: ['Web Development', 'Artificial Intelligence', 'Data Analytics'],
    },

    // Skills by Category
    skills: {
        frontend: ['HTML', 'CSS', 'JavaScript'],
        backend: ['Python', 'Django', 'Node.js'],
        dataAndAI: ['SQL', 'Power BI', 'Tableau', 'Machine Learning'],
        tools: ['Git', 'GitHub', 'PostgreSQL', 'Excel'],
    },

    // Projects
    projects: [
        {
            title: 'Flower E-commerce Platform',
            description: 'Built a full-stack e-commerce platform for flower sales with AI-powered recommendations and seamless checkout experience.',
            techStack: ['Django', 'OpenAI', 'PostgreSQL'],
            github: 'https://github.com/boomi-rao',
        },
        {
            title: 'Weather Checker Web App',
            description: 'Developed a responsive weather application that provides real-time weather data and forecasts for any location worldwide.',
            techStack: ['JavaScript', 'REST API', 'CSS'],
            github: 'https://github.com/boomi-rao',
        },
        {
            title: 'Cricket Performance Dashboard',
            description: 'Created an interactive analytics dashboard to visualize and analyze cricket player performance metrics and team statistics.',
            techStack: ['Power BI', 'DAX', 'Data Modeling'],
            github: 'https://github.com/boomi-rao',
        },
        {
            title: 'Mobile OS Usage Analysis',
            description: 'Analyzed mobile operating system market trends and user behavior patterns using data visualization techniques.',
            techStack: ['Tableau', 'Data Analysis', 'Visualization'],
            github: 'https://github.com/boomi-rao',
        },
        {
            title: 'Delicacy – Fresh Produce E-commerce',
            description: 'Designed and developed an e-commerce platform for fresh produce delivery with inventory management and order tracking.',
            techStack: ['HTML', 'CSS', 'JavaScript'],
            github: 'https://github.com/boomi-rao',
        },
    ],

    // Experience
    experience: [
        {
            role: 'Virtual Conferencing Intern',
            company: 'Collective Heads',
            type: 'Internship',
            location: 'Remote',
            description: 'Worked as an intern focusing on virtual conferencing operations and coordination. This experience honed my professional skills in a remote work environment.',
            responsibilities: [
                'Managed virtual meeting logistics and ensured smooth conference operations',
                'Collaborated with team members across different time zones and departments',
                'Developed strong communication and organizational skills in a corporate setting',
            ],
        },
    ],

    // Certifications
    certifications: [
        {
            title: 'AI & Web Development',
            issuer: 'NASSCOM',
            description: 'Certified in Artificial Intelligence and Web Development fundamentals.',
        },
        {
            title: 'Deep Learning & LLMs',
            issuer: 'NVIDIA',
            description: 'Completed certification in Deep Learning and Large Language Models.',
        },
        {
            title: 'Microsoft Excel Associate',
            issuer: 'Microsoft',
            description: 'Certified Microsoft Office Specialist in Excel data analysis and visualization.',
        },
    ],
}

// Generate a context string for the AI chatbot
export function generateAIContext() {
    const { personal, education, skills, projects, experience, certifications } = portfolioData

    return `
You are an AI assistant for ${personal.name}'s portfolio website. Answer questions about ${personal.name} based on the following information:

## About ${personal.name}
${personal.bio}

## Education
- ${education.degree} (${education.duration})
- Interests: ${education.interests.join(', ')}

## Skills
- Frontend: ${skills.frontend.join(', ')}
- Backend: ${skills.backend.join(', ')}
- Data & AI: ${skills.dataAndAI.join(', ')}
- Tools: ${skills.tools.join(', ')}

## Projects
${projects.map(p => `- **${p.title}**: ${p.description} (Tech: ${p.techStack.join(', ')})`).join('\n')}

## Experience
${experience.map(e => `- **${e.role}** at ${e.company} (${e.type}, ${e.location}): ${e.description}`).join('\n')}

## Certifications
${certifications.map(c => `- **${c.title}** by ${c.issuer}: ${c.description}`).join('\n')}

## Contact
- Email: ${personal.email}
- Phone: ${personal.phone}
- GitHub: ${personal.github}
- LinkedIn: ${personal.linkedin}
- Location: ${personal.location}

Instructions:
- Be helpful, friendly, and professional
- Answer questions about ${personal.name}'s skills, projects, experience, and education
- If asked something not covered above, politely say you don't have that information
- Keep responses concise but informative
- You can suggest visiting specific sections of the portfolio for more details
`.trim()
}
