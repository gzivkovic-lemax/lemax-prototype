@echo off
title Lemax prototype
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0run.ps1"
echo.
echo The dev server has stopped. Press any key to close this window.
pause >nul
