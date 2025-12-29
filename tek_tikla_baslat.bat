@echo off
echo Proje Baslatiliyor...
echo.

echo 1. Backend Baslatiliyor...
start cmd /k "cd backend && python main.py"

echo 2. Frontend Baslatiliyor...
start cmd /k "cd frontend && npm run dev"

echo.
echo Her iki servis de ayri pencerelerde acildi.
echo Bu pencereyi kapatabilirsiniz.
pause
