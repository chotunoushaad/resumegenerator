#!/bin/bash
# ATS Resume Studio — macOS Local Launcher
# 100% In-Browser & Private. No external APIs or telemetry.

# 1. Strictly resolve the absolute directory containing this script (handles spaces and symlinks)
SCRIPT_DIR="$(cd -- "$(dirname -- "$0")" && pwd)"
cd -- "$SCRIPT_DIR" || {
  echo "Error: Could not change directory to $SCRIPT_DIR"
  exit 1
}

# 2. Add common binary locations to PATH
export PATH="/usr/local/bin:/opt/homebrew/bin:/Library/Frameworks/Python.framework/Versions/Current/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

SERVE_PY="$SCRIPT_DIR/serve.py"
SERVE_JS="$SCRIPT_DIR/serve.js"
APP_INDEX="$SCRIPT_DIR/app/index.html"

echo "============================================================"
echo "   ATS RESUME STUDIO — macOS Launcher"
echo "============================================================"
echo " Application Directory: $SCRIPT_DIR"

# 3. Detect Python or Node binary
PYTHON_BIN=""
if command -v python3 >/dev/null 2>&1; then
  PYTHON_BIN="$(command -v python3)"
elif command -v python >/dev/null 2>&1; then
  PYTHON_BIN="$(command -v python)"
fi

NODE_BIN=""
if command -v node >/dev/null 2>&1; then
  NODE_BIN="$(command -v node)"
fi

SUCCESS=0

# Option 1: Run with Python via absolute path
if [ -n "$PYTHON_BIN" ] && [ -f "$SERVE_PY" ]; then
  echo " Engine:                Python ($PYTHON_BIN)"
  echo " Launching:             $PYTHON_BIN \"$SERVE_PY\""
  echo " KEEP THIS TERMINAL WINDOW OPEN while using the app."
  echo "============================================================"
  echo ""

  "$PYTHON_BIN" "$SERVE_PY"
  PY_STATUS=$?

  if [ $PY_STATUS -eq 0 ]; then
    SUCCESS=1
  else
    echo ""
    echo "⚠️ Python exited with status code: $PY_STATUS"
  fi
fi

# Option 2: Fallback to Node.js via absolute path if Python failed or was missing
if [ $SUCCESS -eq 0 ] && [ -n "$NODE_BIN" ] && [ -f "$SERVE_JS" ]; then
  echo ""
  echo "------------------------------------------------------------"
  echo " Attempting fallback to Node.js server..."
  echo " Engine:                Node.js ($NODE_BIN)"
  echo " Launching:             $NODE_BIN \"$SERVE_JS\""
  echo " KEEP THIS TERMINAL WINDOW OPEN while using the app."
  echo "------------------------------------------------------------"
  echo ""

  "$NODE_BIN" "$SERVE_JS"
  NODE_STATUS=$?

  if [ $NODE_STATUS -eq 0 ]; then
    SUCCESS=1
  else
    echo ""
    echo "⚠️ Node.js exited with status code: $NODE_STATUS"
  fi
fi

# Option 3: Fallback to direct browser file opening if local servers failed
if [ $SUCCESS -eq 0 ]; then
  echo ""
  echo "============================================================"
  echo "⚠️ LOCAL SERVER COULD NOT BE STARTED"
  echo "============================================================"
  echo "Troubleshooting:"
  echo "1. If macOS blocked the script, right-click 'start-mac.command' and choose 'Open'."
  echo "2. If your Mac blocked Python or Terminal file access, check:"
  echo "   System Settings -> Privacy & Security -> Files and Folders."
  echo "3. Opening app directly in your default web browser..."
  echo "============================================================"

  if [ -f "$APP_INDEX" ]; then
    open "$APP_INDEX"
  elif [ -f "$SCRIPT_DIR/index.html" ]; then
    open "$SCRIPT_DIR/index.html"
  fi
fi

echo ""
echo "Press [Enter] to close this window."
read -r
