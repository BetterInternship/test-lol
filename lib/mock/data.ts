// Mock data for frontend development

export const mockCompanies = [
  {
    id: "1",
    name: "TechStart Solutions",
    logo: null,
    industry: "Technology",
    location: "Makati City",
    website: "https://techstart.com",
    description: "Leading technology solutions provider"
  },
  {
    id: "2", 
    name: "CodeCraft Inc",
    logo: null,
    industry: "Technology",
    location: "Taguig City",
    website: "https://codecraft.com",
    description: "Innovative software development company"
  },
  {
    id: "3",
    name: "Grab Philippines",
    logo: null,
    industry: "Technology",
    location: "BGC, Taguig",
    website: "https://grab.com",
    description: "Southeast Asia's leading superapp"
  },
  {
    id: "4",
    name: "Microsoft Philippines", 
    logo: null,
    industry: "Technology",
    location: "BGC, Taguig",
    website: "https://microsoft.com",
    description: "Global technology leader"
  },
  {
    id: "5",
    name: "Creative Hub Studios",
    logo: null,
    industry: "Creative Services",
    location: "Pasig City",
    website: "https://creativehub.com",
    description: "Creative design and branding agency"
  },
  {
    id: "6",
    name: "Unilever Philippines",
    logo: null,
    industry: "Consumer Goods",
    location: "BGC, Taguig", 
    website: "https://unilever.com.ph",
    description: "Leading consumer goods company"
  }
];

