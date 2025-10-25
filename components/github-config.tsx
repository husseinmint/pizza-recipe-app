"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Settings, Github, Check, X } from "lucide-react"

interface GitHubConfig {
  username: string
  repository: string
  token: string
}

interface GitHubConfigProps {
  config: GitHubConfig | null
  onConfigChange: (config: GitHubConfig | null) => void
}

export default function GitHubConfigComponent({ config, onConfigChange }: GitHubConfigProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    username: config?.username || '',
    repository: config?.repository || '',
    token: config?.token || '',
  })
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null)

  const handleSave = () => {
    if (formData.username && formData.repository && formData.token) {
      onConfigChange(formData)
      setIsOpen(false)
    }
  }

  const handleTest = async () => {
    setIsTesting(true)
    setTestResult(null)

    try {
      const response = await fetch(`https://api.github.com/repos/${formData.username}/${formData.repository}`, {
        headers: {
          'Authorization': `Bearer ${formData.token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      })

      if (response.ok) {
        setTestResult('success')
      } else {
        setTestResult('error')
      }
    } catch (error) {
      setTestResult('error')
    } finally {
      setIsTesting(false)
    }
  }

  const handleDisconnect = () => {
    onConfigChange(null)
    setFormData({ username: '', repository: '', token: '' })
  }

  if (!isOpen && !config) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="text-xs"
      >
        <Github size={14} className="mr-1" />
        Connect GitHub
      </Button>
    )
  }

  if (!isOpen && config) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">
          Connected to {config.username}/{config.repository}
        </span>
        <Button
          onClick={() => setIsOpen(true)}
          variant="ghost"
          size="sm"
          className="p-1 h-6 w-6"
        >
          <Settings size={12} />
        </Button>
        <Button
          onClick={handleDisconnect}
          variant="ghost"
          size="sm"
          className="p-1 h-6 w-6 text-destructive"
        >
          <X size={12} />
        </Button>
      </div>
    )
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">GitHub Configuration</h3>
        <Button
          onClick={() => setIsOpen(false)}
          variant="ghost"
          size="sm"
          className="p-1 h-6 w-6"
        >
          <X size={12} />
        </Button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">GitHub Username</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            placeholder="your-username"
            className="w-full px-3 py-2 bg-secondary text-foreground rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Repository Name</label>
          <input
            type="text"
            value={formData.repository}
            onChange={(e) => setFormData({ ...formData, repository: e.target.value })}
            placeholder="pizza-recipes"
            className="w-full px-3 py-2 bg-secondary text-foreground rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Personal Access Token</label>
          <input
            type="password"
            value={formData.token}
            onChange={(e) => setFormData({ ...formData, token: e.target.value })}
            placeholder="ghp_xxxxxxxxxxxx"
            className="w-full px-3 py-2 bg-secondary text-foreground rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Create a token at <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">github.com/settings/tokens</a>
            <br />
            <strong>Required scopes:</strong> <code className="bg-secondary px-1 rounded">repo</code> (full control of private repositories)
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleTest}
          disabled={isTesting || !formData.username || !formData.repository || !formData.token}
          variant="outline"
          size="sm"
          className="flex-1"
        >
          {isTesting ? 'Testing...' : 'Test Connection'}
          {testResult === 'success' && <Check size={14} className="ml-1 text-green-500" />}
          {testResult === 'error' && <X size={14} className="ml-1 text-red-500" />}
        </Button>
        <Button
          onClick={handleSave}
          disabled={!formData.username || !formData.repository || !formData.token}
          size="sm"
          className="flex-1"
        >
          Save
        </Button>
      </div>
    </Card>
  )
}
