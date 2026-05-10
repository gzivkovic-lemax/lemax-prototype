@echo off
title Lemax prototype - build for sharing
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0build.ps1"
echo.
pause
