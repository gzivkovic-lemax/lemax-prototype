# Builds the prototype as a static site you can upload to Cloudflare Pages or
# any other static host. Output goes into dist\lemax-prototype\browser and is
# also zipped into prototype-share.zip next to this script.

$ErrorActionPreference = 'Stop'
Set-Location -Path $PSScriptRoot

function Write-Step([string]$message) {
    Write-Host ''
    Write-Host ('--> ' + $message) -ForegroundColor Cyan
}

function Write-Ok([string]$message) {
    Write-Host ('   ' + $message) -ForegroundColor Green
}

function Test-Command([string]$name) {
    return [bool](Get-Command $name -ErrorAction SilentlyContinue)
}

Write-Host ''
Write-Host '===========================================' -ForegroundColor Cyan
Write-Host '  Lemax prototype - build for sharing'       -ForegroundColor Cyan
Write-Host '===========================================' -ForegroundColor Cyan

if (-not (Test-Command npm)) {
    Write-Host ''
    Write-Host 'Node.js / npm is not installed.' -ForegroundColor Red
    Write-Host 'Run run.bat once first - it installs Node automatically.' -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path -LiteralPath (Join-Path $PSScriptRoot 'node_modules'))) {
    Write-Step 'Installing dependencies (first time only)'
    npm install
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

Write-Step 'Building the prototype (this takes about 30 seconds)'
npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$buildDir = Join-Path $PSScriptRoot 'dist\lemax-prototype\browser'
if (-not (Test-Path -LiteralPath $buildDir)) {
    Write-Host ''
    Write-Host ('Expected build output at ' + $buildDir + ' but it is missing.') -ForegroundColor Red
    exit 1
}

$zipPath = Join-Path $PSScriptRoot 'prototype-share.zip'
if (Test-Path -LiteralPath $zipPath) { Remove-Item -LiteralPath $zipPath -Force }

Write-Step 'Zipping the build for upload'
Compress-Archive -Path (Join-Path $buildDir '*') -DestinationPath $zipPath -Force

Write-Host ''
Write-Ok 'Build complete.'
Write-Host ''
Write-Host '   You can upload either of these to Cloudflare Pages:' -ForegroundColor Yellow
Write-Host ('     1. The ZIP:    ' + $zipPath)
Write-Host ('     2. The folder: ' + $buildDir)
Write-Host ''
Write-Host '   See README.md for step-by-step Cloudflare instructions.' -ForegroundColor Yellow
