@echo off
:a
node ./bot.js
timeout /t 5 /nobreak>nul
goto a