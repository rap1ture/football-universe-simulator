@echo off
rem ==========================================================
rem  Opens Windows Firewall for Career Legend on port 3999
rem  so other devices on your Wi-Fi can reach the game.
rem  RIGHT-CLICK this file -> "Run as administrator".
rem  You only need to do this ONCE.
rem ==========================================================

rem --- self-elevate to admin if not already ---
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Requesting administrator permission...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

echo Removing any old rule...
netsh advfirewall firewall delete rule name="Soccer Career 3999" >nul 2>&1

echo Adding firewall rule for port 3999 (local network only)...
netsh advfirewall firewall add rule name="Soccer Career 3999" dir=in action=allow protocol=TCP localport=3999 profile=any remoteip=localsubnet

echo(
if %errorlevel% equ 0 (
    echo  ==========================================================
    echo    SUCCESS! Other devices on your Wi-Fi can now connect.
    echo    Now run "Start Soccer Career.bat" and use the
    echo    http://YOUR-IP:3999 address it shows you.
    echo  ==========================================================
) else (
    echo  Something went wrong adding the rule.
)
echo(
pause
