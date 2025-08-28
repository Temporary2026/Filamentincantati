@echo off
echo Preparazione commit per Filamentincantati...
echo.

REM Rimuovi cartelle temporanee se esistono
if exist "commit-files" rmdir /s /q "commit-files"
if exist "dist" rmdir /s /q "dist"

REM Crea cartella per i file da committare
mkdir "commit-files"

echo Copia file principali...
copy "index.html" "commit-files\"
copy "all-products.html" "commit-files\"
copy "controlpanel0806.html" "commit-files\"
copy "package.json" "commit-files\"
copy "package-lock.json" "commit-files\"
copy "vite.config.ts" "commit-files\"
copy "tsconfig.json" "commit-files\"
copy "tsconfig.app.json" "commit-files\"
copy "tsconfig.node.json" "commit-files\"
copy "tailwind.config.js" "commit-files\"
copy "postcss.config.js" "commit-files\"
copy "eslint.config.js" "commit-files\"

echo Copia cartella src...
xcopy "src" "commit-files\src\" /e /i /y

echo Copia cartella public...
xcopy "public" "commit-files\public\" /e /i /y

echo Copia file di documentazione...
copy "README.md" "commit-files\"
copy "ADMIN_README.md" "commit-files\"
copy "DEPLOYMENT.md" "commit-files\"
copy "ENV_EXAMPLE.txt" "commit-files\"
copy "NotePerProgetto.txt" "commit-files\"
copy "ISTRUZIONI-COMMIT.md" "commit-files\"

echo Copia script di utilità...
copy "copy-to-root.bat" "commit-files\"
copy "prepare-commit.bat" "commit-files\"
copy "prepare-commit.ps1" "commit-files\"

echo.
echo ========================================
echo FILES PREPARATI PER IL COMMIT:
echo ========================================
echo.
dir "commit-files" /s /b
echo.
echo ========================================
echo TOTALE FILE: 
dir "commit-files" /s /b | find /c /v ""
echo ========================================
echo.
echo Commit preparato con successo!
echo I file sono nella cartella 'commit-files'
echo.
echo Per committare:
echo 1. git add .
echo 2. git commit -m "feat: remove 2FA and implement localStorage persistence"
echo 3. git push origin main
echo.
pause