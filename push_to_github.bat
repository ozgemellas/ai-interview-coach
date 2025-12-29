@echo off
chcp 65001 > nul
echo ===================================================
echo AI Interview Coach - GitHub Yükleme Aracı
echo ===================================================

echo.
echo [1/6] Git kontrol ediliyor...
git --version > nul 2>&1
if %errorlevel% neq 0 (
    echo HATA: Git sistemde bulunamadi!
    echo Lutfen https://git-scm.com/downloads adresinden Git'i yukleyin.
    echo Yukledikten sonra bu dosyayi tekrar calistirin.
    pause
    exit /b
)
echo Git bulundu.

echo.
echo [2/6] Git deposu baslatiliyor...
if not exist .git (
    git init
    echo Repo baslatildi.
) else (
    echo Mevcut repo algilandi.
)

echo.
echo [3/6] Kullanici bilgileri ayarlaniyor...
git config user.email "mellasozge@gmail.com"
git config user.name "ozgemellas"

echo.
echo [4/6] Uzak sunucu baglantisi (Remote) ayarlaniyor...
git remote remove origin > nul 2>&1
git remote add origin https://github.com/ozgemellas/ai-interview-coach.git
echo Remote eklendi: https://github.com/ozgemellas/ai-interview-coach.git

echo.
echo [5/6] Dosyalar hazirlaniyor ve commit ediliyor...
REM .gitignore dosyasinin oldugundan emin ol
if not exist .gitignore (
    echo UYARI: .gitignore dosyasi bulunamadi!
)

git checkout -b main > nul 2>&1
git branch -M main

git add .
git commit -m "Proje dosyalari dökümü - AI Interview Coach"

echo.
echo [6/6] GitHub'a gönderiliyor (Push)...
echo.
echo Lutfen acilan pencerede GitHub giris bilgilerinizi girin veya yetki verin.
git push -u origin main

echo.
if %errorlevel% equ 0 (
    echo BASARILI: Proje basariyla GitHub'a yuklendi!
) else (
    echo HATA: Yukleme sirasinda bir sorun olustu.
)

pause
