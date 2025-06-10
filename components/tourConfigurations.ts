import { TourStep } from './ProductTour'

export const tourConfigurations: Record<string, TourStep[]> = {
  dashboard: [
    {
      target: 'welcome',
      title: 'Welcome to BetterInternship Dashboard! 🎉',
      content: 'This is your central hub for managing internship programs. Here you can view applications, track metrics, and oversee your entire hiring process.',
      position: 'center'
    },
    {
      target: '[data-tour="sidebar"]',
      title: 'Navigation Sidebar',
      content: 'Use this sidebar to navigate between Dashboard, Job Listings, and Forms Automation. Each section is designed to streamline your workflow.',
      position: 'right'
    },
    {
      target: '[data-tour="dashboard-cards"]',
      title: 'Quick Metrics Overview',
      content: 'These cards give you instant insights: total applications, hired candidates, active interviews, and new applications waiting for review.',
      position: 'bottom'
    },
    {
      target: '[data-tour="user-menu"]',
      title: 'Account Management',
      content: 'Access your company profile, add team members, and manage account settings. You can also start this tutorial anytime from here.',
      position: 'left'
    },
    {
      target: '.overflow-auto',
      title: 'Applicant Management Table',
      content: 'View and manage all applications here. You can filter by position, sort candidates, update statuses, and access resumes directly.',
      position: 'top'
    }
  ],

  listings: [
    {
      target: 'welcome',
      title: 'Job Listings Management 📋',
      content: 'Create, edit, and manage all your internship positions from this page. Track application rates and optimize your job postings.',
      position: 'center'
    },
    {
      target: '[data-tour="add-job-btn"]',
      title: 'Create New Job Listing',
      content: 'Click here to create new internship positions. Specify requirements, salary ranges, work arrangements, and detailed job descriptions.',
      position: 'bottom'
    },
    {
      target: '[data-tour="job-cards"]',
      title: 'Your Active Listings',
      content: 'Each card shows key metrics: views, applications, and status. Click to edit details, pause listings, or view applicant analytics.',
      position: 'top'
    },
    {
      target: '[data-tour="job-filters"]',
      title: 'Filter & Search',
      content: 'Quickly find specific listings using filters for department, job type, status, or search by keywords.',
      position: 'right'
    },
    {
      target: '[data-tour="bulk-actions"]',
      title: 'Bulk Management',
      content: 'Select multiple listings for bulk actions like updating statuses, exporting data, or applying changes across positions.',
      position: 'left'
    }
  ],

  'forms-automation': [
    {
      target: 'welcome',
      title: 'Forms Automation System 📝',
      content: 'Automate school paperwork and compliance forms. This powerful feature saves hours of manual work and ensures consistency across all submissions.',
      position: 'center'
    },
    {
      target: '[data-tour="school-forms"]',
      title: 'School Form Templates',
      content: 'Access templates organized by school and internship stage: Pre-hire agreements, Progress evaluations, and Post-hire assessments.',
      position: 'right'
    },
    {
      target: '[data-tour="form-generator"]',
      title: 'Auto-Generate Forms',
      content: 'Select students and automatically generate pre-filled forms with their information. No more manual data entry or formatting issues.',
      position: 'left'
    },
    {
      target: '[data-tour="form-categories"]',
      title: 'Form Categories',
      content: 'Forms are organized by stage: Pre-hire (agreements, requirements), Progress (evaluations, check-ins), and Post-hire (completion certificates).',
      position: 'bottom'
    },
    {
      target: '[data-tour="compliance-tracking"]',
      title: 'Compliance Tracking',
      content: 'Track which forms are completed, pending, or require updates. Never miss important deadlines or requirements again.',
      position: 'top'
    }
  ],

  'form-generator': [
    {
      target: 'welcome',
      title: 'Form Generator 🔧',
      content: 'Generate pre-filled forms for your selected students. This tool automatically populates student and company information into the required templates.',
      position: 'center'
    },
    {
      target: '[data-tour="student-grid"]',
      title: 'Student Selection',
      content: 'Choose which students need forms generated. You can select individual students or use bulk selection for efficiency.',
      position: 'top'
    },
    {
      target: '[data-tour="form-preview"]',
      title: 'Form Preview',
      content: 'Preview how the forms will look with populated data before generating. This ensures accuracy and professional presentation.',
      position: 'right'
    },
    {
      target: '[data-tour="download-options"]',
      title: 'Download & Export',
      content: 'Generate forms as PDF, Word documents, or other formats. You can download individually or create bulk packages.',
      position: 'left'
    }
  ],

  'company-profile': [
    {
      target: 'welcome',
      title: 'Company Profile Setup 🏢',
      content: 'Configure your company information, branding, and preferences. This information will be used across all job listings and forms.',
      position: 'center'
    },
    {
      target: '[data-tour="company-details"]',
      title: 'Company Information',
      content: 'Add your company name, description, location, and contact details. This appears on job listings and communications with students.',
      position: 'top'
    },
    {
      target: '[data-tour="branding-section"]',
      title: 'Branding & Logo',
      content: 'Upload your company logo and customize colors. Your branding will appear on all generated forms and student-facing materials.',
      position: 'bottom'
    },
    {
      target: '[data-tour="signatory-info"]',
      title: 'Signatory Information',
      content: 'Add authorized signatories for official documents. This ensures all generated forms have the correct approval signatures.',
      position: 'right'
    }
  ],

  'add-users': [
    {
      target: 'welcome',
      title: 'Team Management 👥',
      content: 'Add team members to your BetterInternship account. Assign different roles and permissions based on their responsibilities.',
      position: 'center'
    },
    {
      target: '[data-tour="invite-form"]',
      title: 'Invite New Users',
      content: 'Enter email addresses and assign roles: Admin (full access), Recruiter (manage applications), or Viewer (read-only access).',
      position: 'top'
    },
    {
      target: '[data-tour="user-list"]',
      title: 'Current Team Members',
      content: 'See all team members, their roles, and last activity. You can modify permissions or remove access as needed.',
      position: 'bottom'
    },
    {
      target: '[data-tour="permission-settings"]',
      title: 'Permission Management',
      content: 'Configure what each role can access: job creation, applicant management, form generation, and system settings.',
      position: 'right'
    }
  ],

  // Student Portal Tours
  'student-search': [
    {
      target: 'welcome',
      title: 'Welcome to Internship Search! 🔍',
      content: 'Find your perfect internship opportunity. Use filters to narrow down positions that match your skills, interests, and schedule.',
      position: 'center'
    },
    {
      target: '[data-tour="search-filters"]',
      title: 'Smart Search Filters',
      content: 'Filter by location, company size, industry, work arrangement (remote/hybrid/on-site), and compensation range.',
      position: 'left'
    },
    {
      target: '[data-tour="job-cards"]',
      title: 'Internship Listings',
      content: 'Each card shows key details: company, role, requirements, and application deadline. Click to view full descriptions.',
      position: 'top'
    },
    {
      target: '[data-tour="saved-jobs"]',
      title: 'Save for Later',
      content: 'Heart icon lets you save interesting positions. Access your saved jobs anytime from the sidebar.',
      position: 'right'
    },
    {
      target: '[data-tour="quick-apply"]',
      title: 'Quick Apply',
      content: 'Apply instantly using your pre-filled profile information. No need to enter the same details repeatedly.',
      position: 'bottom'
    }
  ],

  'student-applications': [
    {
      target: 'welcome',
      title: 'Your Applications Dashboard 📊',
      content: 'Track all your internship applications in one place. Monitor status updates and manage your application pipeline.',
      position: 'center'
    },
    {
      target: '[data-tour="application-status"]',
      title: 'Application Status Tracking',
      content: 'See real-time status: Applied, Under Review, Interview Scheduled, Offer Received, or Declined. Get notified of updates.',
      position: 'top'
    },
    {
      target: '[data-tour="interview-calendar"]',
      title: 'Interview Calendar',
      content: 'View upcoming interviews, reschedule if needed, and access interview preparation materials and company information.',
      position: 'right'
    },
    {
      target: '[data-tour="application-notes"]',
      title: 'Personal Notes',
      content: 'Add private notes about each application: interview questions, company culture, follow-up reminders, and insights.',
      position: 'left'
    }
  ],

  'student-profile': [
    {
      target: 'welcome',
      title: 'Student Profile Management 👤',
      content: 'Keep your profile updated to attract the right opportunities. A complete profile increases your chances of getting hired.',
      position: 'center'
    },
    {
      target: '[data-tour="basic-info"]',
      title: 'Basic Information',
      content: 'Update your contact details, school information, major, graduation date, and availability for internships.',
      position: 'top'
    },
    {
      target: '[data-tour="skills-section"]',
      title: 'Skills & Expertise',
      content: 'List your technical skills, programming languages, tools, and soft skills. Use keywords that employers search for.',
      position: 'right'
    },
    {
      target: '[data-tour="resume-upload"]',
      title: 'Resume Management',
      content: 'Upload and manage multiple resume versions. Choose which resume to use for specific applications.',
      position: 'left'
    },
    {
      target: '[data-tour="portfolio-links"]',
      title: 'Portfolio & Projects',
      content: 'Showcase your work: GitHub repositories, portfolio websites, project demos, and other relevant links.',
      position: 'bottom'
    }
  ],

  // School Portal Tours  
  'school-dashboard': [
    {
      target: 'welcome',
      title: 'School Administration Dashboard 🎓',
      content: 'Monitor your students\' internship progress, track placements, and manage program requirements from this central hub.',
      position: 'center'
    },
    {
      target: '[data-tour="student-metrics"]',
      title: 'Student Placement Metrics',
      content: 'View placement rates, popular companies, internship types, and student satisfaction scores across your programs.',
      position: 'top'
    },
    {
      target: '[data-tour="program-management"]',
      title: 'Program Requirements',
      content: 'Set and track internship requirements: minimum hours, required evaluations, learning objectives, and completion criteria.',
      position: 'right'
    },
    {
      target: '[data-tour="company-partnerships"]',
      title: 'Partner Companies',
      content: 'Manage relationships with hiring partners. View company profiles, placement history, and feedback ratings.',
      position: 'left'
    },
    {
      target: '[data-tour="forms-tracking"]',
      title: 'Forms & Compliance',
      content: 'Track required paperwork: learning agreements, evaluations, timesheets, and completion certificates for each student.',
      position: 'bottom'
    }
  ]
}

// Helper function to get tour steps for a specific page
export function getTourSteps(pageName: string): TourStep[] {
  return tourConfigurations[pageName] || []
}

// Helper function to check if a page has a tour configured
export function hasPageTour(pageName: string): boolean {
  return pageName in tourConfigurations && tourConfigurations[pageName].length > 0
}
