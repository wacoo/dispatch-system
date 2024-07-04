@echo off
echo Starting Django server...
cd C:\dispatch-system
echo Current directory: %cd%
start /B python.exe manage.py runserver 0.0.0.0:8000
if errorlevel 1 (
    echo Failed to start the server.
) else (
    echo Server started successfully.
)
pause