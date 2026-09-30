@echo off
title ReVeste - Servidor Local
color 0A
echo ========================================================
echo       INICIANDO SERVIDOR REVESTE (MODA ECOLOGICA)
echo ========================================================
echo.
echo Iniciando banco de dados SQLite e servidor Express na porta 3000...
echo.
echo - Landing Page: http://localhost:3000
echo - Painel Admin: http://localhost:3000/admin
echo.
echo Pressione Ctrl+C para encerrar o servidor quando desejar.
echo ========================================================
echo.

start http://localhost:3000

node server/index.js
pause
