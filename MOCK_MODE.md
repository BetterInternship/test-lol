# Mock Mode Documentation

Mock mode allows you to run the application without connecting to the external API server. This is useful for:

- Development without backend dependencies
- Testing different scenarios
- Demo purposes
- Offline development

## How to Enable Mock Mode

### Method 1: Environment Variable

1. Copy `.env.mock` to `.env.local`:
   ```bash
   cp .env.mock .env.local
   ```

2. Set `NEXT_PUBLIC_MOCK_MODE=true` in `.env.local`

3. Restart the development server

### Method 2: Runtime Toggle (Development Only)

1. Look for the settings icon (⚙️) in the bottom-right corner
2. Click it to open the Mock Mode panel
3. Toggle "Mock Mode" on/off

## Configuration Options

- **Network Delay**: Simulates network latency (in milliseconds)
- **Failure Rate**: Percentage of requests that should randomly fail (0-100)
- **Logging**: Enable/disable console logging of mock API calls

## Mock Data

The mock system includes:

- **Users**: Pre-configured user accounts
  - `john.doe@example.com` - Regular user account
  - `hr@techcorp.com` - Employer account

- **Jobs**: Sample job listings
- **Applications**: Sample job applications
- **Saved Jobs**: Sample saved jobs

## Features

### Authentication
- Login with any pre-configured email
- OTP verification accepts any 6-digit code
- Registration creates new mock users

### Data Management
- **Reset Data**: Clears all session data
- **Seed Data**: Adds additional mock users and jobs

### API Coverage
All main API endpoints are mocked:
- Authentication (login, logout, OTP)
- User profile management
- Job listings and search
- Job applications
- File uploads (simulated)
## Usage in Code

### Using the API Services

The application should import services from `api-wrapper.ts` instead of `api.ts`:

```typescript
// ✅ Correct - will use mock services when enabled
import { auth_service, user_service, job_service } from '@/lib/api-wrapper';

// ❌ Wrong - will always use real services
import { auth_service, user_service, job_service } from '@/lib/api';
```

### Checking Mock Mode Status

```typescript
import { isMockMode } from '@/lib/mock';

if (isMockMode()) {
  console.log('Running in mock mode');
}
```

### Managing Mock Configuration

```typescript
import { getMockConfig, setMockConfig } from '@/lib/mock';

// Get current configuration
const config = getMockConfig();

// Update configuration
setMockConfig({
  enabled: true,
  delay: 500,
  failureRate: 10,
  logging: true
});
```

## Extending Mock Data

To add more mock data, edit `/lib/mock/mock-data.ts`:

```typescript
export const mockUsers: { [key: string]: PublicUser } = {
  "user-2": {
    id: "user-2",
    email: "jane.smith@example.com",
    name: "Jane Smith",
    // ... other fields
  }
};
```

## Troubleshooting

1. **Mock mode not working**: 
   - Ensure you're importing from `api-wrapper.ts`
   - Check that `NEXT_PUBLIC_MOCK_MODE=true` is set
   - Clear browser localStorage and reload

2. **Data not persisting**:
   - Mock data is stored in memory and localStorage
   - Data resets on page reload when localStorage is cleared

3. **Authentication issues**:
   - Use pre-configured email addresses
   - Any 6-digit OTP code works in mock mode

## Best Practices

1. Always import API services from `api-wrapper.ts`
2. Don't commit `.env.local` with mock mode enabled
3. Use mock mode for development and testing only
4. Test with both mock and real APIs before deployment