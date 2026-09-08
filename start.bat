```bat
@echo off
cd /d "%~dp0"

echo Starting Cement Mall Backend...
start "Cement Mall Backend" cmd /k "cd /d backend && node server.js"

timeout /t 3 /nobreak >nul

echo Starting Cement Mall Frontend...
start "Cement Mall Frontend" cmd /k "cd /d frontend && python -m http.server 5501"

timeout /t 3 /nobreak >nul

start "" "http://localhost:5501/index.html"
```
