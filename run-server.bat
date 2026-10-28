@echo off
setlocal
cd /d "%~dp0"
echo Starting Hanoi Lab at http://localhost:5500/
echo Keep this window open while you use the visualizer. Press Ctrl+C to stop.
where python >nul 2>nul
if not errorlevel 1 (
  python -m http.server 5500
  goto :end
)
where py >nul 2>nul
if not errorlevel 1 (
  py -3 -m http.server 5500
  goto :end
)
echo Python was not found. Install Python or start the VS Code Live Server extension.
pause
:end
endlocal
