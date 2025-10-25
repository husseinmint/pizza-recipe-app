// GitHub API integration for storing recipe data
export interface GitHubConfig {
  username: string
  repository: string
  token: string
}

export class GitHubAPI {
  private config: GitHubConfig
  private baseUrl = 'https://api.github.com'

  constructor(config: GitHubConfig) {
    this.config = config
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}/repos/${this.config.username}/${this.config.repository}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.config.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getFile(path: string) {
    try {
      const response = await this.request(`/contents/${path}`)
      const content = atob(response.content.replace(/\n/g, ''))
      return JSON.parse(content)
    } catch (error) {
      console.log(`File ${path} not found, returning empty data`)
      return { recipes: [], generalNotes: [] }
    }
  }

  async saveFile(path: string, data: any, message: string) {
    try {
      // First, get the current file to get the SHA
      const currentFile = await this.request(`/contents/${path}`)
      
      const content = btoa(JSON.stringify(data, null, 2))
      
      return this.request(`/contents/${path}`, {
        method: 'PUT',
        body: JSON.stringify({
          message,
          content,
          sha: currentFile.sha,
        }),
      })
    } catch (error) {
      // File doesn't exist, create it
      const content = btoa(JSON.stringify(data, null, 2))
      
      return this.request(`/contents/${path}`, {
        method: 'PUT',
        body: JSON.stringify({
          message,
          content,
        }),
      })
    }
  }

  async saveRecipes(recipes: any[], notes: any[]) {
    const data = { recipes, generalNotes: notes }
    const message = `Update recipes - ${new Date().toISOString()}`
    return this.saveFile('data/recipes.json', data, message)
  }

  async loadRecipes() {
    return this.getFile('data/recipes.json')
  }
}

// Simple GitHub storage hook
import { useState, useEffect, useCallback } from 'react'

export function useGitHubStorage(config: GitHubConfig | null) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const saveToGitHub = useCallback(async (recipes: any[], notes: any[]) => {
    if (!config || !isHydrated) return

    setIsLoading(true)
    setError(null)

    try {
      const api = new GitHubAPI(config)
      await api.saveRecipes(recipes, notes)
      console.log('Successfully saved to GitHub')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save to GitHub'
      setError(errorMessage)
      console.error('GitHub save error:', errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [config, isHydrated])

  const loadFromGitHub = useCallback(async () => {
    if (!config || !isHydrated) return { recipes: [], generalNotes: [] }

    setIsLoading(true)
    setError(null)

    try {
      const api = new GitHubAPI(config)
      const data = await api.loadRecipes()
      console.log('Successfully loaded from GitHub')
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load from GitHub'
      setError(errorMessage)
      console.error('GitHub load error:', errorMessage)
      return { recipes: [], generalNotes: [] }
    } finally {
      setIsLoading(false)
    }
  }, [config, isHydrated])

  return { saveToGitHub, loadFromGitHub, isLoading, error }
}
