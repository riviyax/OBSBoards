@echo off
setlocal enabledelayedexpansion
title [SYSTEM] OBSBOARD RUNNER - RIVIYA_X
mode con: cols=100 lines=32

:: Define Colors (ANSI)
set "esc="
set "blue=%esc%[94m"
set "cyan=%esc%[96m"
set "yellow=%esc%[33m"
set "red=%esc%[91m"
set "green=%esc%[92m"
set "reset=%esc%[0m"

:menu
cls
echo.
echo    %blue%+--------------------------------------------------------------------------------------+%reset%
echo    %blue%^|    %cyan%____  ____   ____  ____                         _                             %blue%^|%reset%
echo    %blue%^|   %cyan%/ __ \/ __ \ / ___^|/ __ \                       ^| ^|                            %blue%^|%reset%
echo    %blue%^|  %cyan%^| ^|  ^| ^| ^|__^) ^| ^|___ ^| ^|__^) ^| ___     ____ _ _ __ __^| ^|                            %blue%^|%reset%
echo    %blue%^|  %cyan%^| ^|  ^| ^|  __ / \___ \^|  __ / / _ \   / _` ^| '__/ _` ^|                            %blue%^|%reset%
echo    %blue%^|  %cyan%^| ^|__^| ^| ^|     ____^) ^| ^|__^) ^| ^(_^) ^| ^(_^| ^| ^| ^| ^(_^| ^|                            %blue%^|%reset%
echo    %blue%^|   %cyan%\____/_^|    ^|_____/\____/ \___/ \__,_^|_^|  \__,_^|                            %blue%^|%reset%
echo    %blue%^|                                                                                      ^|%reset%
echo    %blue%+--------------------------------------------------------------------------------------+%reset%
echo                                     %yellow%Made by Riviya_X%reset%
echo.
echo                             --- %white%CONTROL PANEL INTERFACE%reset% ---
echo.
echo      %cyan%[1]%reset% LAUNCH ALL SERVICES       %gray%(Server + Client)%reset%
echo      %cyan%[2]%reset% CONFIGURE ENVIRONMENT     %gray%(.env Setup)%reset%
echo      %cyan%[3]%reset% CLEAN INSTALL             %gray%(npm install)%reset%
echo      %red%[4]%reset% TERMINATE TERMINAL
echo.
echo    %blue%----------------------------------------------------------------------------------------%reset%
echo.
set /p choice="  %yellow%[INPUT_REQ]%reset% Select an option (1-4): "

if "%choice%"=="1" goto launch
if "%choice%"=="2" goto config
if "%choice%"=="3" goto install
if "%choice%"=="4" exit
goto menu

:launch
cls
echo.
echo    %yellow%****************************************************************************************%reset%
echo    %yellow%* [%red%ALERT%yellow%] LIVE INSTANCE DEPLOYED                                                  *%reset%
echo    %yellow%* [%red%WARNING%yellow%] KEEP THIS TERMINAL OPEN! CLOSING STOPS BOTH SERVER AND CLIENT       *%reset%
echo    %yellow%****************************************************************************************%reset%
echo.
echo    %cyan%[SYSTEM]%reset% Initializing OBSBoard Services...
echo.

:: 'call' prevents the window from closing after the process stops
call npx concurrently "cd server && npm start" "cd client && npm run dev" --prefix "[{name}]" --names "SERVER,CLIENT" --prefix-colors "yellow,cyan"

echo.
echo    %red%[SYSTEM] Services stopped. Returning to menu...%reset%
timeout /t 2 >nul
goto menu

:install
cls
echo.
echo    %cyan%[SYSTEM]%reset% Cleaning and Installing Dependencies...
echo.

:: Using pushd/popd to prevent directory-not-found crashes
if exist "server\" (
    echo    %yellow%[1/2] Installing Server...%reset%
    pushd server
    call npm install
    popd
) else (echo %red%[ERROR] Server folder not found!%reset%)

if exist "client\" (
    echo.
    echo    %yellow%[2/2] Installing Client...%reset%
    pushd client
    call npm install
    popd
) else (echo %red%[ERROR] Client folder not found!%reset%)

echo.
echo    %green%[SUCCESS] Installation complete.%reset%
pause
goto menu

:config
cls
echo.
echo    %blue%========================================================================================%reset%
echo                                 %cyan%ENVIRONMENT CONFIGURATION%reset%
echo    %blue%========================================================================================%reset%
echo.
set /p mongo_url="  %yellow%[INPUT]%reset% Enter MongoDB URL: "
set /p port_num="  %yellow%[INPUT]%reset% Enter Server Port: "

if not exist "server\" mkdir server
(
echo MONGO_URI=%mongo_url%
echo PORT=%port_num%
) > server/.env

echo.
echo    %green%[SUCCESS] Configuration saved to /server/.env!%reset%
echo.
pause
goto menu