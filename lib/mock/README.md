# Mock Authentication System

A simplified authentication system for frontend development that allows you to build and test the complete user experience without requiring a backend server.

## 📁 File Structure

```
/lib/mock/
├── README.md          # This file - documentation and usage guide
├── config.ts          # Main configuration toggle
├── api.ts            # Mock API service implementations
└── data.ts           # Mock data and user management helpers
```

## 🎯 Purpose

This mock system enables:
- **Independent Frontend Development** - Build UI without waiting for backend APIs
- **Complete User Flow Testing** - Test registration, login, and dashboard features
- **Rapid Prototyping** - Quickly iterate on user experience design
- **Demo Preparation** - Show working features to stakeholders
- **Easy Backend Integration** - Simple toggle to switch to production APIs

## 🚀 Quick Start

### 1. Enable Mock Mode
```typescript
// File: /lib/mock/config.ts
const USE_MOCK_API = true; // Enable mock system
export { USE_MOCK_API };
```

### 2. Test the Flow
1. **Register** with any `@dlsu.edu.ph` email
2. **Auto-redirect** to login page with verification message
3. **Login** with the same email → Direct access to dashboard
4. **Browse jobs**, apply, manage profile - all features work!

### 3. Switch to Production
```typescript
// File: /lib/mock/config.ts
const USE_MOCK_API = false; // Use real backend APIs
export { USE_MOCK_API };
```

## 🔧 How It Works

### Simple Email Registration System
Instead of complex user objects and databases, the mock system uses a simple approach:

```typescript
// Stores just emails in localStorage
const registeredEmails = ['user1@dlsu.edu.ph', 'user2@dlsu.edu.ph'];

// Check if user exists
const isRegistered = registeredEmails.includes(email.toLowerCase());

// Register new user
if (!isRegistered) {
  registeredEmails.push(email.toLowerCase());
  localStorage.setItem('mockRegisteredEmails', JSON.stringify(registeredEmails));
}
```

### Mock vs Production Behavior

| Feature | Mock Mode | Production Mode |
|---------|-----------|-----------------|
| **Registration** | Email saved to localStorage → Redirect to login | Full form → Real API → Email verification |
| **Login** | Email check → Direct dashboard access | Email check → OTP verification → Dashboard |
| **Verification** | Auto-verified instantly | Real email verification required |
| **User Data** | Generated mock profile | Real user profiles from database |
| **Debug Tools** | Visible debug buttons and instructions | Completely hidden |

## 📋 Available Features

### Authentication
- ✅ **Email Registration** - Simple email storage system
- ✅ **Login Flow** - Direct access for registered emails
- ✅ **User Sessions** - Persistent login state
- ✅ **DLSU Email Validation** - Enforces university email domains

### Job System
- ✅ **Job Listings** - 8+ sample internship/job postings
- ✅ **Job Search** - Search by title, company, location
- ✅ **Job Filtering** - Filter by type, mode, industry
- ✅ **Job Applications** - Apply to jobs with cover letters
- ✅ **Saved Jobs** - Bookmark interesting opportunities

### User Management
- ✅ **Profile Management** - Edit user information
- ✅ **File Uploads** - Mock resume and profile picture uploads
- ✅ **Application Tracking** - View submitted applications
- ✅ **Dashboard Stats** - Application statistics and activity

## 🎮 Mock Development Tools

When `USE_MOCK_API = true`, additional developer tools appear:

### Debug Buttons (Login Page)
```typescript
// Show all registered emails
<button onClick={showRegisteredEmails}>Show Registered Emails</button>

// Clear all mock data
<button onClick={clearMockData}>Clear Mock Data</button>
```

### Console Logging
- Email registration events
- Authentication attempts
- API call traces
- User data operations

### Visual Helpers
- Mock system instruction boxes
- Email verification status indicators
- Development-friendly error messages

## 📊 Mock Data

### Sample Jobs
```typescript
// 8 different job postings including:
- Frontend Developer Intern (TechStart Solutions)
- Backend Developer Intern (CodeCraft Inc)  
- Data Analyst Intern (Grab Philippines)
- Software Engineer (Microsoft Philippines)
- UI/UX Design Intern (Creative Hub Studios)
- Marketing Intern (Unilever Philippines)
- Product Management Intern (TechStart Solutions)
- DevOps Engineering Intern (Grab Philippines)
```

### Sample Companies
```typescript
// 6 companies with realistic data:
- TechStart Solutions (Technology, Makati)
- CodeCraft Inc (Technology, Taguig)
- Grab Philippines (Technology, BGC)
- Microsoft Philippines (Technology, BGC)
- Creative Hub Studios (Creative Services, Pasig)
- Unilever Philippines (Consumer Goods, BGC)
```

