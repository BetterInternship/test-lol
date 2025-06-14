#!/bin/bash

# Mock Mode Toggle Script
# Usage: ./toggle-mock.sh [on|off|status]

ENV_FILE=".env.local"
MOCK_VAR="NEXT_PUBLIC_MOCK_MODE"

# Function to get current mock mode status
get_status() {
    if grep -q "^${MOCK_VAR}=true" "$ENV_FILE" 2>/dev/null; then
        echo "on"
    else
        echo "off"
    fi
}

# Function to toggle mock mode
toggle_mock() {
    local mode=$1
    
    if [ "$mode" = "on" ]; then
        # Check if the variable exists
        if grep -q "^${MOCK_VAR}=" "$ENV_FILE" 2>/dev/null; then
            # Update existing variable
            sed -i '' "s/^${MOCK_VAR}=.*/${MOCK_VAR}=true/" "$ENV_FILE"
        else
            # Add the variable if it doesn't exist
            echo -e "\n# Mock Mode Configuration\n${MOCK_VAR}=true" >> "$ENV_FILE"
        fi
        echo "✅ Mock mode enabled"
    elif [ "$mode" = "off" ]; then
        # Set to false instead of removing
        if grep -q "^${MOCK_VAR}=" "$ENV_FILE" 2>/dev/null; then
            sed -i '' "s/^${MOCK_VAR}=.*/${MOCK_VAR}=false/" "$ENV_FILE"
        fi
        echo "❌ Mock mode disabled"
    fi
}

# Main script
case "${1:-status}" in
    on)
        toggle_mock "on"
        echo "📝 Restart your Next.js dev server for changes to take effect"
        ;;
    off)
        toggle_mock "off"
        echo "📝 Restart your Next.js dev server for changes to take effect"
        ;;
    status)
        status=$(get_status)
        if [ "$status" = "on" ]; then
            echo "🟢 Mock mode is currently ON"
        else
            echo "🔴 Mock mode is currently OFF"
        fi
        ;;
    toggle)
        current=$(get_status)
        if [ "$current" = "on" ]; then
            toggle_mock "off"
        else
            toggle_mock "on"
        fi
        echo "📝 Restart your Next.js dev server for changes to take effect"
        ;;
    *)
        echo "Usage: $0 [on|off|status|toggle]"
        echo "  on      - Enable mock mode"
        echo "  off     - Disable mock mode"
        echo "  status  - Show current mock mode status"
        echo "  toggle  - Toggle mock mode on/off"
        exit 1
        ;;
esac
