@echo off
echo Starting Django server...
cd /d "%~dp0"
echo Current directory: %cd%
start /B pythonw.exe manage.py runserver 0.0.0.0:8000
if errorlevel 1 (
    echo Failed to start the server.
) else (
    echo Server started successfully.
)
pause