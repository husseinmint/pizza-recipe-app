# Deploy Your Pizza Recipe App to GitHub Pages

## Step 1: Prepare Your Repository

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Add pizza recipe app with GitHub storage"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click "Settings" tab
   - Scroll down to "Pages" section
   - Source: "Deploy from a branch"
   - Branch: "main" / "root"
   - Click "Save"

## Step 2: Configure GitHub Storage

1. **Create a Personal Access Token:**
   - Go to [GitHub Settings > Tokens](https://github.com/settings/tokens)
   - Click "Generate new token" > "Generate new token (classic)"
   - Give it a name like "Pizza Recipe App"
   - Select scopes: `repo` (full control of private repositories)
   - Click "Generate token"
   - **Copy the token** (you won't see it again!)

2. **Configure in the App:**
   - Open your deployed app
   - Click "Connect GitHub" in the sidebar
   - Enter your GitHub username
   - Enter repository name (e.g., "pizza-recipes")
   - Paste your personal access token
   - Click "Test Connection" then "Save"

## Step 3: Your Data Storage

Your recipes will be stored in your GitHub repository at:
```
data/recipes.json
```

This file contains:
```json
{
  "recipes": [...],
  "generalNotes": [...]
}
```

## Benefits of This Setup

✅ **Free Hosting** - GitHub Pages is completely free
✅ **Free Storage** - Your GitHub repository stores your data
✅ **Version Control** - Every change is tracked in Git
✅ **Automatic Backup** - GitHub keeps your data safe
✅ **Access Anywhere** - Use your app from any device
✅ **Private Data** - Only you can access your recipes

## Alternative: Simple Static Hosting

If you prefer not to use GitHub API, you can:

1. **Use only localStorage** (data stays on your device)
2. **Manual export/import** for backup
3. **Deploy to Vercel/Netlify** for easier setup

## Troubleshooting

**GitHub Pages not working?**
- Check if your repository is public
- Make sure you're using the correct branch
- Wait a few minutes for deployment

**GitHub API not working?**
- Check your personal access token
- Make sure the repository exists
- Check if the token has the right permissions

**Data not syncing?**
- Check your internet connection
- Verify your GitHub configuration
- Look for error messages in the app