export const mockJobs = [
  {
    id: "job-1",
    title: "Frontend Developer Intern",
    description: "Join our dynamic team to create engaging web interfaces and learn modern development practices. You'll work closely with senior developers and designers to build responsive, user-friendly applications.",
    requirements: [
      "Knowledge of HTML, CSS, JavaScript",
      "Familiarity with React or Vue.js", 
      "Basic understanding of responsive design",
      "Good communication skills"
    ],
    responsibilities: [
      "Develop user-friendly web interfaces",
      "Collaborate with design team",
      "Write clean, maintainable code",
      "Test and debug applications"
    ],
    location: "Makati City",
    salary: "PHP 300/Day",
    type: "Internship",
    mode: "Hybrid",
    workType: "Hybrid",
    allowance: "Non-paid",
    projectType: "Project-Based/Flexible",
    keywords: ["frontend", "developer", "react", "javascript", "html", "css", "web", "interface", "coding"],
    isActive: true,
    applicationDeadline: null,
    startDate: null,
    duration: "3 months",
    viewCount: 45,
    createdAt: "2025-06-08T17:58:09.206764+00:00",
    updatedAt: "2025-06-08T17:58:09.206764+00:00",
    company: mockCompanies[0]
  },
  {
    id: "job-2", 
    title: "Backend Developer Intern",
    description: "Join our dynamic development team as a Backend Developer Intern. You'll work on exciting projects using modern server technologies and gain hands-on experience in building scalable, efficient applications.",
    requirements: [
      "Basic knowledge of Node.js or Python",
      "Understanding of databases",
      "Problem-solving skills", 
      "Eagerness to learn"
    ],
    responsibilities: [
      "Assist in backend development tasks",
      "Learn modern development practices",
      "Participate in code reviews",
      "Support API development"
    ],
    location: "Taguig City",
    salary: "PHP 350/Day",
    type: "Internship", 
    mode: "Remote",
    workType: "Remote",
    allowance: "Paid",
    projectType: "Full-time",
    keywords: ["backend", "developer", "node", "python", "api", "database", "server", "programming"],
    isActive: true,
    applicationDeadline: null,
    startDate: null,
    duration: "6 months",
    viewCount: 67,
    createdAt: "2025-06-08T17:58:09.406081+00:00",
    updatedAt: "2025-06-08T17:58:09.406081+00:00", 
    company: mockCompanies[1]
  },
  {
    id: "job-3",
    title: "Data Analyst Intern",
    description: "Analyze data to support business decisions and learn data science methodologies. Work with large datasets and create insights that drive business growth.",
    requirements: [
      "Statistics background",
      "Excel/SQL knowledge",
      "Analytical thinking"
    ],
    responsibilities: [
      "Data analysis",
      "Report generation", 
      "Dashboard creation"
    ],
    location: "BGC, Taguig",
    salary: "PHP 320/Day",
    type: "Internship",
    mode: "Remote",
    workType: "Remote", 
    allowance: "Paid",
    projectType: "Flexible",
    keywords: ["data", "analyst", "statistics", "sql", "remote", "intern"],
    isActive: true,
    applicationDeadline: null,
    startDate: null,
    duration: "4 months",
    viewCount: 89,
    createdAt: "2025-06-08T17:58:09.599385+00:00",
    updatedAt: "2025-06-08T17:58:09.599385+00:00",
    company: mockCompanies[2]
  },
  {
    id: "job-4",
    title: "Software Engineer",
    description: "Develop enterprise software solutions using cutting-edge technologies. Join a team of experienced engineers working on products used by millions of users worldwide.",
    requirements: [
      "CS degree",
      "5+ years experience",
      "C#/.NET expertise"
    ],
    responsibilities: [
      "Software development",
      "Architecture design",
      "Code mentoring"
    ],
    location: "BGC, Taguig",
    salary: "PHP 65,000/Month",
    type: "Full-time",
    mode: "Face to Face",
    workType: "On-site",
    allowance: "Paid",
    projectType: "Full-time",
    keywords: ["software", "engineer", "full", "time", "microsoft", "development"],
    isActive: true,
    applicationDeadline: null,
    startDate: null,
    duration: "Permanent",
    viewCount: 156,
    createdAt: "2025-06-08T17:58:09.777895+00:00",
    updatedAt: "2025-06-08T17:58:09.777895+00:00",
    company: mockCompanies[3]
  },
  {
    id: "job-5",
    title: "UI/UX Design Intern",
    description: "We are looking for a creative UI/UX Design Intern to contribute to our design projects. This is an excellent opportunity to gain practical experience in user interface and experience design.",
    requirements: [
      "Understanding of design principles",
      "Familiarity with Figma or Adobe XD",
      "Attention to detail",
      "Team collaboration skills"
    ],
    responsibilities: [
      "Support UI/UX design initiatives",
      "Learn industry best practices", 
      "Assist with user research",
      "Create wireframes and prototypes"
    ],
    location: "Pasig City",
    salary: "PHP 280/Day",
    type: "Internship",
    mode: "Hybrid",
    workType: "Hybrid",
    allowance: "Non-paid",
    projectType: "Project-Based/Flexible",
    keywords: ["ui", "ux", "design", "figma", "adobe", "wireframe", "prototype", "user", "interface", "experience"],
    isActive: true,
    applicationDeadline: null,
    startDate: null,
    duration: "3 months",
    viewCount: 73,
    createdAt: "2025-06-08T17:58:09.966579+00:00",
    updatedAt: "2025-06-08T17:58:09.966579+00:00",
    company: mockCompanies[4]
  },
  {
    id: "job-6",
    title: "Marketing Intern",
    description: "Support marketing campaigns and brand management initiatives while learning from industry professionals. Get hands-on experience with digital marketing, content creation, and brand strategy.",
    requirements: [
      "Marketing or Business student",
      "Creative thinking",
      "MS Office proficiency"
    ],
    responsibilities: [
      "Campaign assistance",
      "Market research",
      "Content creation support"
    ],
    location: "BGC, Taguig",
    salary: "PHP 350/Day",
    type: "Internship",
    mode: "Hybrid",
    workType: "Hybrid",
    allowance: "Paid",
    projectType: "Full-time",
    keywords: ["marketing", "campaigns", "brand", "research"],
    isActive: true,
    applicationDeadline: null,
    startDate: null,
    duration: "4 months",
    viewCount: 112,
    createdAt: "2025-06-08T17:58:10.152105+00:00",
    updatedAt: "2025-06-08T17:58:10.152105+00:00",
    company: mockCompanies[5]
  },
  {
    id: "job-7",
    title: "Product Management Intern",
    description: "Learn product management fundamentals while working on real products. Collaborate with engineering, design, and business teams to deliver exceptional user experiences.",
    requirements: [
      "Business or Engineering background",
      "Analytical mindset",
      "Strong communication skills",
      "Interest in technology products"
    ],
    responsibilities: [
      "Assist in product roadmap planning",
      "Conduct user research",
      "Support product launches",
      "Analyze product metrics"
    ],
    location: "Makati City",
    salary: "PHP 400/Day",
    type: "Internship",
    mode: "Hybrid",
    workType: "Hybrid",
    allowance: "Paid",
    projectType: "Full-time",
    keywords: ["product", "management", "strategy", "roadmap", "analytics"],
    isActive: true,
    applicationDeadline: "2025-07-15",
    startDate: "2025-08-01",
    duration: "6 months",
    viewCount: 89,
    createdAt: "2025-06-07T10:30:00.000000+00:00",
    updatedAt: "2025-06-07T10:30:00.000000+00:00",
    company: mockCompanies[0]
  },
  {
    id: "job-8",
    title: "DevOps Engineering Intern", 
    description: "Join our infrastructure team to learn about cloud computing, automation, and DevOps practices. Work with modern tools and technologies to support our development teams.",
    requirements: [
      "Basic Linux knowledge",
      "Interest in cloud technologies",
      "Problem-solving skills",
      "Willingness to learn automation"
    ],
    responsibilities: [
      "Support CI/CD pipeline maintenance",
      "Learn infrastructure as code",
      "Monitor system performance",
      "Assist with deployment processes"
    ],
    location: "BGC, Taguig",
    salary: "PHP 380/Day",
    type: "Internship",
    mode: "Face to Face",
    workType: "On-site",
    allowance: "Paid",
    projectType: "Full-time",
    keywords: ["devops", "cloud", "automation", "cicd", "infrastructure"],
    isActive: true,
    applicationDeadline: "2025-07-20",
    startDate: "2025-08-15",
    duration: "5 months",
    viewCount: 56,
    createdAt: "2025-06-06T14:15:00.000000+00:00", 
    updatedAt: "2025-06-06T14:15:00.000000+00:00",
    company: mockCompanies[2]
  }
];

