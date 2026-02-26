@echo off
setlocal enabledelayedexpansion
title [SYSTEM] OBSBOARD RUNNER - RIVIYA_X
:: Ensures a consistent window size
mode con: cols=100 lines=32

:menu
cls
echo.
echo    +--------------------------------------------------------------------------------------+
echo    ^|                                                                                      ^|
echo    ^|    ____  ____   ____  ____                         _                             ^|
echo    ^|   / __ \/ __ \ / ___^|/ __ \                       ^| ^|                            ^|
echo    ^|  ^| ^|  ^| ^| ^|__^) ^| ^|___ ^| ^|__^) ^| ___   ____ _ _ __ __^| ^|                            ^|
echo    ^|  ^| ^|  ^| ^|  __ / \___ \^|  __ / / _ \ / _` ^| '__/ _` ^|                            ^|
echo    ^|  ^| ^|__^| ^| ^|    ____^) ^| ^|__^) ^| ^(_^) ^| ^(_^| ^| ^| ^| ^(_^| ^|                            ^|
echo    ^|   \____/_^|   ^|_____/\____/ \___/ \__,_^|_^|  \__,_^|                            ^|
echo    ^|                                                                                      ^|
echo    +--------------------------------------------------------------------------------------+
echo                                    Made by Riviya_X
echo.
echo                             --- CONTROL PANEL INTERFACE ---
echo.
echo                     [1] LAUNCH ALL SERVICES       (Server + Client)
echo                     [2] CONFIGURE ENVIRONMENT     (.env Setup)
echo                     [3] TERMINATE TERMINAL
echo.
echo    ----------------------------------------------------------------------------------------
echo.
set /p choice="  [INPUT_REQ] Select an option (1-3): "

if "%choice%"=="1" goto launch
if "%choice%"=="2" goto config
if "%choice%"=="3" exit
goto menu

:launch
cls
echo.
echo    ****************************************************************************************
echo    * [ALERT] LIVE INSTANCE DEPLOYED                                                       *
echo    * [WARNING] KEEP THIS TERMINAL OPEN! CLOSING STOPS BOTH SERVER AND CLIENT              *
echo    ****************************************************************************************
echo.
echo    [SYSTEM] Initializing OBSBoard Services...
echo.

:: Single window launch using concurrently
npx concurrently "cd server && npm start" "cd client && npm run dev" --prefix "[{name}]" --names "SERVER,CLIENT" --prefix-colors "yellow,cyan"

echo.
echo    [SYSTEM] Services stopped.
pause
goto menu

:config
cls
echo.
echo    ========================================================================================
echo                                 ENVIRONMENT CONFIGURATION
echo    ========================================================================================
echo.
set /p mongo_url="  [INPUT] Enter MongoDB URL: "
set /p port_num="  [INPUT] Enter Server Port: "

:: Updating the server side .env
echo MONGO_URI=%mongo_url% > server/.env
echo PORT=%port_num% >> server/.env

echo.
echo    [SUCCESS] Configuration saved to /server/.env!
echo.
pause
goto menu