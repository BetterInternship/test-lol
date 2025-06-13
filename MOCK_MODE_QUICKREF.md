# 🚀 Mock Mode Quick Reference

## Current Status
Mock mode is currently **ENABLED** ✅

## Quick Toggle Commands

### Using npm scripts:
```bash
npm run mock:on      # Enable mock mode
npm run mock:off     # Disable mock mode
npm run mock:status  # Check current status
npm run mock:toggle  # Toggle on/off
```

### Using shell script (Mac/Linux):
```bash
./toggle-mock.sh on      # Enable mock mode
./toggle-mock.sh off     # Disable mock mode
./toggle-mock.sh status  # Check current status
./toggle-mock.sh toggle  # Toggle on/off
```

### Using Node.js script (Cross-platform):
```bash
node toggle-mock.js on      # Enable mock mode
node toggle-mock.js off     # Disable mock mode
node toggle-mock.js status  # Check current status
node toggle-mock.js toggle  # Toggle on/off
```

## What Happens in Mock Mode?

When mock mode is **ENABLED**:
- ✅ All API calls are intercepted
- ✅ No external API server needed
- ✅ Uses pre-configured test data
- ✅ Simulates network delay (300ms by default)
- ✅ Console logs all mock API calls

## Test Accounts

### Student Account:
- Email: `john.doe@example.com`
- Password: (any password works in mock mode)

### Employer Account:
- Email: `hr@techcorp.com`
- Password: (any password works in mock mode)

## Important Notes

1. **Restart Required**: After toggling mock mode, restart your dev server:
   ```bash
   npm run dev
   ```

2. **Development Only**: The visual toggle button only appears in development mode

3. **Data Persistence**: Mock data is stored in memory and resets on page reload

## Troubleshooting

If mock mode isn't working:
1. Check `.env.local` has `NEXT_PUBLIC_MOCK_MODE=true`
2. Restart the dev server
3. Clear browser cache/localStorage
4. Check browser console for mock API logs