export const mockCategories = [
  { category: "Internship", count: 6 },
  { category: "Full-time", count: 2 },
  { category: "Part-time", count: 0 }
];

export const mockApplications = [
  {
    id: "app-1",
    jobId: "job-1",
    userId: "user-1",
    coverLetter: "I am excited to apply for this frontend developer position...",
    githubLink: "https://github.com/johndoe",
    portfolioLink: "https://johndoe.dev",
    resumeFilename: "john_doe_resume.pdf",
    status: "pending",
    appliedAt: "2025-06-07T09:00:00.000000+00:00",
    updatedAt: "2025-06-07T09:00:00.000000+00:00"
  }
];

export const mockUsers = [
  {
    id: "user-1",
    email: "john.doe@email.com",
    firstName: "John",
    lastName: "Doe", 
    phone: "+639123456789",
    university: "University of the Philippines",
    course: "Computer Science",
    yearLevel: "4th Year",
    skills: ["React", "JavaScript", "HTML", "CSS", "Node.js"],
    bio: "Passionate frontend developer with experience in modern web technologies",
    resumeUrl: "https://example.com/resume.pdf",
    profilePictureUrl: null,
    linkedinUrl: "https://linkedin.com/in/johndoe",
    githubUrl: "https://github.com/johndoe",
    portfolioUrl: "https://johndoe.dev",
    location: "Manila, Philippines",
    isVerified: true,
    createdAt: "2025-05-01T00:00:00.000000+00:00",
    updatedAt: "2025-06-01T00:00:00.000000+00:00"
  }
];
