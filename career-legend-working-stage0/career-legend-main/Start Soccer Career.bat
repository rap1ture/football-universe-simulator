@echo off
cd /d "%~dp0"
setlocal enabledelayedexpansion

rem --- find this PC's Wi-Fi / LAN IPv4 address ---
set "LANIP="
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set "ip=%%a"
    set "ip=!ip: =!"
    rem prefer a 10.x or 192.168.x address (skip 172.x virtual adapters)
    echo !ip! | findstr /r "^10\. ^192\.168\." >nul && set "LANIP=!ip!"
)
if not defined LANIP (
    for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
        set "ip=%%a"
        set "ip=!ip: =!"
        if not defined LANIP set "LANIP=!ip!"
    )
)

echo(
echo  ==========================================================
echo    CAREER LEGEND - server starting on port 3999
echo  ==========================================================
echo(
echo    On THIS computer:      http://localhost:3999
if defined LANIP echo    On phones/other PCs:   http://!LANIP!:3999
echo(
echo    ^(Other devices must be on the same Wi-Fi. If they can't
echo     connect, run "Enable Network Access (Run as Admin).bat" once.^)
echo(
echo    Press Ctrl+C or close this window to stop the server.
echo  ==========================================================
echo(

start "" "http://localhost:3999"
py -3.11 -m http.server 3999 --bind 0.0.0.0
