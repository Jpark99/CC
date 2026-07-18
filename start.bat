@echo off
cd /d "%~dp0"

if not exist node_modules (
  echo Installing dependencies for the first time - this only happens once...
  call npm install
)

echo Starting Fight Universe dev server in a new window...
start "Fight Universe Dev Server" cmd /k npm run dev

timeout /t 3 /nobreak >nul
start "" http://localhost:5173

echo.
echo Fight Universe should now be open in your browser.
echo To stop it, close the "Fight Universe Dev Server" window.
