@echo off
setlocal

:: Find the PID (Process ID) using netstat and findstr
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :4444') do (
    set "PID=%%a"
)

:: Check if PID is set
if not defined PID (
    echo No process found running on port 4444
    exit /b
)

:: Kill the process using the found PID
taskkill /PID %PID% /F

echo Process running on port 4444 has been stopped.

endlocal