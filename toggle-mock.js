#!/usr/bin/env node

// Mock Mode Toggle Script (Node.js version)
// Usage: node toggle-mock.js [on|off|status|toggle]

const fs = require('fs');
const path = require('path');

const ENV_FILE = path.join(__dirname, '.env.local');
const MOCK_VAR = 'NEXT_PUBLIC_MOCK_MODE';

// Function to read .env.local file
function readEnvFile() {
  try {
    return fs.readFileSync(ENV_FILE, 'utf8');
  } catch (error) {
    return '';
  }
}

// Function to write .env.local file
function writeEnvFile(content) {
  fs.writeFileSync(ENV_FILE, content, 'utf8');
}

// Function to get current mock mode status
function getStatus() {
  const content = readEnvFile();
  const regex = new RegExp(`^${MOCK_VAR}=true`, 'm');
  return regex.test(content) ? 'on' : 'off';
}

// Function to toggle mock mode
function toggleMock(mode) {
  let content = readEnvFile();
  const regex = new RegExp(`^${MOCK_VAR}=.*$`, 'm');
  
  if (mode === 'on') {
    if (regex.test(content)) {
      // Update existing variable
      content = content.replace(regex, `${MOCK_VAR}=true`);
    } else {
      // Add the variable if it doesn't exist
      content += `\n\n# Mock Mode Configuration\n${MOCK_VAR}=true`;
    }
    console.log('✅ Mock mode enabled');
  } else if (mode === 'off') {
    if (regex.test(content)) {
      content = content.replace(regex, `${MOCK_VAR}=false`);
    }
    console.log('❌ Mock mode disabled');
  }
  
  writeEnvFile(content);
}

// Main script
const command = process.argv[2] || 'status';

switch (command) {
  case 'on':
    toggleMock('on');
    console.log('📝 Restart your Next.js dev server for changes to take effect');
    break;
    
  case 'off':
    toggleMock('off');
    console.log('📝 Restart your Next.js dev server for changes to take effect');
    break;
    
  case 'status':
    const status = getStatus();
    if (status === 'on') {
      console.log('🟢 Mock mode is currently ON');
    } else {
      console.log('🔴 Mock mode is currently OFF');
    }
    break;
    
  case 'toggle':
    const current = getStatus();
    toggleMock(current === 'on' ? 'off' : 'on');
    console.log('📝 Restart your Next.js dev server for changes to take effect');
    break;
    
  default:
    console.log('Usage: node toggle-mock.js [on|off|status|toggle]');
    console.log('  on      - Enable mock mode');
    console.log('  off     - Disable mock mode');
    console.log('  status  - Show current mock mode status');
    console.log('  toggle  - Toggle mock mode on/off');
    process.exit(1);
}
