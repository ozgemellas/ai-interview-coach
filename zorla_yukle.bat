@echo off
chcp 65001 > nul
echo ===================================================
echo AI Interview Coach - GUNCELLEME VE YUKLEME
echo ===================================================

echo.
echo [1/4] Git ayarlari yapiliyor...
git config user.email "mellasozge@gmail.com"
git config user.name "ozgemellas"

echo.
echo [2/4] Yeni degisiklikler algilaniyor...
git add .

echo.
echo [3/4] Degisiklikler paketleniyor (Commit)...
git commit -m "Update README with images and fix details"

echo.
echo [4/4] GitHub'a gonderiliyor (Push)...
echo.
git push -u origin main --force

echo.
if %errorlevel% equ 0 (
    echo BASARILI: Guncel dosyalar GitHub'a yuklendi!
) else (
    echo HATA: Yukleme sirasinda bir sorun olustu.
)

pause
