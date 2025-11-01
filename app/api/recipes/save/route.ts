import { NextRequest, NextResponse } from 'next/server'

type Category = 'Pizza' | 'Dough' | 'Sauce' | 'Toppings' | 'Other'

interface Recipe {
  id: number
  title: string
  name?: string
  category?: Category
  [key: string]: any
}

function getTargetFileByCategory(category?: Category): string {
  switch (category) {
    case 'Sauce':
      return 'public/sauce.json'
    case 'Pizza':
      return 'public/pizza.json'
    case 'Dough':
      return 'public/dough.json'
    case 'Toppings':
      return 'public/toppings.json'
    default:
      return 'public/recipes.json'
  }
}

// GitHub API functions
async function getGitHubFileContent(filePath: string): Promise<{ content: string; sha?: string } | null> {
  const token = process.env.GITHUB_TOKEN
  const owner = process.env.GITHUB_OWNER || 'husseinmint'
  const repo = process.env.GITHUB_REPO || 'pizza-recipe-app'
  
  if (!token) {
    console.warn('GITHUB_TOKEN not set, skipping GitHub save')
    return null
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
      {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    )

    if (response.status === 404) {
      // File doesn't exist yet, return empty content
      return { content: '', sha: undefined }
    }

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`)
    }

    const data = await response.json()
    const content = Buffer.from(data.content, 'base64').toString('utf-8')
    return { content, sha: data.sha }
  } catch (error: any) {
    console.error('Error fetching from GitHub:', error)
    return null
  }
}

async function saveToGitHub(filePath: string, content: string, sha?: string): Promise<boolean> {
  const token = process.env.GITHUB_TOKEN
  const owner = process.env.GITHUB_OWNER || 'husseinmint'
  const repo = process.env.GITHUB_REPO || 'pizza-recipe-app'
  
  if (!token) {
    console.warn('GITHUB_TOKEN not set, skipping GitHub save')
    return false
  }

  try {
    const base64Content = Buffer.from(content, 'utf-8').toString('base64')
    
    const payload: any = {
      message: `Update ${filePath} - ${new Date().toISOString()}`,
      content: base64Content,
    }

    // If file exists, include SHA for update
    if (sha) {
      payload.sha = sha
    }

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`GitHub API error: ${response.statusText} - ${JSON.stringify(errorData)}`)
    }

    return true
  } catch (error: any) {
    console.error('Error saving to GitHub:', error)
    return false
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { recipe }: { recipe: Recipe } = body
    if (!recipe || typeof recipe.id !== 'number') {
      return NextResponse.json({ error: 'Invalid recipe payload' }, { status: 400 })
    }

    const filePath = getTargetFileByCategory(recipe.category)
    
    // Read current file from GitHub
    const fileData = await getGitHubFileContent(filePath)
    let current = { recipes: [] as Recipe[] }
    let sha: string | undefined

    if (fileData) {
      sha = fileData.sha
      if (fileData.content.trim()) {
        try {
          current = JSON.parse(fileData.content)
        } catch {
          current = { recipes: [] as Recipe[] }
        }
      }
    }

    const list: Recipe[] = Array.isArray(current.recipes) ? current.recipes : []

    // Update or add recipe
    const index = list.findIndex(r => r.id === recipe.id)
    if (index >= 0) {
      list[index] = recipe
    } else {
      list.unshift(recipe)
    }

    const updated = { recipes: list }
    const updatedContent = JSON.stringify(updated, null, 2)

    // Save to GitHub
    const saved = await saveToGitHub(filePath, updatedContent, sha)

    if (saved) {
      return NextResponse.json({ 
        ok: true, 
        file: filePath,
        saved: 'github'
      })
    } else {
      // Fallback: return success even if GitHub save failed (localStorage still works)
      return NextResponse.json({ 
        ok: true, 
        file: filePath,
        saved: 'local-only',
        warning: 'GitHub save failed, data saved locally only'
      })
    }
  } catch (error: any) {
    console.error('Error in POST /api/recipes/save:', error)
    return NextResponse.json({ 
      error: error?.message || 'Unknown error' 
    }, { status: 500 })
  }
}


