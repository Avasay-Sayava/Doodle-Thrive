@echo off
setlocal ENABLEDELAYEDEXPANSION

rem ==============================
rem Configuration and defaults
rem ==============================

rem Build option
if "%build%"=="" (
    set "build=true"
    echo No build option provided, defaulting to build: true
) else (
    echo Using provided build option: %build%
)

rem Set build arg
if /I "%build%"=="true" (
    set "build_arg=--build"
) else if /I "%build%"=="false" (
    set "build_arg="
) else (
    echo Invalid build choice "%build%".
    exit /b 1
)

rem Container name
if "%name%"=="" (
    set "name=base-server"
    echo No name provided, using default name: "%name%"
) else (
    echo Using provided name: "%name%"
)

rem Port
set "default_port=3000"
if "%port%"=="" (
    set /p "port=Enter the base server port to use (default: %default_port%): "
    if "%port%"=="" set "port=%default_port%"
    echo Using base server port: %port%
) else (
    echo Using provided port: %port%
)

rem Threads
set "default_threads=10"
if "%threads%"=="" (
    set /p "threads=Enter number of server threads (default: %default_threads%): "
    if "%threads%"=="" set "threads=%default_threads%"
    echo Using thread count: %threads%
) else (
    echo Using provided thread count: %threads%
)

echo.

rem ==============================
rem Delete existing container if needed
rem ==============================
set "existing_container="
for /f "delims=" %%I in ('docker ps -aq -f "name=^%name%$"') do set "existing_container=%%I"

if defined existing_container (
    echo Found existing container named "%name%".
    set /p "response=Do you want to delete it? (y/n) "
    if /I "!response!"=="y" (
        echo Deleting existing container...
        docker rm -f %name% >nul 2>&1
        echo Existing container deleted.
    ) else (
        echo Skipping deletion. Note: Starting the new one might fail if names collide.
    )
) else (
    echo No existing container named "%name%" found. Proceeding.
)

echo.

echo Starting the new server...

docker-compose run %build_arg% -d -p %port%:%port% -e THREADS=%threads% --name %name% base-server %port%
if errorlevel 1 (
    echo Error: Failed to start container.
    exit /b 1
) else (
    echo Success! Container "%name%" started on port %port%.
)

endlocal
exit /b 0
