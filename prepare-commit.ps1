# Script PowerShell per preparare il commit Filamentincantati
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " PREPARAZIONE COMMIT FILAMENTINCANTATI" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Crea cartella temporanea per il commit
if (Test-Path "commit-files") {
    Write-Host "Rimuovo cartella commit-files esistente..." -ForegroundColor Yellow
    Remove-Item "commit-files" -Recurse -Force
}

Write-Host "Creo cartella temporanea commit-files..." -ForegroundColor Green
New-Item -ItemType Directory -Name "commit-files" | Out-Null

# Crea struttura cartelle
Write-Host "Creo struttura cartelle..." -ForegroundColor Green
New-Item -ItemType Directory -Path "commit-files\src" | Out-Null
New-Item -ItemType Directory -Path "commit-files\public" | Out-Null
New-Item -ItemType Directory -Path "commit-files\api" | Out-Null

# Copia file essenziali
Write-Host "Copio file essenziali..." -ForegroundColor Green

# File di configurazione
$configFiles = @(
    "package.json",
    "package-lock.json", 
    "tailwind.config.js",
    "vite.config.ts",
    "tsconfig.json",
    "tsconfig.app.json",
    "tsconfig.node.json",
    "vercel.json",
    "server.js",
    ".gitignore",
    "README.md",
    "eslint.config.js",
    "postcss.config.js",
    "index.html"
)

foreach ($file in $configFiles) {
    if (Test-Path $file) {
        Copy-Item $file "commit-files\" -Force
        Write-Host "  ✓ Copiato: $file" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Non trovato: $file" -ForegroundColor Yellow
    }
}

# Copia cartella src completa
Write-Host "Copio cartella src..." -ForegroundColor Green
if (Test-Path "src") {
    Copy-Item "src" "commit-files\" -Recurse -Force
    Write-Host "  ✓ Cartella src copiata" -ForegroundColor Green
}

# Copia cartella public (solo file necessari)
Write-Host "Copio cartella public..." -ForegroundColor Green
if (Test-Path "public") {
    Copy-Item "public\img" "commit-files\public\img" -Recurse -Force -ErrorAction SilentlyContinue
    Copy-Item "public\*.*" "commit-files\public\" -Force -ErrorAction SilentlyContinue
    Write-Host "  ✓ Cartella public copiata" -ForegroundColor Green
}

# Copia cartella api
Write-Host "Copio cartella api..." -ForegroundColor Green
if (Test-Path "api") {
    Copy-Item "api" "commit-files\api" -Recurse -Force
    Write-Host "  ✓ Cartella api copiata" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " COMMIT PREPARATO CON SUCCESSO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "File pronti per il commit nella cartella: commit-files\" -ForegroundColor White
Write-Host ""
Write-Host "PER COMMITTARE:" -ForegroundColor Yellow
Write-Host "1. Copia tutti i file da commit-files\ nella root del progetto" -ForegroundColor White
Write-Host "2. Esegui: git add ." -ForegroundColor White
Write-Host "3. Esegui: git commit -m 'Aggiornamento progetto'" -ForegroundColor White
Write-Host ""
Write-Host "ATTENZIONE: I file sensibili sono protetti dal .gitignore" -ForegroundColor Red
Write-Host ""
Write-Host "Premi un tasto per continuare..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

