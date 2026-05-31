@echo off
title FutureMe Launcher — SaiRaju Labs
color 0A

echo =====================================================================
echo                INITIALIZING FUTUREME CONVERGENCE SYSTEM
echo                         SaiRaju Labs Matrix
echo =====================================================================
echo.

:: Checking if Node is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Node.js is not installed on this system.
    echo Please install Node.js from https://nodejs.org/ to run the backend.
    echo.
    pause
    exit /b
)

echo [1/2] Launching backend Express server on Port 5000...
cd futureme\backend
start "FutureMe Backend Console" cmd /k "npm start"

echo [2/2] Establishing synchronization UI in browser...
cd ..\frontend
start index.html

echo.
echo =====================================================================
echo    Convergence initialization complete. Backend server logs are
echo    streaming in the separate console window. Happy reflection!
echo =====================================================================
echo.
pause
