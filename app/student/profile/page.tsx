"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
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
  Github,
  ExternalLink,
  FileText,
  Camera,
  Trash2,
  Download,
  Eye,
  Calendar,
  Award
} from "lucide-react"
import ProfileButton from "@/components/student/profile-button"
import { useProfile } from "@/hooks/use-api"
import { useRouter } from "next/navigation"
import { file_service } from "@/lib/api-wrapper"
import { useAuthContext } from "../authctx"
import { motion, AnimatePresence } from "framer-motion"
import { useRefs } from "@/lib/db/use-refs"

export default function ProfilePage() {
  const { is_authenticated } = useAuthContext()
  const { profile, error, updateProfile } = useProfile()
  const { get_level, get_college } = useRefs();
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState<any>({ skills: [] })
  const [saving, setSaving] = useState(false)
  const [filesInfo, setFilesInfo] = useState<any>(null)
  const [uploading, setUploading] = useState<{ resume: boolean; profilePicture: boolean }>({ resume: false, profilePicture: false })
  const [showEmployerPreview, setShowEmployerPreview] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()
  
  // File input refs
  const resumeInputRef = useRef<HTMLInputElement>(null)
  const profilePictureInputRef = useRef<HTMLInputElement>(null)

  // Check if screen width is <= 1024px
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    // Check on mount
    checkScreenSize();

    // Add resize listener
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // File upload handlers
  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['application/pdf']
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF document')
      return
    }

    // Validate file size (3MB)
    if (file.size > 3 * 1024 * 1024) {
      alert('File size must be less than 3MB')
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
    if (!is_authenticated()) {
      router.push('/login')
    }
  }, [is_authenticated(), router])

  useEffect(() => {
    if (profile) {
      setEditedData({
        full_name: profile.full_name || '',
        phone_number: profile.phone_number || '',
        college: profile.college || '',
        year_level: profile.year_level || '',
        portfolio_link: profile.portfolio_link || '',
        github_link: profile.github_link || '',
        linkedin_link: profile.linkedin_link || '',
        calendly_link: profile.calendly_link || '',
        bio: profile.bio || '',
        taking_for_credit: profile.taking_for_credit || false,
        linkage_officer: profile.linkage_officer || '',
      })
    }
  }, [profile])

  const handleSave = async () => {
    try {
      setSaving(true)
      // Transform frontend field names to backend field names
      const dataToSend = {
        full_name: editedData.full_name,
        phone_number: editedData.phone_number,
        college: editedData.college,
        year_level: editedData.year_level,
        portfolio_link: editedData.portfolio_link,
        github_link: editedData.github_link,
        linkedin_link: editedData.linkedin_link,
        calendly_link: editedData.calendly_link,
        bio: editedData.bio,
        taking_for_credit: editedData.taking_for_credit,
        linkage_officer: editedData.linkage_officer,
      }
      await updateProfile(dataToSend)
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
        full_name: profile.full_name || '',
        phone_number: profile.phone_number || '',
        college: profile.college || '',
        year_level: profile.year_level || '',
        portfolio_link: profile.portfolio_link || '',
        github_link: profile.github_link || '',
        linkedin_link: profile.linkedin_link || '',
        calendly_link: profile.calendly_link || '',
        bio: profile.bio || '',
        taking_for_credit: profile.taking_for_credit || false,
        linkage_officer: profile.linkage_officer || '',
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

  if (!is_authenticated()) {
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
        {/* Left Sidebar - Hide on mobile */}
        {!isMobile && (
          <div className="w-80 border-r bg-gray-50 flex flex-col">
            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              <Link href="/" className="block">
                <h1 className="text-xl font-bold text-gray-800 hover:text-gray-600 transition-colors">
                  BetterInternship
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
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Mobile Header */}
          {isMobile && (
            <div className="flex justify-between items-center p-4 border-b bg-white">
              <Link href="/" className="block">
                <h1 className="text-xl font-bold text-gray-800">BetterInternship</h1>
              </Link>
              <ProfileButton />
            </div>
          )}

          {/* Desktop Profile button */}
          {!isMobile && (
            <div className="flex justify-end p-4">
              <ProfileButton />
            </div>
          )}
          
          {/* Profile Content */}
          <div className={`flex-1 overflow-y-auto ${isMobile ? 'p-4 pb-32' : 'p-4'}`}>
            <div className={`${isMobile ? 'max-w-none' : 'max-w-4xl mx-auto'}`}>
              <div className={`flex ${isMobile ? 'flex-col gap-3' : 'items-center justify-between'} mb-6`}>
                <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-2xl'}`}>Profile Settings</h1>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button variant="outline" onClick={handleCancel} disabled={saving} size={isMobile ? "sm" : "default"}>
                        Cancel
                      </Button>
                      <Button onClick={handleSave} disabled={saving} size={isMobile ? "sm" : "default"}>
                        {saving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)} size={isMobile ? "sm" : "default"}>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>

              {/* Mobile Layout */}
              {isMobile ? (
                <div className="space-y-4">
                  {/* Preview Profile Section - Moved to top */}
                  <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center mr-2">
                        <Eye className="w-3 h-3 text-indigo-600" />
                      </div>
                      Preview Profile
                    </h2>
                    
                    <Button
                      variant="outline"
                      onClick={() => setShowEmployerPreview(true)}
                      className="w-full h-12 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      See how employers view your profile
                    </p>
                  </div>

                  {/* Basic Information Card */}
                  <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                        <User className="w-3 h-3 text-blue-600" />
                      </div>
                      Basic Information
                    </h2>
                    <div className="space-y-4">
                      {/* Full Name */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700">
                          <User className="w-4 h-4 mr-2 text-gray-500" />
                          Full Name
                        </label>
                        {isEditing ? (
                          <Input
                            value={editedData.full_name || ''}
                            onChange={(e) => setEditedData({ ...editedData, full_name: e.target.value })}
                            placeholder="Enter your full name"
                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
                          />
                        ) : (
                          <p className="text-gray-900 font-medium text-sm">{profile.full_name || 'Not provided'}</p>
                        )}
                      </div>
                      
                      {/* Email */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700">
                          <Mail className="w-4 h-4 mr-2 text-gray-500" />
                          Email
                        </label>
                        <p className="text-gray-900 font-medium text-sm">{profile.email}</p>
                        <p className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md inline-block">Email cannot be changed</p>
                      </div>

                      {/* Phone Number */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700">
                          <Phone className="w-4 h-4 mr-2 text-gray-500" />
                          Phone Number
                        </label>
                        {isEditing ? (
                          <Input
                            value={editedData.phone_number || ''}
                            onChange={(e) => setEditedData({ ...editedData, phone_number: e.target.value })}
                            placeholder="Enter your phone number"
                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
                          />
                        ) : (
                          <p className="text-gray-900 font-medium text-sm">{profile.phone_number || <span className="text-gray-400 italic">Not provided</span>}</p>
                        )}
                      </div>

                      {/* College */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700">
                          <GraduationCap className="w-4 h-4 mr-2 text-gray-500" />
                          College
                        </label>
                        {isEditing ? (
                          <Input
                            value={editedData.college || ''}
                            onChange={(e) => setEditedData({ ...editedData, college: e.target.value })}
                            placeholder="e.g. BS Computer Science"
                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
                          />
                        ) : (
                          <p className="text-gray-900 font-medium text-sm">{get_college(profile.college)?.name || <span className="text-gray-400 italic">Not provided</span>}</p>
                        )}
                      </div>

                      {/* Year Level and Internship for Credit */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700">
                          <Badge className="w-4 h-4 mr-2 text-gray-500" />
                          Year Level
                        </label>
                        {isEditing ? (
                          <Input
                            value={editedData.year_level || ''}
                            onChange={(e) => setEditedData({ ...editedData, year_level: e.target.value })}
                            placeholder="Enter your year level (1-5)"
                            type="number"
                            min="1"
                            max="5"
                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
                          />
                        ) : (
                          <p className="text-gray-900 font-medium font-mono text-sm">{get_level(profile.year_level)?.name || <span className="text-gray-400 italic font-sans">Not provided</span>}</p>
                        )}
                      </div>

                      {/* Taking for Credit */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700">
                          <Award className="w-4 h-4 mr-2 text-gray-500" />
                          Internship for Credit
                        </label>
                        {isEditing ? (
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={editedData.taking_for_credit || false}
                              onCheckedChange={(checked) => {
                                setEditedData({ ...editedData, taking_for_credit: checked as boolean })
                                // Clear linkage officer if unchecked
                                if (!checked) {
                                  setEditedData(prev => ({ ...prev, linkage_officer: '' }))
                                }
                              }}
                              className="border-gray-300"
                            />
                            <span className="text-sm text-gray-700">
                              Taking for credit
                            </span>
                          </div>
                        ) : (
                          <p className="text-gray-900 font-medium text-sm">
                            {profile.taking_for_credit ? (
                              <span className="inline-flex items-center gap-2 text-green-700">
                                <Award className="w-4 h-4" />
                                Taking for credit
                              </span>
                            ) : (
                              <span className="text-gray-400 italic">Not taking for credit</span>
                            )}
                          </p>
                        )}
                      </div>

                      {/* Linkage Officer - Conditional */}
                      {(isEditing ? editedData.taking_for_credit : profile.taking_for_credit) && (
                        <div className="space-y-2">
                          <label className="flex items-center text-sm font-semibold text-gray-700">
                            <User className="w-4 h-4 mr-2 text-gray-500" />
                            Linkage Officer
                          </label>
                          {isEditing ? (
                            <Input
                              value={editedData.linkage_officer || ''}
                              onChange={(e) => setEditedData({ ...editedData, linkage_officer: e.target.value })}
                              placeholder="Enter your linkage officer's name"
                              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
                            />
                          ) : (
                            <p className="text-gray-900 font-medium text-sm">
                              {profile.linkage_officer || <span className="text-gray-400 italic">Not provided</span>}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Professional Links Card */}
                  <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center mr-2">
                        <ExternalLink className="w-3 h-3 text-green-600" />
                      </div>
                      Professional Links
                    </h2>
                    <div className="space-y-4">
                      {/* Portfolio */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700">
                          <ExternalLink className="w-4 h-4 mr-2 text-gray-500" />
                          Portfolio Website
                        </label>
                        {isEditing ? (
                          <Input
                            value={editedData.portfolio_link || ''}
                            onChange={(e) => setEditedData({ ...editedData, portfolio_link: e.target.value })}
                            placeholder="https://yourportfolio.com"
                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
                          />
                        ) : (
                          <div>
                            {profile.portfolio_link ? (
                              <a href={profile.portfolio_link} target="_blank" rel="noopener noreferrer" 
                                 className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium hover:underline text-sm break-all">
                                <ExternalLink className="w-3 h-3 mr-1 flex-shrink-0" />
                                {profile.portfolio_link}
                              </a>
                            ) : (
                              <span className="text-gray-400 italic text-sm">Not provided</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* GitHub */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700">
                          <Github className="w-4 h-4 mr-2 text-gray-500" />
                          GitHub Profile
                        </label>
                        {isEditing ? (
                          <Input
                            value={editedData.github_link || ''}
                            onChange={(e) => setEditedData({ ...editedData, github_link: e.target.value })}
                            placeholder="https://github.com/yourusername"
                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
                          />
                        ) : (
                          <div>
                            {profile.github_link ? (
                              <a href={profile.github_link} target="_blank" rel="noopener noreferrer" 
                                 className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium hover:underline text-sm break-all">
                                <Github className="w-3 h-3 mr-1 flex-shrink-0" />
                                {profile.github_link}
                              </a>
                            ) : (
                              <span className="text-gray-400 italic text-sm">Not provided</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* LinkedIn */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700">
                          <ExternalLink className="w-4 h-4 mr-2 text-gray-500" />
                          LinkedIn Profile
                        </label>
                        {isEditing ? (
                          <Input
                            value={editedData.linkedin_link || ''}
                            onChange={(e) => setEditedData({ ...editedData, linkedin_link: e.target.value })}
                            placeholder="https://linkedin.com/in/yourusername"
                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
                          />
                        ) : (
                          <div>
                            {profile.linkedin_link ? (
                              <a href={profile.linkedin_link} target="_blank" rel="noopener noreferrer" 
                                 className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium hover:underline text-sm break-all">
                                <ExternalLink className="w-3 h-3 mr-1 flex-shrink-0" />
                                {profile.linkedin_link}
                              </a>
                            ) : (
                              <span className="text-gray-400 italic text-sm">Not provided</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Calendly */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700">
                          <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                          Calendly Link
                        </label>
                        {isEditing ? (
                          <Input
                            value={editedData.calendly_link || ''}
                            onChange={(e) => setEditedData({ ...editedData, calendly_link: e.target.value })}
                            placeholder="https://calendly.com/yourusername"
                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
                          />
                        ) : (
                          <div>
                            {profile.calendly_link ? (
                              <a href={profile.calendly_link} target="_blank" rel="noopener noreferrer" 
                                 className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium hover:underline text-sm break-all">
                                <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                                {profile.calendly_link}
                              </a>
                            ) : (
                              <span className="text-gray-400 italic text-sm">Not provided</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* About Card */}
                  <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center mr-2">
                        <FileText className="w-3 h-3 text-purple-600" />
                      </div>
                      About
                    </h2>
                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          value={editedData.bio || ''}
                          onChange={(e) => setEditedData({ ...editedData, bio: e.target.value })}
                          placeholder="Tell us about yourself, your interests, goals, and what makes you unique..."
                          className="w-full border border-gray-200 rounded-lg px-4 py-3 h-32 resize-none focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                          maxLength={500}
                        />
                        <p className="text-xs text-gray-500 text-right">{(editedData.bio || '').length}/500 characters</p>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <p className="text-gray-900 leading-relaxed break-words overflow-wrap-anywhere text-sm">
                          {profile.bio || (
                            <span className="text-gray-400 italic">
                              No bio provided. Click "Edit Profile" to add information about yourself.
                            </span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Resume Section */}
                  <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center mr-2">
                        <FileText className="w-3 h-3 text-orange-600" />
                      </div>
                      Resume
                    </h2>
                  
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
                      <div className="border border-green-200 bg-green-50 rounded-md p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-green-600" />
                            <div>
                              <p className="text-sm font-medium text-green-800">Resume uploaded</p>
                              <p className="text-xs text-green-600">
                                {filesInfo.resume.filename?.split('/').pop()?.substring(14) || 'resume.pdf'}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(filesInfo.resume.url, '_blank')}
                              className="text-green-600 border-green-600 hover:bg-green-100 h-7 px-2"
                            >
                              <Download className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => resumeInputRef.current?.click()}
                              disabled={uploading.resume}
                              className="text-blue-600 border-blue-600 hover:bg-blue-100 h-7 px-2"
                            >
                              <Upload className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleDeleteResume}
                              className="text-red-600 border-red-600 hover:bg-red-100 h-7 px-2"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // No resume
                      <div className="border border-dashed border-gray-300 rounded-md p-4 text-center">
                        <FileText className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">
                          {uploading.resume ? 'Uploading...' : 'No resume uploaded'}
                        </p>
                        <Button
                          onClick={() => resumeInputRef.current?.click()}
                          disabled={uploading.resume}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 h-8"
                        >
                          <Upload className="w-3 h-3 mr-1" />
                          {uploading.resume ? 'Uploading...' : 'Upload Resume'}
                        </Button>
                        <p className="text-xs text-gray-500 mt-1">
                          PDF files up to 3MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Desktop Layout */
                <div className="grid gap-4 lg:grid-cols-3">
                  {/* Left Column - Basic Information and Professional Links */}
                  <div className="lg:col-span-2 space-y-4">
                    {/* Basic Information Card */}
                    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        Basic Information
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700">
                          <User className="w-4 h-4 mr-2 text-gray-500" />
                          Full Name
                        </label>
                        {isEditing ? (
                          <Input
                            value={editedData.full_name || ''}
                            onChange={(e) => setEditedData({ ...editedData, full_name: e.target.value })}
                            placeholder="Enter your full name"
                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
                          />
                        ) : (
                          <p className="text-gray-900 font-medium text-sm">{profile.full_name || 'Not provided'}</p>
                        )}
                      </div>
                      
                      {/* Email */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700">
                          <Mail className="w-4 h-4 mr-2 text-gray-500" />
                          Email
                        </label>
                        <p className="text-gray-900 font-medium text-sm">{profile.email}</p>
                        <p className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md inline-block">Email cannot be changed</p>
                      </div>

                      {/* Phone Number */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700">
                          <Phone className="w-4 h-4 mr-2 text-gray-500" />
                          Phone Number
                        </label>
                        {isEditing ? (
                          <Input
                            value={editedData.phone_number || ''}
                            onChange={(e) => setEditedData({ ...editedData, phone_number: e.target.value })}
                            placeholder="Enter your phone number"
                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
                          />
                        ) : (
                          <p className="text-gray-900 font-medium text-sm">{profile.phone_number || <span className="text-gray-400 italic">Not provided</span>}</p>
                        )}
                      </div>

                      {/* College */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700">
                          <GraduationCap className="w-4 h-4 mr-2 text-gray-500" />
                          College
                        </label>
                        {isEditing ? (
                          <Input
                            value={editedData.college || ''}
                            onChange={(e) => setEditedData({ ...editedData, college: e.target.value })}
                            placeholder="e.g. BS Computer Science"
                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
                          />
                        ) : (
                          <p className="text-gray-900 font-medium text-sm">{get_college(profile.college)?.name || <span className="text-gray-400 italic">Not provided</span>}</p>
                        )}
                      </div>

                      {/* Year Level */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700">
                          <Badge className="w-4 h-4 mr-2 text-gray-500" />
                          Year Level
                        </label>
                        {isEditing ? (
                          <Input
                            value={editedData.year_level || ''}
                            onChange={(e) => setEditedData({ ...editedData, year_level: e.target.value })}
                            placeholder="Enter your year level (1-5)"
                            type="number"
                            min="1"
                            max="5"
                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 max-w-xs text-sm"
                          />
                        ) : (
                          <p className="text-gray-900 font-medium font-mono text-sm">{get_level(profile.year_level)?.name || <span className="text-gray-400 italic font-sans">Not provided</span>}</p>
                        )}
                      </div>

                      {/* Taking for Credit */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700">
                          <Award className="w-4 h-4 mr-2 text-gray-500" />
                          Internship for Credit
                        </label>
                        {isEditing ? (
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={editedData.taking_for_credit || false}
                              onCheckedChange={(checked) => {
                                setEditedData({ ...editedData, taking_for_credit: checked as boolean })
                                // Clear linkage officer if unchecked
                                if (!checked) {
                                  setEditedData(prev => ({ ...prev, linkage_officer: '' }))
                                }
                              }}
                              className="border-gray-300"
                            />
                            <span className="text-sm text-gray-700">
                              Taking for credit
                            </span>
                          </div>
                        ) : (
                          <p className="text-gray-900 font-medium text-sm">
                            {profile.taking_for_credit ? (
                              <span className="inline-flex items-center gap-2 text-green-700">
                                <Award className="w-4 h-4" />
                                Taking for credit
                              </span>
                            ) : (
                              <span className="text-gray-400 italic">Not taking for credit</span>
                            )}
                          </p>
                        )}
                      </div>

                      {/* Linkage Officer - Conditional */}
                      {(isEditing ? editedData.taking_for_credit : profile.taking_for_credit) && (
                        <div className="space-y-2">
                          <label className="flex items-center text-sm font-semibold text-gray-700">
                            <User className="w-4 h-4 mr-2 text-gray-500" />
                            Linkage Officer
                          </label>
                          {isEditing ? (
                            <Input
                              value={editedData.linkage_officer || ''}
                              onChange={(e) => setEditedData({ ...editedData, linkage_officer: e.target.value })}
                              placeholder="Enter your linkage officer's name"
                              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
                            />
                          ) : (
                            <p className="text-gray-900 font-medium text-sm">
                              {profile.linkage_officer || <span className="text-gray-400 italic">Not provided</span>}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Professional Links Card */}
                  <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                        <ExternalLink className="w-4 h-4 text-green-600" />
                      </div>
                      Professional Links
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Portfolio */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700">
                          <ExternalLink className="w-4 h-4 mr-2 text-gray-500" />
                          Portfolio Website
                        </label>
                        {isEditing ? (
                          <Input
                            value={editedData.portfolio_link || ''}
                            onChange={(e) => setEditedData({ ...editedData, portfolio_link: e.target.value })}
                            placeholder="https://yourportfolio.com"
                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
                          />
                        ) : (
                          <div>
                            {profile.portfolio_link ? (
                              <a href={profile.portfolio_link} target="_blank" rel="noopener noreferrer" 
                                 className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium hover:underline text-sm">
                                <ExternalLink className="w-3 h-3 mr-1" />
                                {profile.portfolio_link}
                              </a>
                            ) : (
                              <span className="text-gray-400 italic text-sm">Not provided</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* GitHub */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700">
                          <Github className="w-4 h-4 mr-2 text-gray-500" />
                          GitHub Profile
                        </label>
                        {isEditing ? (
                          <Input
                            value={editedData.github_link || ''}
                            onChange={(e) => setEditedData({ ...editedData, github_link: e.target.value })}
                            placeholder="https://github.com/yourusername"
                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
                          />
                        ) : (
                          <div>
                            {profile.github_link ? (
                              <a href={profile.github_link} target="_blank" rel="noopener noreferrer" 
                                 className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium hover:underline text-sm">
                                <Github className="w-3 h-3 mr-1" />
                                {profile.github_link}
                              </a>
                            ) : (
                              <span className="text-gray-400 italic text-sm">Not provided</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* LinkedIn */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700">
                          <ExternalLink className="w-4 h-4 mr-2 text-gray-500" />
                          LinkedIn Profile
                        </label>
                        {isEditing ? (
                          <Input
                            value={editedData.linkedin_link || ''}
                            onChange={(e) => setEditedData({ ...editedData, linkedin_link: e.target.value })}
                            placeholder="https://linkedin.com/in/yourusername"
                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
                          />
                        ) : (
                          <div>
                            {profile.linkedin_link ? (
                              <a href={profile.linkedin_link} target="_blank" rel="noopener noreferrer" 
                                 className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium hover:underline text-sm">
                                <ExternalLink className="w-3 h-3 mr-1" />
                                {profile.linkedin_link}
                              </a>
                            ) : (
                              <span className="text-gray-400 italic text-sm">Not provided</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Calendly */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700">
                          <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                          Calendly Link
                        </label>
                        {isEditing ? (
                          <Input
                            value={editedData.calendly_link || ''}
                            onChange={(e) => setEditedData({ ...editedData, calendly_link: e.target.value })}
                            placeholder="https://calendly.com/yourusername"
                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
                          />
                        ) : (
                          <div>
                            {profile.calendly_link ? (
                              <a href={profile.calendly_link} target="_blank" rel="noopener noreferrer" 
                                 className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium hover:underline text-sm">
                                <Calendar className="w-3 h-3 mr-1" />
                                {profile.calendly_link}
                              </a>
                            ) : (
                              <span className="text-gray-400 italic text-sm">Not provided</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Preview Profile & Resume */}
                <div className="lg:col-span-1">
                  {/* Preview Profile Section */}
                  <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow sticky top-6 mb-4">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                        <Eye className="w-4 h-4 text-indigo-600" />
                      </div>
                      Preview Profile
                    </h2>
                    
                    <Button
                      variant="outline"
                      onClick={() => setShowEmployerPreview(true)}
                      className="w-full h-12 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      See how employers view your profile
                    </p>
                  </div>

                  {/* Resume Section */}
                  <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                        <FileText className="w-4 h-4 text-orange-600" />
                      </div>
                      Resume
                    </h2>
                  
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
                    <div className="border border-green-200 bg-green-50 rounded-md p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="text-sm font-medium text-green-800">Resume uploaded</p>
                            <p className="text-xs text-green-600">
                              {filesInfo.resume.filename?.split('/').pop()?.substring(14) || 'resume.pdf'}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(filesInfo.resume.url, '_blank')}
                            className="text-green-600 border-green-600 hover:bg-green-100 h-7 px-2"
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => resumeInputRef.current?.click()}
                            disabled={uploading.resume}
                            className="text-blue-600 border-blue-600 hover:bg-blue-100 h-7 px-2"
                          >
                            <Upload className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDeleteResume}
                            className="text-red-600 border-red-600 hover:bg-red-100 h-7 px-2"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // No resume
                    <div className="border border-dashed border-gray-300 rounded-md p-4 text-center">
                      <FileText className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        {uploading.resume ? 'Uploading...' : 'No resume uploaded'}
                      </p>
                      <Button
                        onClick={() => resumeInputRef.current?.click()}
                        disabled={uploading.resume}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 h-8"
                      >
                        <Upload className="w-3 h-3 mr-1" />
                        {uploading.resume ? 'Uploading...' : 'Upload Resume'}
                      </Button>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF files up to 3MB
                      </p>
                      </div>
                    )}
                  </div>
                  
                  {/* About Card - Moved here under Resume */}
                  <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow mt-4">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                        <FileText className="w-4 h-4 text-purple-600" />
                      </div>
                      About
                    </h2>
                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          value={editedData.bio || ''}
                          onChange={(e) => setEditedData({ ...editedData, bio: e.target.value })}
                          placeholder="Tell us about yourself, your interests, goals, and what makes you unique..."
                          className="w-full border border-gray-200 rounded-lg px-4 py-3 h-32 resize-none focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                          maxLength={500}
                        />
                        <p className="text-xs text-gray-500 text-right">{(editedData.bio || '').length}/500 characters</p>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <p className="text-gray-900 leading-relaxed break-words overflow-wrap-anywhere text-sm">
                          {profile.bio || (
                            <span className="text-gray-400 italic">
                              No bio provided. Click "Edit Profile" to add information about yourself.
                            </span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Employer Preview Modal */}
      <AnimatePresence>
        {showEmployerPreview && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setShowEmployerPreview(false)}
          >
            <motion.div 
              className="bg-white rounded-2xl w-[95vw] max-w-4xl h-[90vh] max-h-[90vh] overflow-hidden shadow-2xl"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <EmployerPreviewModal profile={profile} filesInfo={filesInfo} onClose={() => setShowEmployerPreview(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function EmployerPreviewModal({ profile, filesInfo, onClose }: { profile: any; filesInfo: any; onClose: () => void }) {
  // Helper function to get year level text
  const getYearLevelText = (yearLevel: number | undefined) => {
    if (!yearLevel) return 'Not specified'
    switch (yearLevel) {
      case 1: return '1st Year Student'
      case 2: return '2nd Year Student'
      case 3: return '3rd Year Student'
      case 4: return '4th Year Student'
      case 5: return '5th Year Student'
      default: return `${yearLevel}th Year Student`
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with close button */}
      <div className="flex justify-end p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
        >
          <X className="h-5 w-5 text-gray-500" />
        </Button>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-6">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Applied 16H 58M ago</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {profile?.full_name || profile?.fullName || 'Your Name'}
          </h1>
          <p className="text-gray-600 mb-4 md:mb-6">Applying for Sample Position • Full-Time</p>
          
          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!filesInfo?.resume}
            >
              <FileText className="h-4 w-4 mr-2" />
              {filesInfo?.resume ? 'View Resume' : 'No Resume Uploaded'}
            </Button>
            <Button 
              variant="outline" 
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
              disabled={!profile?.calendly_link}
            >
              <Calendar className="h-4 w-4 mr-2" />
              {profile?.calendly_link ? 'Schedule Interview' : 'No Calendly Link'}
            </Button>
          </div>
        </div>

        {/* Academic Background Card */}
        <div className="bg-blue-50 rounded-lg p-4 md:p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Academic Background</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Program</p>
              <p className="font-medium">
                {profile?.college || profile?.currentProgram || 'Not specified'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Institution</p>
              <p className="font-medium">DLSU Manila</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Year Level</p>
              <p className="font-medium">
                {getYearLevelText(profile?.year_level || profile?.yearLevel)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{profile?.email || 'Not provided'}</p>
            </div>
          </div>
        </div>

        {/* Contact & Links */}
        <div className="bg-gray-50 rounded-lg p-4 md:p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <ExternalLink className="h-4 w-4 text-gray-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Contact & Professional Links</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="font-medium">
                {profile?.phone_number || profile?.phoneNumber || 'Not provided'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Portfolio</p>
              {(profile?.portfolio_link || profile?.portfolioLink) ? (
                <a 
                  href={profile?.portfolio_link || profile?.portfolioLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium text-sm"
                >
                  View Portfolio
                </a>
              ) : (
                <p className="font-medium">Not provided</p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500">GitHub</p>
              {(profile?.github_link || profile?.githubLink) ? (
                <a 
                  href={profile?.github_link || profile?.githubLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium text-sm"
                >
                  View GitHub
                </a>
              ) : (
                <p className="font-medium">Not provided</p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500">LinkedIn</p>
              {(profile?.linkedin_link || profile?.linkedinProfile) ? (
                <a 
                  href={profile?.linkedin_link || profile?.linkedinProfile} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium text-sm"
                >
                  View LinkedIn
                </a>
              ) : (
                <p className="font-medium">Not provided</p>
              )}
            </div>
          </div>
        </div>

        {/* About the Candidate */}
        <div className="grid grid-cols-1 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">About the Candidate</h3>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-gray-700 text-sm leading-relaxed">
                {profile?.bio || 'No bio provided. The candidate has not added any information about themselves yet.'}
              </p>
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