## 🔧 Configuration Options

### Main Toggle
```typescript
// /lib/mock/config.ts
const USE_MOCK_API = true;  // Enable all mock features
const USE_MOCK_API = false; // Use production APIs, hide all mock elements
```

### Customizable Mock Data
```typescript
// /lib/mock/data.ts

// Add default test emails
const defaultEmails = ['john.doe@students.dlsu.edu.ph', 'test@dlsu.edu.ph'];

// Modify mock user data
const getMockUserData = (email: string) => ({
  id: `user-${Date.now()}`,
  email: email,
  fullName: "Custom Mock User", // Customize default values
  currentProgram: "BS Computer Science",
  // ... other fields
});
```

## 🛠️ Development Workflow

### Typical Development Process
1. **Enable Mock** (`USE_MOCK_API = true`)
2. **Build Features** - Develop UI components and user flows
3. **Test Thoroughly** - Use debug tools to verify functionality
4. **Demo Features** - Show working prototype to stakeholders
5. **Switch to Production** (`USE_MOCK_API = false`) when backend ready

### Adding New Mock Features
```typescript
// /lib/mock/api.ts - Add new mock endpoints
async newFeature(params) {
  await delay(); // Simulate network delay
  // Return mock data that matches your API structure
  return { success: true, data: mockData };
}

// /lib/api.ts - Add production toggle
async newFeature(params) {
  if (USE_MOCK_API) {
    return mockApiService.newFeature(params);
  }
  return APIClient.post('/api/new-feature', params);
}
```

## 🔍 Debugging

### Check Stored Data
```javascript
// Browser console - view registered emails
JSON.parse(localStorage.getItem('mockRegisteredEmails') || '[]')

// View authentication state
JSON.parse(sessionStorage.getItem('isAuthenticated') || 'false')
JSON.parse(sessionStorage.getItem('user') || 'null')
```

### Reset Mock Data
```javascript
// Clear all mock data
localStorage.removeItem('mockRegisteredEmails');
sessionStorage.clear();

// Or use the debug button on login page (mock mode only)
```

### Common Issues
- **"User not found"** - Email not in registered list, register first
- **Build errors** - Check for duplicate exports in data.ts
- **Features not working** - Verify `USE_MOCK_API` is imported correctly

## 🚀 Production Deployment

### Before Going Live
1. **Set `USE_MOCK_API = false`** in config.ts
2. **Test production flow** - Verify all mock elements hidden
3. **Connect real APIs** - Ensure backend endpoints are configured
4. **Test authentication** - Verify real email/OTP flow works
5. **Remove mock files** (optional) - Clean up for production build

### Production Checklist
- [ ] Mock toggle disabled (`USE_MOCK_API = false`)
- [ ] No mock instructions visible
- [ ] No debug buttons or tools
- [ ] Real API endpoints configured
- [ ] Email service connected
- [ ] Database integration working
- [ ] Error handling for production

## 📈 Benefits

### For Developers
- **Fast Development** - No backend dependency
- **Complete Testing** - End-to-end user flows
- **Easy Debugging** - Visual tools and console logs
- **Realistic Data** - Proper data structures and relationships

### For Teams
- **Parallel Development** - Frontend and backend teams work independently
- **Early Demos** - Show working features before backend completion
- **Stakeholder Feedback** - Get UX feedback with working prototypes
- **Reduced Dependencies** - Frontend team never blocked

### For Product
- **Faster Iteration** - Quick feature testing and validation
- **Better UX** - Test complete user journeys
- **Risk Reduction** - Identify issues before backend integration
- **Demo Ready** - Always have a working version for presentations

## 🔄 Migration Path

The mock system is designed for easy migration to production:

```typescript
// Current mock implementation
if (USE_MOCK_API) {
  return mockApiService.getJobs(params);
}
return APIClient.get('/api/jobs', params);

// After backend is ready, simply change:
const USE_MOCK_API = false; // All calls now go to production
```

No code changes needed in components - the same hooks and API calls work for both mock and production modes.

---

## 💡 Tips

- **Keep mock data realistic** - Use real company names, job titles, and requirements
- **Test both modes regularly** - Ensure production toggle works correctly
- **Use debug tools** - Leverage console logs and debug buttons during development
- **Document changes** - Update mock data when adding new features
- **Clean production build** - Remove or exclude mock files in production bundles

Happy coding! 🚀
