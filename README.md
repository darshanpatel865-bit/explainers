# Interactive Explainers

A collection of interactive explainers for complex concepts, inspired by Paras Chopra.

Built with React, Vite, and Tailwind CSS. Deployed on GitHub Pages.

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173/explainers/
```

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## 📦 Deploy to GitHub Pages

### Option 1: GitHub Actions (Recommended)

1. Push this code to a GitHub repository
2. Go to **Settings → Pages → Source** → Select "GitHub Actions"
3. The site will automatically deploy on every push to `main`

### Option 2: Manual Deploy

```bash
# Build and deploy
npm run build

# Push the dist folder to gh-pages branch
npx gh-pages -d dist
```

Then go to **Settings → Pages → Source** → Select "Deploy from a branch" → `gh-pages`

## 📁 Project Structure

```
explainers-site/
├── src/
│   ├── pages/
│   │   ├── LandingPage.jsx      # Home page with all explainers
│   │   └── CompoundInterest.jsx # Compound interest explainer
│   ├── components/              # Shared components
│   ├── App.jsx                  # Router setup
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles + Tailwind
├── public/                      # Static assets
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## ➕ Adding New Explainers

1. **Create the page component** in `src/pages/YourTopic.jsx`

2. **Add the route** in `src/App.jsx`:
```jsx
import YourTopic from './pages/YourTopic'

// In Routes:
<Route path="/your-topic" element={<YourTopic />} />
```

3. **Add to landing page** in `src/pages/LandingPage.jsx`:
```jsx
{
  id: 'your-topic',
  path: '/your-topic',
  title: 'Your Title',
  subtitle: 'Your Subtitle',
  description: 'Description...',
  tags: ['Tag1', 'Tag2'],
  status: 'published', // or 'coming-soon'
  readTime: '15 min',
  highlights: ['Point 1', 'Point 2', 'Point 3']
}
```

## 🎨 Customization

### Change the base URL
Edit `vite.config.js` and update the `base` property to match your repo name:
```js
base: '/your-repo-name/',
```

### Add custom fonts
Edit `index.html` to add Google Fonts or other font imports.

## 🛠️ Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Recharts** - Charts and visualizations
- **React Router** - Client-side routing

## 📝 License

MIT
