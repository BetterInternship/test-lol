"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Script from 'next/script'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Home, 
  Monitor, 
  HardHat, 
  GraduationCap, 
  Palette, 
  Stethoscope, 
  Scale, 
  ChefHat, 
  Building2,
  MicVocal,
  Gauge,
  Hash,
  Mic,
  X,
  Send
} from "lucide-react"
import ProfileButton from "@/components/student/profile-button"
import { useJobActions, useApplications } from "@/hooks/useApi"
import { useRouter } from "next/navigation"
import { useAuthContext } from "../authctx"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Head, Html } from "next/document"

export default function MockInterviewPage() {
  const { isAuthenticated } = useAuthContext()
  const { getMockInterview, loading, error, refetch } = useApplications()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mockInterviewQuestions, setMockInterviewQuestions] = useState([]);
  const [mockInterview, setMockInterview] = useState({});
  const [activeQuestionNumber, setActiveQuestionNumber] = useState('');
  const [activeQuestionText, setActiveQuestionText] = useState('');
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return router.push('/login')
    const applicationId = searchParams.get('application');
    if (!applicationId) return router.push('/login');
    
    (async() => {
      const mockInterview: any = await getMockInterview(applicationId)

      // ! add error handling here, load the generation status of the application interview too
      if (!mockInterview.interview)
        return;

      setMockInterview(mockInterview?.interview)
      setMockInterviewQuestions(mockInterview?.interview?.questions)
    })()
  }, [isAuthenticated, router])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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

  return (
    <>
      <Script
        src="https://aka.ms/csspeech/jsbrowserpackageraw"
        strategy="afterInteractive" // or "afterInteractive"
        onLoad={() => console.warn('Microsoft Speech SDK script loaded.')}
      />
      <Script
        src="http://localhost:3000/scripts/speechsdk.js"
        strategy="afterInteractive" // or "afterInteractive"
        onLoad={() => console.warn('Microsoft Speech SDK script loaded.')}
      />
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
                  <CategoryLink icon={<GraduationCap className="h-5 w-5" />} label="Education and Psychology" category="Education & Psychology" />
                  <CategoryLink icon={<Palette className="h-5 w-5" />} label="Design and Arts" category="Design & Arts" />
                  <CategoryLink icon={<Stethoscope className="h-5 w-5" />} label="Medical" category="Medical" />
                  <CategoryLink icon={<Scale className="h-5 w-5" />} label="Law" category="Law" />
                  <CategoryLink icon={<ChefHat className="h-5 w-5" />} label="Culinary Arts" category="Culinary Arts" />
                  <CategoryLink icon={<Building2 className="h-5 w-5" />} label="Banking and Finance" category="Banking & Finance" />
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
            
            {/* Applications Content */}
            <div className="flex-1 p-8 overflow-y-auto">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                  <MicVocal className="w-8 h-8 text-purple-500" />
                  <h1 className="text-3xl font-bold text-gray-900">Mock Interview</h1>
                </div>
                
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading mock interview...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <p className="text-red-600 mb-4">Failed to load mock interview: {error}</p>
                    <Button onClick={refetch}>Try Again</Button>
                  </div>
                ) : mockInterviewQuestions.length === 0 ? (
                  <div className="text-center py-12">
                    <MicVocal className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <div className="text-gray-500 text-lg mb-4">This application does not have a mock interview.</div>
                    <div className="text-gray-400 text-sm mb-6">
                      It is possible that the sample questions are still generating. Please wait a bit.
                    </div>
                    <Link href="">
                      <Button>Reload</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mockInterviewQuestions.map((mockInterviewQuestion: any) => (
                      <div key={mockInterviewQuestion.questionNumber} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                                    <Hash className="w-4 h-4" />
                                    <span className="font-medium">{parseInt(mockInterviewQuestion.questionNumber.slice(1))}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                                    <Gauge className="w-4 h-4" />
                                    <span>{mockInterviewQuestion.difficultyLevel}</span>
                                  </div>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                  {mockInterviewQuestion.questionText}
                                </h3>
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <Button size="sm" className="bg-black" onClick={() => {
                                setIsQuestionModalOpen(true);
                                setActiveQuestionNumber(mockInterviewQuestion.questionNumber)
                                setActiveQuestionText(mockInterviewQuestion.questionText)
                              }}>
                                Start attempt
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Answer Modal */}
          {isQuestionModalOpen && (
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div 
                className="bg-white rounded-lg w-[600px] p-6"
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl mr-4 max-w-prose font-light">{activeQuestionText}</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsQuestionModalOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                  >
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-100 hover:cursor-pointer transition-all duration-300">
                      <br />
                      <Mic className="h-16 w-16 m-auto opacity-75" />
                      <br />
                      <p className="text-sm text-gray-600">Start recording</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                  >
                    <Button 
                      onClick={() => {}}
                      className="w-full h-12 bg-black text-white hover:bg-gray-800 rounded-lg font-medium"
                    >
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Submit Answer
                      </div>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </>
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
