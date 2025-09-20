@echo off
REM Fix for ruv-swarm path issue on Windows

echo Fixing ruv-swarm data directory issue...

REM Create local data directory for ruv-swarm
mkdir .ruv-swarm\data 2>nul

REM Set environment variable to use local directory
set RUV_SWARM_DATA_DIR=%CD%\.ruv-swarm\data

echo Data directory created at: %RUV_SWARM_DATA_DIR%

REM Now run ruv-swarm with the fix
echo Initializing ruv-swarm with local data directory...
npx ruv-swarm@latest init mesh 5

echo.
echo Spawning agents for progression analysis...
npx ruv-swarm@latest spawn researcher "progression-analyzer"
npx ruv-swarm@latest spawn coder "flow-fixer"
npx ruv-swarm@latest spawn analyst "dead-end-detector"

echo.
echo Ruv-swarm initialized successfully!
pause