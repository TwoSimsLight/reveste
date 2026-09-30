@echo off
title ReVeste - Subir para o GitHub
color 0B
echo ========================================================
echo       ENVIANDO CODIGO PARA O GITHUB (REVESTE)
echo ========================================================
echo.
echo Repositorio de destino:
echo https://github.com/TwoSimsLight/reveste.git
echo.
echo Enviando branch main para o GitHub...
echo (Se uma janela do navegador abrir, clique em 'Authorize' para entrar)
echo.
git push -u origin main
echo.
echo ========================================================
if %errorlevel% equ 0 (
    echo [SUCESSO] Codigo enviado com sucesso para o GitHub!
    echo Acesse: https://github.com/TwoSimsLight/reveste
) else (
    echo [ATENCAO] Houve um problema na autenticacao do GitHub.
    echo Verifique se voce esta logado no GitHub no seu navegador.
)
echo ========================================================
echo.
pause
