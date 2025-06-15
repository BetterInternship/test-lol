# BetterInternship

A comprehensive internship platform connecting students with employers.

## Running Locally
```bash
npm run dev
```

## Mock Mode

The application includes a mock mode that allows you to run without an external API server. This is useful for development, testing, and demos.

### Quick Start

1. Enable mock mode by setting the environment variable:
   ```bash
   cp .env.mock .env.local
   # Edit .env.local and set NEXT_PUBLIC_MOCK_MODE=true
   ```

2. Or use the runtime toggle (development only):
   - Look for the settings icon (⚙️) in the bottom-right corner
   - Toggle "Mock Mode" on/off

### Features

- **No Backend Required**: Run the entire application without API server
- **Configurable**: Adjust network delay, failure rates, and logging
- **Pre-configured Data**: Includes sample users, jobs, and applications
- **Development Tools**: Reset data, seed new data, and test scenarios

For detailed documentation, see [MOCK_MODE.md](./MOCK_MODE.md)