# RANTEX local preview server (Windows PowerShell 5.1+ / PowerShell 7+)
$ErrorActionPreference = 'Stop'
$SitePath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $SitePath
$Python = Get-Command py -ErrorAction SilentlyContinue
if ($Python) {
    Write-Host "RANTEX is starting at http://localhost:5500" -ForegroundColor Cyan
    Start-Process "http://localhost:5500"
    py -m http.server 5500
} else {
    $Python = Get-Command python -ErrorAction SilentlyContinue
    if ($Python) {
        Write-Host "RANTEX is starting at http://localhost:5500" -ForegroundColor Cyan
        Start-Process "http://localhost:5500"
        python -m http.server 5500
    } else {
        Write-Host "Python was not found. Open index.html directly in your browser, or install Python from https://www.python.org/downloads/" -ForegroundColor Yellow
    }
}
