@echo off
setlocal
cd /d "%~dp0"
set SCRIPT_DIR=%~dp0
title ATS Resume Studio — Local Launcher

echo ============================================================
echo    ATS RESUME STUDIO — Windows Launcher
echo ============================================================
echo  Application Directory: %SCRIPT_DIR%

where python >nul 2>&1
if %ERRORLEVEL% equ 0 (
  echo  Engine: Python
  echo  KEEP THIS COMMAND PROMPT WINDOW OPEN while using the app.
  echo ============================================================
  echo.
  python "%SCRIPT_DIR%serve.py"
  goto done
)

where python3 >nul 2>&1
if %ERRORLEVEL% equ 0 (
  echo  Engine: Python 3
  echo  KEEP THIS COMMAND PROMPT WINDOW OPEN while using the app.
  echo ============================================================
  echo.
  python3 "%SCRIPT_DIR%serve.py"
  goto done
)

where node >nul 2>&1
if %ERRORLEVEL% equ 0 (
  echo  Engine: Node.js
  echo  KEEP THIS COMMAND PROMPT WINDOW OPEN while using the app.
  echo ============================================================
  echo.
  node "%SCRIPT_DIR%serve.js"
  goto done
)

echo.
echo Neither Python nor Node.js was found.
echo Opening ATS Resume Studio directly in your default browser...
start "" "%SCRIPT_DIR%app\index.html"

:done
echo.
echo Press any key to close this window.
pause >nul
endlocal
