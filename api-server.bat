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

rem API container name
if "%name%"=="" (
    set "name=api-server"
    echo No name provided, using default name: "%name%"
) else (
    echo Using provided name: "%name%"
)

rem API port
set "default_port=3300"
if "%port%"=="" (
    echo No port provided, using default port: %default_port%
    set "port=%default_port%"
) else (
    echo Using provided port: %port%
)

rem Timeout
set "default_timeout=100"
if "%timeout%"=="" (
    echo No timeout provided, using default timeout: %default_timeout%
    set "timeout=%default_timeout%"
) else (
    echo Using provided timeout: %timeout%
)

rem JWT secret
set "default_jwt_secret=abcd"
if "%jwt_secret%"=="" (
    echo No jwt secret provided, using default jwt secret: %default_jwt_secret%
    set "jwt_secret=%default_jwt_secret%"
) else (
    echo Using provided jwt secret: %jwt_secret%
)

rem Base server container name
set "default_server_name=base-server"
if "%server_name%"=="" (
    set /p "server_name=Enter the base server container name (default: %default_server_name%): "
    if "%server_name%"=="" set "server_name=%default_server_name%"
    echo Using server name: "%server_name%"
else (
    echo Using provided server name: "%server_name%"
)

rem Base server port
set "default_server_port=3000"
if "%server_port%"=="" (
    set /p "server_port=Enter the base server port (default: %default_server_port%): "
    if "%server_port%"=="" set "server_port=%default_server_port%"
    echo Using base server port: %server_port%
else (
    echo Using provided base server port: "%server_port%"
)

echo.

rem ==============================
rem Check server status
rem ==============================

echo Checking for running server container named "%server_name%" on port %server_port%...

set "container_id="
for /f "delims=" %%I in ('docker ps -q -f "name=^%server_name%$"') do set "container_id=%%I"

if defined container_id (
    set "server_args="
    for /f "delims=" %%A in ('docker inspect --format "{{.Args}}" "%server_name%"') do set "server_args=%%A"

    echo Inspecting server args: !server_args!
    echo !server_args! | find "[%server_port%]" >nul 2>&1
    if errorlevel 1 (
        echo Warning: Server "%server_name%" is running, but configuration mismatches.
        echo     Expected Port: [%server_port%]
        echo     Found Args:    !server_args!
        set /p "replace_resp=Do you want to DELETE it and restart with port %server_port%? (y/n) "
        if /I "!replace_resp!"=="y" (
            echo Killing mismatched container...
            docker rm -f "%server_name%" >nul 2>&1
            set "container_id="
        ) else (
            echo Exiting. Please fix the port mismatch manually.
            exit /b 1
        )
    ) else (
        echo Found running server "%server_name%" active on port %server_port%.
    )
)

rem ==============================
rem Start server if needed
rem ==============================

if not defined container_id (
    echo Server container "%server_name%" is not currently running.
    set /p "response=Would you like to start the server now? (y/n) "
    if /I "!response!"=="y" (
        if not exist "%~dp0base-server.bat" (
            echo Error: Cannot find "%~dp0base-server.bat".
            exit /b 1
        )
        echo Launching base-server.bat...
        echo.

        rem Preserve current name/port
        set "_orig_name=%name%"
        set "_orig_port=%port%"

        set "name=%server_name%"
        set "port=%server_port%"
        call "%~dp0base-server.bat"

        rem Restore
        set "name=%_orig_name%"
        set "port=%_orig_port%"

        echo.
        echo base-server.bat executed. Verifying server status...

        set "container_check="
        for /f "delims=" %%I in ('docker ps -q -f "name=^%server_name%$"') do set "container_check=%%I"
        if not defined container_check (
            echo.
            echo Error: Attempted to start server, but it is still not running.
            exit /b 1
        )

        echo Server started successfully. Proceeding to API server...
    ) else (
        echo Exiting.
        exit /b 1
    )
)

echo.

rem ==============================
rem Delete existing API container if needed
rem ==============================

set "existing_api="
for /f "delims=" %%I in ('docker ps -aq -f "name=^%name%$"') do set "existing_api=%%I"

if defined existing_api (
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

echo Starting the new API server...

docker-compose run %build_arg% -d -p %port%:%port% -e JWT_SECRET=%jwt_secret% --name %name% api-server %server_name% %server_port% %port% %timeout%
if errorlevel 1 (
    echo Error: Failed to start API server.
    exit /b 1
) else (
    echo Success! Container "%name%" started on port %port%.
)

echo.
set /p "curl_response=Would you like to open a curl terminal to interact with the API server? (y/n) "
if /I "%curl_response%"=="y" (
    if exist "%~dp0api-console.bat" (
        echo Running api-console.bat...
        rem Pass name and port via environment
        set "_orig_name=%name%"
        set "_orig_port=%port%"
        call "%~dp0api-console.bat"
        set "name=%_orig_name%"
        set "port=%_orig_port%"
    ) else (
        echo api-console.bat not found. You can interact with the API using curl manually.
    )
) else (
    echo Exiting.
)

endlocal
exit /b 0
