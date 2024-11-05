@echo off
setlocal

:: Initialize PID variable
set "PID="

:: Find the PID (Process ID) using netstat and findstr
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":4444" ^| findstr "LISTENING"') do (
    set "PID=%%a"
    goto :found
)

:: Check if PID is set
if not defined PID (
    echo No process found running on port 4444.
    exit /b
)

:found
:: Kill the process using the found PID
taskkill /PID %PID% /F

echo Process running on port 4444 has been stopped.

endlocal