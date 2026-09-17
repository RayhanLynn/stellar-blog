@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (echo Please install Node.js 22 LTS or newer from https://nodejs.org & pause & exit /b 1)
where npm >nul 2>nul
if errorlevel 1 (echo npm was not found. Please install Node.js with npm. & pause & exit /b 1)
if not exist node_modules\hexo-theme-stellar (call npm install)
if errorlevel 1 (pause & exit /b 1)
call npm run build
if errorlevel 1 (pause & exit /b 1)
echo Open http://localhost:4322 after Hexo reports that the server is running.
call npm run dev
pause
