@echo off

echo "Starting jobs that should run forever"

set cmd="%CONSOLEZ%" -c scripts\consoleZ\bg.xml

REM add a mongoDB tab unless mongo's already running.
set size=0
IF EXIST "%MONGODB%\mongod.lock" (
   CALL :setsize "%MONGODB%\mongod.lock"
)
IF %size% EQU 0 (
   set cmd=%cmd% -t Mongo -d %MONGODB%
   echo MongoDB is: %MONGODB%
) ELSE (
   echo "Using mongoDB that is already running"
   echo If the db has crashed, and the lock is still there, try this:
   echo rm %MONGODB%\mongod.lock
   echo mongod --dbpath %MONGODB%
)

REM simply add all of these tabs
set cmd=%cmd% -t server
set cmd=%cmd% -t browser
set cmd=%cmd% -t jshint
set cmd=%cmd% -t serverTests
set cmd=%cmd% -t webTests

echo Running: %cmd%
%cmd%

exit

:setsize
set size=%~z1
goto :eof
