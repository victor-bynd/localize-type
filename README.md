# Localize Type

A beautiful web application for testing and previewing fonts across different languages and writing systems. Upload custom fonts and see how they render in various languages with real-time preview and customization options.

## Features

- 🎨 **Custom font upload and preview**
- 🌍 **Multi-language support** with diverse writing systems (11 languages)
  - Latin (English, Lithuanian, Vietnamese)
  - Greek, Cyrillic (Russian), Arabic (RTL)
  - Indic scripts (Bengali, Kannada, Telugu)
  - CJK (Chinese Simplified, Japanese)
- ⚙️ **Real-time text customization**
  - Font size scaling (active and fallback fonts)
  - Line height control (global and per-language)
  - **Language-specific fallback font scaling** (50-200%)
  - Text case transformation
  - Letter spacing and word spacing
- 📊 **Header size presets** (H1-H6) with custom scaling
- 📝 **Custom text editing** per language
- 📱 **Responsive design** with multi-column grid layout
- 🎯 **Interactive language cards** with:
  - Missing glyph detection and highlighting
  - Support percentage calculation
  - Per-language line height overrides
  - Per-language fallback font scale overrides
  - Responsive slider controls

## Live Demo

🚀 **[View Live Demo](https://your-app-url.ondigitalocean.app)** _(Update after deployment)_

## Development

This project uses Vite + React + TailwindCSS.

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

Visit `http://localhost:5173` to view the app.

### Production Build

\`\`\`bash
# Build for production
npm run build

# Preview production build locally
npm run preview
\`\`\`

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to DigitalOcean.

**Quick Deploy to DigitalOcean App Platform:**
1. Push your code to GitHub
2. Update `.do/app.yaml` with your repository details
3. Create a new app in DigitalOcean App Platform
4. Connect your repository and deploy!

## Tech Stack

- **Frontend:** React 19
- **Build Tool:** Vite 7
- **Styling:** TailwindCSS 4
- **Font Parsing:** OpenType.js
- **Deployment:** DigitalOcean App Platform

## Recent Updates

- ✨ Added language-specific fallback font scaling (50-200%)
- 🌏 Added Kannada and Telugu language support
- 🎚️ Responsive slider controls with automatic stacking
- 📏 Improved line height controls (default: 1.0)

## License

MIT

