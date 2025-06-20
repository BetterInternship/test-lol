// Test file to demonstrate has_dlsu_moa functionality
// This can be used to temporarily set has_dlsu_moa = true for testing

// To test the DLSU MOA badge functionality:
// 1. Open your browser's developer tools
// 2. Navigate to the Network tab
// 3. Find any job-related API response (like /api/jobs or /api/applications)
// 4. Right-click on the response and select "Override content"
// 5. Add "has_dlsu_moa": true to any employer object in the response
// 6. Reload the page to see the DLSU MOA badge appear

// Example of how the data should look with has_dlsu_moa = true:
const exampleJobWithMOA = {
  id: "123",
  title: "Software Developer Intern",
  description: "Join our development team...",
  employer: {
    id: "emp-456",
    name: "Tech Company Inc.",
    has_dlsu_moa: true // This will show the green DLSU MOA badge
  }
};

const exampleJobWithoutMOA = {
  id: "124", 
  title: "Marketing Intern",
  description: "Help with marketing campaigns...",
  employer: {
    id: "emp-457",
    name: "Marketing Corp",
    has_dlsu_moa: false // This won't show the badge
  }
};

// Alternatively, you can temporarily modify the API responses by:
// 1. Finding the API endpoint that returns job/employer data
// 2. Adding has_dlsu_moa: true to the employer objects in the response
// 3. The badge will automatically appear wherever jobs are displayed

export { exampleJobWithMOA, exampleJobWithoutMOA };
