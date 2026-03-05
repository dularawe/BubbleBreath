@echo off
echo Building Parent Login Service...
call mvn clean install -DskipTests

if %ERRORLEVEL% neq 0 (
    echo Build failed!
    exit /b %ERRORLEVEL%
)

echo Starting Parent Login Service...
call mvn spring-boot:run
