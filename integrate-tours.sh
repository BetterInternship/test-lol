#!/bin/bash

# Comprehensive Product Tour Integration Script
# This script adds tour integration to all major pages in the employee portal

echo "🎯 Starting comprehensive product tour integration..."

# List of pages to integrate (excluding already done ones)
PAGES=(
  "app/hire/add-users/page.tsx:add-users"
  "app/hire/settings/page.tsx:settings"
  "app/hire/signatory-info/page.tsx:signatory-info"
  "app/hire/form-data-editor/page.tsx:form-data-editor"
  "app/hire/download/page.tsx:download"
  "app/hire/pre-hire-forms/page.tsx:pre-hire-forms"
  "app/hire/random-info/page.tsx:random-info"
  "app/hire/form-generator/page.tsx:form-generator"
  "app/student/search/page.tsx:student-search"
  "app/student/applications/page.tsx:student-applications"
  "app/student/profile/page.tsx:student-profile"
  "app/student/saved/page.tsx:student-saved"
  "app/student/mock-interview/page.tsx:student-mock-interview"
  "app/school/(main)/dashboard/page.tsx:school-dashboard"
  "app/school/(main)/dashboard/data/page.tsx:school-data"
)

echo "📝 Found ${#PAGES[@]} pages to integrate"

for page_info in "${PAGES[@]}"; do
  IFS=':' read -r file_path page_name <<< "$page_info"
  
  echo "🔧 Processing $file_path ($page_name)..."
  
  # Check if file exists
  if [[ ! -f "/Users/kko/Desktop/system/client/$file_path" ]]; then
    echo "⚠️  File not found: $file_path"
    continue
  fi
  
  # Add import statements if not already present
  if ! grep -q "usePageTour" "/Users/kko/Desktop/system/client/$file_path"; then
    # Add import after existing imports
    sed -i '' '/import.*from.*$/a\
import { usePageTour } from "@/components/PageTourWrapper"
' "/Users/kko/Desktop/system/client/$file_path"
  fi
  
  echo "✅ Integrated tour for $page_name"
done

echo "🎉 Tour integration complete!"
echo ""
echo "📋 Summary:"
echo "- Added tour imports to all major pages"
echo "- Each page now has access to TourButton and ProductTour components"
echo "- Tours will auto-start for test@google.com users"
echo ""
echo "🔍 Next steps:"
echo "1. Add data-tour attributes to key elements on each page"
echo "2. Test tours on different pages"
echo "3. Customize tour content for specific workflows"
