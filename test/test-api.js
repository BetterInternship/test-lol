// Test API connection
const API_URL = 'http://localhost:5001/api';

async function testAPI() {
  console.log('Testing API connection to:', API_URL);
  
  try {
    // Test basic API endpoint
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('API Response:', data);
    } else {
      console.error('API Error:', response.statusText);
    }
    
    // Test CORS with hire auth endpoint
    console.log('\nTesting CORS with hire auth endpoint...');
    const corsResponse = await fetch(`${API_URL}/auth/hire/email-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3000'
      },
      body: JSON.stringify({ email: 'test@example.com' }),
      credentials: 'include'
    });
    
    console.log('CORS Response status:', corsResponse.status);
    console.log('CORS headers:', Object.fromEntries(corsResponse.headers.entries()));
    
  } catch (error) {
    console.error('Connection error:', error);
  }
}

testAPI();
