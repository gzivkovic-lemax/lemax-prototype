# Lemax prototype launcher.
# Run by double-clicking run.bat. It calls this script with -ExecutionPolicy Bypass.

$ErrorActionPreference = 'Stop'
Set-Location -Path $PSScriptRoot

$Url = 'http://localhost:4200'
$NodeMsiUrl = 'https://nodejs.org/dist/v20.18.0/node-v20.18.0-x64.msi'

function Write-Step([string]$message) {
    Write-Host ''
    Write-Host ('--> ' + $message) -ForegroundColor Cyan
}

function Write-Ok([string]$message) {
    Write-Host ('   ' + $message) -ForegroundColor Green
}

function Write-Warn([string]$message) {
    Write-Host ('   ' + $message) -ForegroundColor Yellow
}

function Test-Command([string]$name) {
    return [bool](Get-Command $name -ErrorAction SilentlyContinue)
}

function Update-PathFromMachine {
    $machine = [System.Environment]::GetEnvironmentVariable('Path', 'Machine')
    $user    = [System.Environment]::GetEnvironmentVariable('Path', 'User')
    if ($machine -and $user) { $env:Path = $machine + ';' + $user }
    elseif ($machine)        { $env:Path = $machine }
    elseif ($user)           { $env:Path = $user }
}

Write-Host ''
Write-Host '===========================================' -ForegroundColor Cyan
Write-Host '  Lemax prototype - one-click launcher'      -ForegroundColor Cyan
Write-Host '===========================================' -ForegroundColor Cyan

if (-not (Test-Path -LiteralPath (Join-Path $PSScriptRoot 'package.json'))) {
    Write-Host ''
    Write-Host 'ERROR: package.json not found next to run.bat.' -ForegroundColor Red
    Write-Host 'Make sure run.bat lives in the project root folder.' -ForegroundColor Red
    exit 1
}

# 1) Make sure Node.js is installed -------------------------------------------

Write-Step 'Checking for Node.js'

if (Test-Command node) {
    Write-Ok ('Node.js found: ' + (node --version))
} else {
    Write-Warn 'Node.js is not installed on this computer.'
    Write-Warn 'Installing the LTS version automatically (this is a one-time step).'
    Write-Warn 'Windows may show a User Account Control prompt - please click Yes.'

    $installed = $false

    if (Test-Command winget) {
        try {
            winget install --exact --id OpenJS.NodeJS.LTS `
                --accept-source-agreements --accept-package-agreements --silent | Out-Null
            $installed = $true
        } catch {
            Write-Warn 'winget install failed, falling back to direct download.'
        }
    }

    if (-not $installed) {
        $msiPath = Join-Path $env:TEMP 'node-lts.msi'
        Write-Warn ('Downloading Node.js LTS from ' + $NodeMsiUrl)
        try {
            Invoke-WebRequest -UseBasicParsing -Uri $NodeMsiUrl -OutFile $msiPath
            Write-Warn 'Running the Node.js installer (silent mode)...'
            $proc = Start-Process -FilePath 'msiexec.exe' `
                -ArgumentList @('/i', "`"$msiPath`"", '/qn', '/norestart') `
                -Wait -PassThru
            if ($proc.ExitCode -ne 0) {
                throw ('Node.js installer exited with code ' + $proc.ExitCode)
            }
            $installed = $true
        } catch {
            Write-Host ''
            Write-Host 'ERROR: Could not install Node.js automatically.' -ForegroundColor Red
            Write-Host ($_.Exception.Message)                            -ForegroundColor Red
            Write-Host ''
            Write-Host 'Please install Node.js LTS manually from https://nodejs.org' -ForegroundColor Yellow
            Write-Host 'and run this script again.'                                  -ForegroundColor Yellow
            exit 1
        } finally {
            if (Test-Path -LiteralPath $msiPath) { Remove-Item -LiteralPath $msiPath -Force }
        }
    }

    Update-PathFromMachine

    if (-not (Test-Command node)) {
        Write-Host ''
        Write-Host 'Node.js was installed but is not visible in this terminal yet.' -ForegroundColor Yellow
        Write-Host 'Close this window and double-click run.bat again to finish.'    -ForegroundColor Yellow
        exit 0
    }

    Write-Ok ('Node.js installed: ' + (node --version))
}

if (-not (Test-Command npm)) {
    Write-Host 'ERROR: npm is not available even though Node.js is installed.' -ForegroundColor Red
    Write-Host 'Please reinstall Node.js from https://nodejs.org and try again.' -ForegroundColor Red
    exit 1
}

Write-Ok ('npm version:    ' + (npm --version))

# 2) Install project dependencies if missing ---------------------------------

Write-Step 'Checking project dependencies'

$nodeModulesPath = Join-Path $PSScriptRoot 'node_modules'
if (-not (Test-Path -LiteralPath $nodeModulesPath)) {
    Write-Warn 'First run on this machine - installing dependencies (a few minutes).'
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host 'ERROR: npm install failed. See messages above.' -ForegroundColor Red
        exit $LASTEXITCODE
    }
    Write-Ok 'Dependencies installed.'
} else {
    Write-Ok 'Dependencies already installed - skipping.'
}

# 3) Open the browser once the dev server is ready ----------------------------

Write-Step 'Launching browser when the dev server is ready'

$openerCommand = @"
`$ErrorActionPreference = 'SilentlyContinue'
`$deadline = (Get-Date).AddMinutes(3)
while ((Get-Date) -lt `$deadline) {
    try {
        `$r = Invoke-WebRequest -UseBasicParsing -Uri '$Url' -TimeoutSec 2
        if (`$r.StatusCode -eq 200) {
            Start-Process '$Url'
            break
        }
    } catch { }
    Start-Sleep -Milliseconds 800
}
"@

Start-Process -WindowStyle Hidden -FilePath 'powershell.exe' `
    -ArgumentList @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', $openerCommand) | Out-Null

Write-Ok ('Once "Compiled successfully" appears, your browser opens at ' + $Url)

# 4) Start the dev server (foreground, Ctrl+C to stop) ------------------------

Write-Step 'Starting the Lemax prototype dev server'
Write-Host '   Keep this window open. Press Ctrl+C to stop the server.' -ForegroundColor Yellow
Write-Host ''

npm start
