@ECHO off
IF "%1"=="" (
	SET port=1234
) ELSE (
	SET port=%1
)
http-server .\TOS -p %port%
@echo on