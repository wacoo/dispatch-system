@echo off
setlocal

:: Define the port number
set PORT=8000

:: Find the process ID (PID) of the service using the port
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :%PORT%') do set PID=%%a

:: Check if PID is set and if so, kill the process
if defined PID (
    echo Stopping process with PID %PID% using port %PORT%...
    taskkill /PID %PID% /F
) else (
    echo No process found using port %PORT%.
)

:: Run the Django development server in a new background window
echo Starting Django development server on 0.0.0.0:%PORT%...
start "" /B python manage.py runserver 0.0.0.0:%PORT%

endlocal