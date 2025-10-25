# 🚀 Deployment Guide

This guide will help you deploy your Pizza Recipe App to the internet.

## 🌟 Recommended: Vercel (Easiest)

### Why Vercel?
- ✅ **Free forever** - No cost for personal use
- ✅ **Zero configuration** - Just connect GitHub
- ✅ **Automatic deployments** - Push code = auto deploy
- ✅ **Perfect for Next.js** - Built by the Next.js team
- ✅ **Custom domain** - Add your own domain later
- ✅ **HTTPS included** - Secure by default

### Step-by-Step Vercel Deployment

#### 1. Prepare Your Code
```bash
# Make sure your app builds successfully
npm run build

# If successful, you're ready to deploy!
```

#### 2. Create GitHub Repository
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit - Pizza Recipe App"

# Create repository on GitHub, then:
git remote add origin https://github.com/yourusername/pizza-recipe-app.git
git branch -M main
git push -u origin main
```

#### 3. Deploy to Vercel
1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up with GitHub** (recommended)
3. **Click "New Project"**
4. **Import your repository** from GitHub
5. **Configure project:**
   - Framework: Next.js (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
6. **Click "Deploy"**

#### 4. Your App is Live! 🎉
- **URL:** `https://pizza-recipe-app.vercel.app`
- **Custom domain:** Add later in Vercel dashboard
- **Auto-deploy:** Every push to main branch

## 🔄 Alternative: Netlify

### Netlify Deployment
1. **Build your app:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Drag & drop your `.next` folder
   - Or connect to GitHub for auto-deploy

## 📱 GitHub Pages (Static)

### For Static Export
1. **Update `next.config.js`:**
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'export',
     trailingSlash: true,
     images: {
       unoptimized: true
     }
   }
   
   module.exports = nextConfig
   ```

2. **Build and export:**
   ```bash
   npm run build
   npm run export
   ```

3. **Deploy to GitHub Pages:**
   - Push `out` folder to `gh-pages` branch
   - Enable GitHub Pages in repository settings

## 🔧 Post-Deployment Setup

### 1. Configure GitHub Backup
1. **Create GitHub repository** for data storage
2. **Generate Personal Access Token:**
   - Go to GitHub Settings → Developer settings
   - Personal Access Tokens → Tokens (classic)
   - Generate new token with `repo` scope
3. **Configure in your app:**
   - Go to Settings → GitHub Configuration
   - Enter repository details and token
   - Test connection

### 2. Custom Domain (Optional)
1. **In Vercel dashboard:**
   - Go to your project
   - Settings → Domains
   - Add your custom domain
   - Configure DNS records

## 🎯 Your App Features

Once deployed, your app will have:

### ✅ Core Features
- **Recipe Management** - Add, edit, delete recipes
- **Rich Notes** - Full-featured text editor
- **Search & Filter** - Find recipes quickly
- **Categories** - Organize by type
- **Favorites** - Star important recipes
- **Dark Mode** - Eye-friendly editing
- **Print Recipes** - Kitchen-ready format

### ✅ Data Management
- **Local Storage** - Works offline
- **GitHub Backup** - Cloud sync
- **Export/Import** - Data portability
- **Auto-save** - Never lose your work

## 🚨 Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### GitHub Integration Issues
- Check repository permissions
- Verify token has `repo` scope
- Ensure repository exists and is accessible

### Deployment Issues
- Check build logs in Vercel/Netlify
- Ensure all dependencies are in `package.json`
- Verify no environment variables are missing

## 🎉 Success!

Your Pizza Recipe App is now live on the internet! 

- **Share with friends** - Send them the URL
- **Use anywhere** - Access from any device
- **Never lose data** - GitHub backup keeps it safe
- **Keep it updated** - Push changes for auto-deploy

**Enjoy your personal pizza recipe collection! 🍕✨**