# Boomi Rao - Portfolio Website

A production-ready, single-page portfolio website built with React, Tailwind CSS, and Three.js.

## 🚀 Tech Stack

- **React** - UI Framework
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Three.js / React Three Fiber** - 3D Graphics
- **Framer Motion** - Animations
- **Lucide React** - Icons

## 📁 Project Structure

```
Portfolio/
├── public/
│   └── resume.pdf          # Add your resume here
├── src/
│   ├── components/
│   │   ├── About.jsx
│   │   ├── CanvasContainer.jsx
│   │   ├── Certifications.jsx
│   │   ├── Contact.jsx
│   │   ├── Experience.jsx
│   │   ├── Hero.jsx
│   │   ├── Navbar.jsx
│   │   ├── Projects.jsx
│   │   ├── Scene.jsx       # 3D WebGL Scene
│   │   └── Skills.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "New Project" and import your GitHub repository
4. Vercel auto-detects Vite - just click "Deploy"
5. Your site is live!

**Or via CLI:**
```bash
npm install -g vercel
vercel
```

### Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com) and sign in
3. Click "Add new site" > "Import an existing project"
4. Connect your GitHub repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy site"

**Or via CLI:**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

## 📝 Customization

### Update Personal Info

1. **Contact Details**: Edit `src/components/Contact.jsx`
2. **Projects**: Edit `src/components/Projects.jsx`
3. **Experience**: Edit `src/components/Experience.jsx`
4. **Certifications**: Edit `src/components/Certifications.jsx`

### Add Resume

Place your resume PDF at `public/resume.pdf`

### Update GitHub Links

Search for `github.com/boomi-rao` and replace with your actual GitHub username.

## ✨ Features

- 🌙 Dark theme with electric blue & violet accents
- 🎮 WebGL 3D scene with mouse interaction (desktop only)
- 📱 Fully responsive design
- ♿ Accessibility support (keyboard nav, reduced motion)
- 🔍 SEO-friendly with meta tags
- ⚡ Fast performance with lazy loading

## 📄 License

MIT License - feel free to use this template!
