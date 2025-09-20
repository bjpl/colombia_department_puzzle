@echo off
REM Claude-Flow & Ruv-Swarm Progression Analysis Script for Windows
REM Uses npx to run the tools without installing them as dependencies

echo ========================================
echo Colombia Puzzle Game - Flow Analysis
echo Using Claude-Flow and Ruv-Swarm
echo ========================================
echo.

REM Test claude-flow availability
echo Testing Claude-Flow...
npx claude-flow@latest --version

echo.
echo Testing Ruv-Swarm...
npx ruv-swarm@latest --version

echo.
echo ========================================
echo Starting Progression Analysis
echo ========================================
echo.

REM Quick analysis of the current implementation
echo Analyzing current NextChallengeRecommender...
npx claude-flow@latest analyze --file "src/components/NextChallengeRecommender.tsx" --check-progression

echo.
echo Checking for dead-ends with ruv-swarm...
npx ruv-swarm@latest validate --file "src/components/NextChallengeRecommender.tsx" --pattern critical --no-dead-ends

echo.
echo Analysis Complete!
pause