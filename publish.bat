@echo off
rem C:\Users\Nathan\AppData\Local\Screeps\scripts\screeps.com 


rem get the path of the screeps.com folder from a local file pubpath.dat
set /p SCREEPSPATH=<pubpath.dat

rem delete everything that's currently there, except for the .sync file, cause that looks important
pushd %SCREEPSPATH%
copy .sync ..\ 
del /qs *
popd 
 
xcopy /sy "src\*" %SCREEPSPATH%
