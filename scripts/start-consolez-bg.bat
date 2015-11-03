@echo off

echo "Starting jobs that should run forever"

IF EXIST "%MONGODB%\mongod.lock" (
   echo Using mongoDB that is already running
   %CONSOLEZ% ^
	   -t server  -d %WORK% ^
	   -t browser -d %WORK% ^
	   -t jshint  -d %WORK% ^
	   -t test    -d %WORK%

   GOTO END
)

echo MongoDB is: %MONGODB%

%CONSOLEZ% ^
   -t DB      -d %MONGODB% ^
   -t server  -d %WORK% ^
   -t browser -d %WORK% ^
   -t jshint  -d %WORK% ^
   -t test    -d %WORK%

:END

exit
