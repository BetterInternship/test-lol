"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  X, 
  Edit2, 
  Save, 
  Upload, 
  Home, 
  Monitor, 
  HardHat, 
  GraduationCap, 
  Palette, 
  Stethoscope, 
  Scale, 
  ChefHat, 
  Building2,
  User,
  Mail,
  Phone,
  GraduationCap as Program,
  Github,
  ExternalLink,
  FileText,
  Camera,
  Trash2,
  Download
} from "lucide-react"
import ProfileButton from "@/components/student/profile-button"
import { useProfile } from "@/hooks/useApi"
import { useRouter } from "next/navigation"
import { file_service } from "@/lib/api"
import { useAuthContext } from "../authctx"

export default function ProfilePage() {
  const { isAuthenticated } = useAuthContext()
  const { profile, error, updateProfile } = useProfile()
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState<any>({})
  const [saving, setSaving] = useState(false)
  const [filesInfo, setFilesInfo] = useState<any>(null)
  const [uploading, setUploading] = useState({ resume: false, profilePicture: false })
  const router = useRouter()
  
  // File input refs
  const resumeInputRef = useRef<HTMLInputElement>(null)
  const profilePictureInputRef = useRef<HTMLInputElement>(null)

  // Fetch files info
  useEffect(() => {
    const fetchFilesInfo = async () => {
      if (isAuthenticated) {
        try {
          const info = await file_service.getFilesInfo()
          setFilesInfo(info)
        } catch (error) {
          console.error('Failed to fetch files info:', error)
        }
      }
    }
    
    fetchFilesInfo()
  }, [isAuthenticated])

  // File upload handlers
  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF or Word document')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    try {
      setUploading(prev => ({ ...prev, resume: true }))
      const result = await file_service.upload_resume(file)
      
      // Update files info
      setFilesInfo((prev: any) => ({
        ...prev,
        resume: {
          filename: result.file.filename,
          url: result.file.url
        }
      }))
      
      alert('Resume uploaded successfully!')
    } catch (error: any) {
      alert(error.message || 'Failed to upload resume')
    } finally {
      setUploading(prev => ({ ...prev, resume: false }))
      // Clear the input
      if (resumeInputRef.current) {
        resumeInputRef.current.value = ''
      }
    }
  }

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a JPEG, PNG, GIF, or WebP image')
      return
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size must be less than 2MB')
      return
    }

    try {
      setUploading(prev => ({ ...prev, profilePicture: true }))
      const result = await file_service.upload_profile_picture(file)
      
      // Update files info
      setFilesInfo((prev: any) => ({
        ...prev,
        profilePicture: {
          url: result.file.url
        }
      }))
      
      alert('Profile picture uploaded successfully!')
    } catch (error: any) {
      alert(error.message || 'Failed to upload profile picture')
    } finally {
      setUploading(prev => ({ ...prev, profilePicture: false }))
      // Clear the input
      if (profilePictureInputRef.current) {
        profilePictureInputRef.current.value = ''
      }
    }
  }

  const handleDeleteResume = async () => {
    if (!confirm('Are you sure you want to delete your resume?')) return

    try {
      await file_service.delete_resume()
      setFilesInfo((prev: any) => ({
        ...prev,
        resume: null
      }))
      alert('Resume deleted successfully!')
    } catch (error: any) {
      alert(error.message || 'Failed to delete resume')
    }
  }

  const handleDeleteProfilePicture = async () => {
    if (!confirm('Are you sure you want to delete your profile picture?')) return

    try {
      await file_service.delete_profile_picture()
      setFilesInfo((prev: any) => ({
        ...prev,
        profilePicture: null
      }))
      alert('Profile picture deleted successfully!')
    } catch (error: any) {
      alert(error.message || 'Failed to delete profile picture')
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (profile) {
      setEditedData({
        fullName: profile.fullName || '',
        phoneNumber: profile.phoneNumber || '',
        currentProgram: profile.currentProgram || '',
        yearLevel: profile.yearLevel || '',
        portfolioLink: profile.portfolioLink || '',
        githubLink: profile.githubLink || '',
        linkedinProfile: profile.linkedinProfile || '',
        bio: profile.bio || '',
      })
    }
  }, [profile])

  const handleSave = async () => {
    try {
      setSaving(true)
      await updateProfile(editedData)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (profile) {
      setEditedData({
        fullName: profile.fullName || '',
        phoneNumber: profile.phoneNumber || '',
        currentProgram: profile.currentProgram || '',
        yearLevel: profile.yearLevel || '',
        portfolioLink: profile.portfolioLink || '',
        githubLink: profile.githubLink || '',
        linkedinProfile: profile.linkedinProfile || '',
        bio: profile.bio || '',
      })
    }
    setIsEditing(false)
  }

  const addSkill = (skill: string) => {
    if (skill.trim() && !editedData.skills.includes(skill.trim())) {
      setEditedData({
        ...editedData,
        skills: [...editedData.skills, skill.trim()]
      })
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setEditedData({
      ...editedData,
      skills: editedData.skills.filter((skill: string) => skill !== skillToRemove)
    })
  }

  if (!isAuthenticated) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load profile: {error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Profile not found</p>
        </div>
      </div>
    )
  }


  return (
    <div className="h-screen bg-white overflow-hidden">
      <div className="flex h-full">
        {/* Left Sidebar */}
        <div className="w-80 border-r bg-gray-50 flex flex-col">
          <div className="p-6 space-y-4 flex-1 overflow-y-auto">
            <Link href="/" className="block">
              <h1 className="text-xl font-bold text-gray-800 hover:text-gray-600 transition-colors">
                Better Internship
              </h1>
            </Link>

            <Link href="/search?category=all" className="flex items-center gap-3 text-gray-700 hover:text-gray-900 p-2 rounded-md hover:bg-gray-100 transition-colors">
              <Home className="h-5 w-5" />
              <span>Browse All</span>
            </Link>

            <div className="pt-4 border-t border-gray-200">
              <h2 className="font-semibold mb-4 text-gray-800">All Categories</h2>
              <div className="space-y-2">
                <CategoryLink icon={<Monitor className="h-5 w-5" />} label="Technology & Dev." category="Technology & Development" />
                <CategoryLink icon={<HardHat className="h-5 w-5" />} label="Engineering" category="Engineering" />
                <CategoryLink icon={<GraduationCap className="h-5 w-5" />} label="Education & Psychology" category="Education & Psychology" />
                <CategoryLink icon={<Palette className="h-5 w-5" />} label="Design & Arts" category="Design & Arts" />
                <CategoryLink icon={<Stethoscope className="h-5 w-5" />} label="Medical" category="Medical" />
                <CategoryLink icon={<Scale className="h-5 w-5" />} label="Law" category="Law" />
                <CategoryLink icon={<ChefHat className="h-5 w-5" />} label="Culinary Arts" category="Culinary Arts" />
                <CategoryLink icon={<Building2 className="h-5 w-5" />} label="Banking & Finance" category="Banking & Finance" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top bar with Profile button */}
          <div className="flex justify-end p-4">
            <ProfileButton />
          </div>
          
          {/* Profile Content */}
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button variant="outline" onClick={handleCancel} disabled={saving}>
                        Cancel
                      </Button>
                      <Button onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
                {/* Basic Information */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Full Name
                      </label>
                      {isEditing ? (
                        <Input
                          value={editedData.fullName}
                          onChange={(e) => setEditedData({ ...editedData, fullName: e.target.value })}
                          placeholder="Enter your full name"
                        />
                      ) : (
                        <p className="text-gray-900">{profile.fullName || 'Not provided'}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email
                      </label>
                      <p className="text-gray-900">{profile.email}</p>
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Phone Number
                      </label>
                      {isEditing ? (
                        <Input
                          value={editedData.phoneNumber}
                          onChange={(e) => setEditedData({ ...editedData, phoneNumber: e.target.value })}
                          placeholder="Enter your phone number"
                        />
                      ) : (
                        <p className="text-gray-900">{profile.phoneNumber || 'Not provided'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Program className="w-4 h-4 inline mr-2" />
                        Current Program
                      </label>
                      {isEditing ? (
                        <Input
                          value={editedData.currentProgram}
                          onChange={(e) => setEditedData({ ...editedData, currentProgram: e.target.value })}
                          placeholder="e.g. BS Computer Science"
                        />
                      ) : (
                        <p className="text-gray-900">{profile.currentProgram || 'Not provided'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Year Level</label>
                      {isEditing ? (
                        <select
                          value={editedData.yearLevel}
                          onChange={(e) => setEditedData({ ...editedData, yearLevel: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                        >
                          <option value="">Select year level</option>
                          <option value="1st Year">1st Year</option>
                          <option value="2nd Year">2nd Year</option>
                          <option value="3rd Year">3rd Year</option>
                          <option value="4th Year">4th Year</option>
                          <option value="Graduate">Graduate</option>
                        </select>
                      ) : (
                        <p className="text-gray-900">{profile.yearLevel || 'Not provided'}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Links */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Professional Links</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <ExternalLink className="w-4 h-4 inline mr-2" />
                        Portfolio Website
                      </label>
                      {isEditing ? (
                        <Input
                          value={editedData.portfolioLink}
                          onChange={(e) => setEditedData({ ...editedData, portfolioLink: e.target.value })}
                          placeholder="https://yourportfolio.com"
                        />
                      ) : (
                        <p className="text-gray-900">
                          {profile.portfolioLink ? (
                            <a href={profile.portfolioLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {profile.portfolioLink}
                            </a>
                          ) : (
                            'Not provided'
                          )}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Github className="w-4 h-4 inline mr-2" />
                        GitHub Profile
                      </label>
                      {isEditing ? (
                        <Input
                          value={editedData.githubLink}
                          onChange={(e) => setEditedData({ ...editedData, githubLink: e.target.value })}
                          placeholder="https://github.com/yourusername"
                        />
                      ) : (
                        <p className="text-gray-900">
                          {profile.githubLink ? (
                            <a href={profile.githubLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {profile.githubLink}
                            </a>
                          ) : (
                            'Not provided'
                          )}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <ExternalLink className="w-4 h-4 inline mr-2" />
                        LinkedIn Profile
                      </label>
                      {isEditing ? (
                        <Input
                          value={editedData.linkedinProfile}
                          onChange={(e) => setEditedData({ ...editedData, linkedinProfile: e.target.value })}
                          placeholder="https://linkedin.com/in/yourusername"
                        />
                      ) : (
                        <p className="text-gray-900">
                          {profile.linkedinProfile ? (
                            <a href={profile.linkedinProfile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {profile.linkedinProfile}
                            </a>
                          ) : (
                            'Not provided'
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">About</h2>
                  {isEditing ? (
                    <textarea
                      value={editedData.bio}
                      onChange={(e) => setEditedData({ ...editedData, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      className="w-full border border-gray-300 rounded-md px-3 py-2 h-24 resize-none"
                      maxLength={500}
                    />
                  ) : (
                    <p className="text-gray-900">{profile.bio || 'No bio provided'}</p>
                  )}
                </div>

                {/* Resume */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Resume</h2>
                  
                  {/* Hidden file inputs */}
                  <input
                    type="file"
                    ref={resumeInputRef}
                    onChange={handleResumeUpload}
                    accept=".pdf,.doc,.docx"
                    style={{ display: 'none' }}
                  />
                  <input
                    type="file"
                    ref={profilePictureInputRef}
                    onChange={handleProfilePictureUpload}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />

                  {filesInfo?.resume ? (
                    // Resume exists
                    <div className="border-2 border-green-200 bg-green-50 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-8 h-8 text-green-600" />
                          <div>
                            <p className="font-medium text-green-800">Resume uploaded</p>
                            <p className="text-sm text-green-600">
                              {filesInfo.resume.filename?.split('/').pop()?.substring(14) || 'resume.pdf'}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(filesInfo.resume.url, '_blank')}
                            className="text-green-600 border-green-600 hover:bg-green-100"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => resumeInputRef.current?.click()}
                            disabled={uploading.resume}
                            className="text-blue-600 border-blue-600 hover:bg-blue-100"
                          >
                            <Upload className="w-4 h-4 mr-1" />
                            {uploading.resume ? 'Uploading...' : 'Replace'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDeleteResume}
                            className="text-red-600 border-red-600 hover:bg-red-100"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // No resume
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 mb-3">
                        {uploading.resume ? 'Uploading resume...' : 'No resume uploaded'}
                      </p>
                      <Button
                        onClick={() => resumeInputRef.current?.click()}
                        disabled={uploading.resume}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploading.resume ? 'Uploading...' : 'Upload Resume'}
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">
                        PDF, DOC, or DOCX files up to 5MB
                      </p>
                    </div>
                  )}
                </div>

                {/* Profile Picture */}
                {/* <div>
                  <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>
                  
                  {filesInfo?.profilePicture ? (
                    // Profile picture exists
                    <div className="border-2 border-green-200 bg-green-50 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-green-300">
                            <img 
                              src={filesInfo.profilePicture.url} 
                              alt="Profile" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-green-800">Profile picture uploaded</p>
                            <p className="text-sm text-green-600">Click to view or replace</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => profilePictureInputRef.current?.click()}
                            disabled={uploading.profilePicture}
                            className="text-blue-600 border-blue-600 hover:bg-blue-100"
                          >
                            <Camera className="w-4 h-4 mr-1" />
                            {uploading.profilePicture ? 'Uploading...' : 'Replace'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDeleteProfilePicture}
                            className="text-red-600 border-red-600 hover:bg-red-100"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // No profile picture
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 mb-3">
                        {uploading.profilePicture ? 'Uploading profile picture...' : 'No profile picture uploaded'}
                      </p>
                      <Button
                        onClick={() => profilePictureInputRef.current?.click()}
                        disabled={uploading.profilePicture}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        {uploading.profilePicture ? 'Uploading...' : 'Upload Photo'}
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">
                        JPEG, PNG, GIF, or WebP files up to 2MB
                      </p>
                    </div>
                  )}
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CategoryLink({ icon, label, category }: { icon: React.ReactNode; label: string; category: string }) {
  return (
    <Link
      href={`/search?category=${encodeURIComponent(category)}`}
      className="flex items-center gap-3 text-gray-700 hover:text-gray-900 p-2 rounded-md hover:bg-gray-100 transition-colors"
    >
      <div className="border rounded-full p-2 bg-white flex-shrink-0">{icon}</div>
      <span className="text-sm truncate">{label}</span>
    </Link>
  )
}
