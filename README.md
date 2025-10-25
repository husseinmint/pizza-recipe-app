# 🍕 Pizza Recipe App

A personal pizza recipe management app built with Next.js 16, featuring rich text editing, GitHub backup, and a beautiful modern UI.

## ✨ Features

### 🍕 Recipe Management
- **Add/Edit/Delete recipes** - Complete CRUD operations
- **Recipe categories** - Pizza, Dough, Sauce, Toppings, Other
- **Search recipes** - Find recipes quickly
- **Favorites** - Star your best recipes
- **Print recipes** - Kitchen-friendly format
- **Category icons** - Visual organization with Phosphor icons

### 📝 Rich Notes System
- **Rich text editor** - Full formatting with TipTap
- **Note templates** - Quick start for common notes
- **Note tags** - Organize by type (Technique, Ingredient, etc.)
- **Pin important notes** - Keep key info at top
- **Full-height editor** - Maximum writing space

### 💾 Data Persistence
- **Local storage** - Works offline
- **GitHub backup** - Cloud sync with auto-save
- **Export/Import** - Backup your data
- **Auto-backup status** - Know when data is saved

### 🎨 User Experience
- **Dark mode** - Eye-friendly editing
- **Responsive design** - Works on all devices
- **Modern UI** - Clean, professional interface
- **Fast performance** - Optimized for speed

## 🚀 Tech Stack

- **Next.js 16** - React framework with App Router
- **React 19** - Latest React with TypeScript
- **Tailwind CSS 4.x** - Utility-first styling
- **shadcn/ui** - Beautiful component library
- **TipTap** - Rich text editor
- **Phosphor Icons** - Modern icon set
- **GitHub API** - Cloud data storage

## 🛠️ Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/pizza-recipe-app.git

# Navigate to the project
cd pizza-recipe-app

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🌐 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Sign up with GitHub
4. Click "New Project"
5. Import your repository
6. Deploy automatically!

### Other Options
- **Netlify** - Drag & drop deployment
- **GitHub Pages** - Free static hosting

## 📱 Usage

### Getting Started
1. **Add Recipes** - Click "Add Recipe" to create new recipes
2. **Organize** - Use categories and favorites to organize
3. **Take Notes** - Use the rich text editor for detailed notes
4. **Backup** - Configure GitHub backup for cloud sync

### GitHub Backup Setup
1. Create a GitHub repository
2. Generate a Personal Access Token with `repo` scope
3. Go to Settings → GitHub Configuration
4. Enter your username, repository, and token
5. Test connection and save

## 🎯 Features Overview

### Recipe Management
- Create and edit pizza recipes
- Organize by categories (Pizza, Dough, Sauce, Toppings, Other)
- Search and filter recipes
- Mark favorites for quick access
- Print recipes for kitchen use

### Notes System
- Rich text editing with full formatting
- Pre-built templates for common note types
- Tag system for organization
- Pin important notes
- Full-height editor for comfortable writing

### Data Management
- Local storage for offline use
- GitHub integration for cloud backup
- Export/import functionality
- Auto-save every 10 seconds
- Backup status indicator

## 🔧 Configuration

### Environment Variables
No environment variables required - everything works out of the box!

### GitHub Integration
- Repository: Your GitHub repository name
- Username: Your GitHub username  
- Token: Personal Access Token with `repo` scope

## 📁 Project Structure

```
pizza-recipe-app/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main application page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── rich-text-editor.tsx
│   ├── notes-section.tsx
│   ├── recipe-detail.tsx
│   └── ...
├── hooks/                 # Custom hooks
│   └── use-local-storage.ts
├── lib/                   # Utility libraries
│   └── github-api.ts
└── public/               # Static assets
```

## 🤝 Contributing

This is a personal project, but feel free to fork and modify for your own use!

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- **Next.js** - Amazing React framework
- **TipTap** - Powerful rich text editor
- **shadcn/ui** - Beautiful component library
- **Phosphor Icons** - Modern icon set
- **Tailwind CSS** - Utility-first styling

---

**Enjoy managing your pizza recipes! 🍕✨**
