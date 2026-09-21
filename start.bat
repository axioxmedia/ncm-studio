@echo off
setlocal
cd /d "%~dp0"
set PORT=8765
where py >nul 2>nul && (
  py -3 serve.py
  goto :eof
)
where python >nul 2>nul && (
  python serve.py
  goto :eof
)
echo Python is required.
exit /b 1
