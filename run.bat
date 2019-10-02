@echo off

if exist node_modules/discord.js (
	goto main
) else (
	goto init
)

:init
echo Installing required files...
call npm i discord.js
goto main

:main
node ./bot.js
timeout /t 5 /nobreak>nul
goto main