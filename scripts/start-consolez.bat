@echo off

SET DIRNAME=%~dp0

REM Make sure %MONGODB% is set
IF NOT DEFINED MONGODB ( 
    setx MONGODB=%USERPROFILE%\Programming\mongoDBs\common
)

IF NOT EXIST %MONGODB% (
  echo This mongodb doesn't exist: %MONGODB%
  GOTO END
)

REM Make sure we know where various tools live.
IF NOT DEFINED CONSOLEZ (
   set CONSOLEZ=C:\Users\Mikael\Programming\Tools\ConsoleZ\Console.exe
)
IF NOT DEFINED PYCMDEXE (
   setx PYCMDEXE %USERPROFILE%\Programming\Tools\PyCmd\PyCmd.exe
)
IF NOT DEFINED GRUNTCMD (
   setx GRUNTCMD %USERPROFILE%\AppData\Roaming\npm\grunt.cmd
)

echo Running in: %CD%
REM Make sure %WORK% is set
IF NOT DEFINED WORK (
    set WORK=%CD%
)

IF NOT EXIST %WORK% (
  echo This WORK doesn't exist: %WORK%
  GOTO END
)

REM - give the DB enough time to start befor launching servers
REM - give the servers enough time to start before launching the tests, jshint, and browser
REM - FIXME - need to add jshint
REM - FIXME - need to finish test

START /MIN %DIRNAME%start-consolez-bg.bat
START /MIN %DIRNAME%start-consolez-int.bat
START /b emacs

:END

exit