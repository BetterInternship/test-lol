# Mock Mode Test Checklist

## ✅ Mock Mode is ACTIVE

Run `npm run mock:status` to verify mock mode is enabled.

## Test Scenarios

### 1. Job Listings ✅
- Jobs should appear on the home page
- Search should work without API calls
- Job details should display

### 2. Authentication & Profile Creation
- **Login**: Use `john.doe@example.com` (any password)
- **Register**: 
  - Use any @dlsu.edu.ph email
  - Fill the form
  - Should skip OTP and go directly to profile

### 3. Saved Jobs
- Click save on any job
- Check saved jobs page
- Should persist in memory

### 4. Applications
- Apply to any job
- Check applications page
- Should show in list

## Mock Data Available

### Users
- `john.doe@example.com` - Student account
- `hr@techcorp.com` - Employer account

### Jobs (5 available)
1. Senior Frontend Developer Intern - Tech Corp
2. Backend Engineer - StartupXYZ
3. UX/UI Designer Intern - Design Studio
4. Data Science Intern - Analytics Inc
5. Marketing Assistant - MediaCo

## Console Logs
When mock mode is active with logging enabled, you'll see:
```
[MOCK API] POST /api/auth/loggedin
[MOCK API] GET /api/jobs?last_update=...
```

## Toggle Mock Mode
- Click the settings icon (⚙️) in bottom-right
- Or run: `npm run mock:toggle`
