"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DownloadPage() {
  const handleDownload = () => {
    // Create a link element and trigger download
    const link = document.createElement('a')
    link.href = '/Company_Information_Project_Details_Form.pdf'
    link.download = 'Company_Information_Project_Details_Form.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <div className="text-center space-y-8">
        {/* Main heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 max-w-4xl leading-tight">
          Thank you for using our school form automation
        </h1>
        
        {/* Download button */}
        <Button
          onClick={handleDownload}
          className="px-16 py-6 bg-black text-white text-xl font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          Download File ↓
        </Button>
        
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
          <Button
            variant="secondary"
            className="px-8 py-4 bg-gray-200 text-gray-800 text-lg rounded-lg hover:bg-gray-300 transition-colors"
            asChild
          >
            <Link href="/forms-automation">
              Generate More Forms
            </Link>
          </Button>
          
          <Button
            variant="secondary"
            className="px-8 py-4 bg-gray-200 text-gray-800 text-lg rounded-lg hover:bg-gray-300 transition-colors"
            asChild
          >
            <Link href="/dashboard">
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
