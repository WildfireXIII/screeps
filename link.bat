@echo off

rem get the path of the screeps.com folder from a local file linkpath.dat
set /p SCREEPSPATH=<linkpath.dat

mklink /J src %SCREEPSPATH%
