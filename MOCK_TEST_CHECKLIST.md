# Mock Mode Test Checklist

## ✅ Mock Mode is ACTIVE

Run `npm run mock:status` to verify mock mode is enabled.

## Test Scenarios

### 1. Job Listings ✅
- 15 jobs should appear on the home page
- Jobs include major Philippine companies
- Search and filters work without API calls
- Job details display properly

### 2. DLSU User Flow (Primary Test)
- **Login**: Use `ric_pagulayan@dlsu.edu.ph` (any password)
- **Profile Creation**: 
  - Should redirect to profile creation
  - Fill all required fields
  - Profile saves without OTP verification
- **Features to Test**:
  - Save/unsave jobs
  - Apply to jobs
  - View saved jobs
  - Update profile
  - All data persists for this user

### 3. Existing User Flow
- **Login**: Use `john.doe@example.com` (any password)
- Has complete profile already
- Has 1 saved job

### 4. Saved Jobs
- Click save on any job listing
- Click again to unsave
- Check saved jobs page
- Each user has their own saved jobs list

### 5. Applications
- Apply to any job
- Fill application form
- Check applications page
- Should show all your applications

## Mock Data Available

### Users
- `ric_pagulayan@dlsu.edu.ph` - DLSU student (primary test account)
- `john.doe@example.com` - Student with existing profile
- `hr@techcorp.com` - Employer account

### Jobs (15 available)
**Technology**
1. Software Engineering Intern - Google Philippines
2. Full Stack Developer - Accenture Philippines  
3. Mobile App Developer Intern - Globe Telecom
4. Senior Frontend Developer Intern - Tech Corp
5. Backend Engineer - StartupXYZ
6. Data Science Intern - Analytics Inc

**Business & Finance**
7. Business Analyst Intern - Ayala Corporation
8. Finance Intern - BDO Unibank
9. Research Assistant - Asian Development Bank

**Creative & Media**
10. UX/UI Designer Intern - Design Studio
11. Graphic Design Intern - Canva Philippines
12. Content Writing Intern - Rappler

**Other**
13. Marketing Intern - Unilever Philippines
14. Marketing Assistant - MediaCo
15. HR Management Trainee - San Miguel Corporation

## Console Logs
When mock mode is active with logging enabled, you'll see:
```
[MOCK API] POST /api/auth/loggedin
[MOCK API] GET /api/jobs?last_update=...
```

## Toggle Mock Mode
- Click the settings icon (⚙️) in bottom-right
- Or run: `npm run mock:toggle`
