@echo off
setlocal

:: Define the port numbers and VBScript paths
set PORT=8000
set PORT2=4444
set PORT3=5555
set VBS_PATH1=C:\dispatch-system\run.vbs
set VBS_PATH2=C:\dispatch-system\react_frontend\jsreport\run.vbs
set VBS_PATH3=C:\dispatch-system\react_frontend\jsreport_monthly\run.vbs

:loop
:: Initialize PID variables
set PID1=
set PID2=
set PID3=

:: Check if each port is in use
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :%PORT%') do set PID1=%%a
for /f "tokens=5" %%b in ('netstat -aon ^| findstr :%PORT2%') do set PID2=%%b
for /f "tokens=5" %%c in ('netstat -aon ^| findstr :%PORT3%') do set PID3=%%c

:: Determine action based on port statuses
if defined PID1 (
    echo Port %PORT% is in use.
) else (
    echo Port %PORT% is not in use. Restarting VBScript...
    taskkill /IM wscript.exe /F
    start "" wscript "%VBS_PATH1%"
)

if defined PID2 (
    echo Port %PORT2% is in use.
) else (
    echo Port %PORT2% is not in use. Restarting VBScript...
    taskkill /IM wscript.exe /F
    start "" wscript "%VBS_PATH2%"
)

if defined PID3 (
    echo Port %PORT3% is in use.
) else (
    echo Port %PORT3% is not in use. Restarting VBScript...
    taskkill /IM wscript.exe /F
    start "" wscript "%VBS_PATH3%"
)

:: Wait before checking again
timeout /t 60

goto loop

endlocal
endlocal