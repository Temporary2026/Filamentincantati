@echo off
echo ========================================
echo  COPIA FILE PER COMMIT
echo ========================================
echo.

if not exist "commit-files" (
    echo ERRORE: Cartella commit-files non trovata!
    echo Esegui prima prepare-commit.bat
    pause
    exit /b 1
)

echo Copio i file dalla cartella temporanea alla root...
echo.

REM Copia tutti i file dalla cartella temporanea alla root
xcopy "commit-files\*" "." /E /I /Y

echo.
echo ========================================
echo  FILE COPIATI CON SUCCESSO!
echo ========================================
echo.
echo Ora puoi eseguire:
echo git add .
echo git commit -m "Aggiornamento progetto"
echo.
echo ATTENZIONE: I file sensibili sono protetti dal .gitignore
echo.
pause

