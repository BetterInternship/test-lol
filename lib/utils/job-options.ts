// Job filtering options and categories

export const industriesOptions = [
  "All Industries",
  "Education",
  "Information Technology",
  "Engineering",
  "Finance & Banking",
  "Healthcare",
  "Gaming",
  "Government & Public Sector",
  "Legal Services",
  "Media & Communications",
  "Manufacturing",
  "Consulting",
  "Hospitality & Tourism",
  "Nonprofit & NGOs",
  "Retail & E-commerce",
  "Transportation & Logistics",
  "Energy & Utilities",
  "Others"
];

export const categoryGroups = {
  Tech: [
    "Frontend",
    "Backend", 
    "Mobile",
    "AI/ML",
    "UI/UX",
    "Product Management",
    "Project Management",
    "Dev Ops",
    "QA",
    "Design"
  ],
  "Non-Tech": [
    "Accounting",
    "Finance", 
    "Data Analysis",
    "Business Development",
    "Sales",
    "Marketing",
    "Content",
    "Administrative",
    "Operations",
    "HR",
    "IT",
    "Legal",
    "Support"
  ],
  Specialized: [
    "Engineering",
    "Research", 
    "Teaching",
    "Other"
  ]
};

// For compatibility, flatten all categories into a single array
export const allCategories = [
  "All categories",
  ...Object.values(categoryGroups).flat()
];

export type Industry = (typeof industriesOptions)[number];
export type CategoryGroup = keyof typeof categoryGroups;
export type Category = (typeof allCategories)[number];
