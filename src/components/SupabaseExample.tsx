import { useState, useEffect } from 'react'
import { useSupabase } from '@/hooks/use-supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

const SupabaseExample = () => {
  const { 
    loading, 
    error, 
    getCommunities, 
    createCommunity, 
    getSubmissions, 
    createSubmission 
  } = useSupabase()
  
  const [communities, setCommunities] = useState<any[]>([])
  const [submissions, setSubmissions] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    platform: '',
    category: '',
    member_count: 0,
    contact_info: ''
  })

  // Load communities on component mount
  useEffect(() => {
    loadCommunities()
    loadSubmissions()
  }, [])

  const loadCommunities = async () => {
    const data = await getCommunities()
    if (data) {
      setCommunities(data)
    }
  }

  const loadSubmissions = async () => {
    const data = await getSubmissions()
    if (data) {
      setSubmissions(data)
    }
  }

  const handleCreateCommunity = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const newCommunity = {
      name: formData.name,
      description: formData.description,
      platform: formData.platform,
      category: formData.category,
      member_count: formData.member_count,
      contact_info: formData.contact_info,
      is_verified: false
    }

    const result = await createCommunity(newCommunity)
    if (result) {
      toast.success('Community created successfully!')
      setFormData({
        name: '',
        description: '',
        platform: '',
        category: '',
        member_count: 0,
        contact_info: ''
      })
      loadCommunities()
    } else {
      toast.error('Failed to create community')
    }
  }

  const handleCreateSubmission = async () => {
    const newSubmission = {
      community_name: formData.name,
      description: formData.description,
      platform: formData.platform,
      category: formData.category,
      member_count: formData.member_count,
      contact_email: formData.contact_info,
      status: 'pending' as const
    }

    const result = await createSubmission(newSubmission)
    if (result) {
      toast.success('Submission created successfully!')
      loadSubmissions()
    } else {
      toast.error('Failed to create submission')
    }
  }

  if (error) {
    return (
      <div className="p-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">Error: {error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">Supabase Integration Example</h1>
      
      {/* Create Community Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Community</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateCommunity} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Community Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="platform">Platform</Label>
                <Select value={formData.platform} onValueChange={(value) => setFormData({ ...formData, platform: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                    <SelectItem value="Telegram">Telegram</SelectItem>
                    <SelectItem value="Discord">Discord</SelectItem>
                    <SelectItem value="Slack">Slack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="member_count">Member Count</Label>
                <Input
                  id="member_count"
                  type="number"
                  value={formData.member_count}
                  onChange={(e) => setFormData({ ...formData, member_count: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="contact_info">Contact Info</Label>
              <Input
                id="contact_info"
                value={formData.contact_info}
                onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
                placeholder="Email or phone number"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Community'}
              </Button>
              <Button type="button" variant="outline" onClick={handleCreateSubmission} disabled={loading}>
                {loading ? 'Creating...' : 'Create Submission'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Communities List */}
      <Card>
        <CardHeader>
          <CardTitle>Communities ({communities.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {communities.length === 0 ? (
            <p className="text-muted-foreground">No communities found</p>
          ) : (
            <div className="space-y-2">
              {communities.map((community) => (
                <div key={community.id} className="p-3 border rounded-lg">
                  <h3 className="font-semibold">{community.name}</h3>
                  <p className="text-sm text-muted-foreground">{community.description}</p>
                  <div className="flex gap-2 mt-2 text-xs">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{community.platform}</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">{community.category}</span>
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">{community.member_count} members</span>
                    {community.is_verified && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Verified</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submissions List */}
      <Card>
        <CardHeader>
          <CardTitle>Submissions ({submissions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <p className="text-muted-foreground">No submissions found</p>
          ) : (
            <div className="space-y-2">
              {submissions.map((submission) => (
                <div key={submission.id} className="p-3 border rounded-lg">
                  <h3 className="font-semibold">{submission.community_name}</h3>
                  <p className="text-sm text-muted-foreground">{submission.description}</p>
                  <div className="flex gap-2 mt-2 text-xs">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{submission.platform}</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">{submission.category}</span>
                    <span className={`px-2 py-1 rounded ${
                      submission.status === 'approved' ? 'bg-green-100 text-green-800' :
                      submission.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {submission.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default SupabaseExample 