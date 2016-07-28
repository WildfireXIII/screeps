@echo off

rem get the path of the screeps.com folder from a local file pubpath.dat
set /p SCREEPSPATH=<pubpath.dat

rem delete all current folders (so can be replaced)
pushd %SCREEPSPATH%
rd /s /q .\
popd 
 
xcopy /sy "src\*" %SCREEPSPATH%
