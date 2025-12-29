# AI Interview Coach (ÖzgeLLM Final)

Bu proje, en son teknoloji **Yapay Zeka** ve **Web Teknolojilerini** birleştirerek oluşturulmuş, tamamen yerel makinenizde çalışan (Privacy-First) devrimsel bir **Sanal Mülakat Koçu** uygulamasıdır. 

Kullanıcılara gerçek bir İnsan Kaynakları uzmanı ile konuşuyormuş hissi vermek için **Llama 3** dil modeli, **Edge-TTS** ses sentezleme teknolojisi ve **React Three Fiber** tabanlı 3D avatar görselleştirmesi kullanır.

![Project Banner](https://via.placeholder.com/800x200?text=AI+Interview+Coach+Demo)

## 🌟 Öne Çıkan Özellikler

*   **🧠 Yerel ve Akıllı Zeka (Local LLM):** Meta'nın güçlü **Llama 3 8B Instruct** modelini (`Q4_K_M` quantization ile) kullanarak, internet bağlantısına ihtiyaç duymadan, KVKK uyumlu ve gizli bir mülakat deneyimi sunar.
*   **🗣️ Doğal Ses Deneyimi (TTS):** Microsoft Edge'in `en-US-AriaNeural` (veya Türkçe varyasyonları) motorunu kullanarak robottan uzak, vurgulamalı ve doğal bir konuşma sesi üretir.
*   **👤 3D Sanal Avatar:** `React Three Fiber` ve `Drei` kütüphaneleri ile güçlendirilmiş, tarayıcı üzerinde çalışan interaktif bir 3D karakter. (Konuşma esnasında dudak senkronizasyonu ve jestler - *geliştirme aşamasında*).
*   **⚡ Düşük Gecikme (Low Latency):** `FastAPI` ve asenkron (`async/await`) mimari sayesinde anlık cevaplar.
*   **📄 PDF Raporlama:** Mülakat sonunda performansınızı analiz eden çıktılar alabilme (`jspdf` entegrasyonu).
*   **🛠️ Kolay Kurulum:** Tek bir script (`tek_tikla_baslat.bat`) ile tüm servislerin ayağa kaldırılması.

## 🏗️ Mimari ve Teknolojiler

Proje, modern ve ölçeklenebilir bir **Microservice** (benzeri) mimari üzerine kurulmuştur:

### Backend (Python & AI)
Sunucu tarafı, yapay zeka işlemlerini yönetir ve frontend ile API aracılığıyla haberleşir.
*   **Framework:** `FastAPI` (Yüksek performanslı, asenkron web servisi).
*   **AI Engine:** `llama-cpp-python`. Bu kütüphane, C++ ile yazılmış `llama.cpp` projesinin Python bağlayıcısıdır ve modelin standart donanımlarda (CPU/GPU) şaşırtıcı derecede hızlı çalışmasını sağlar.
    *   *Context Window:* 4096 token (Uzun konuşmaları hatırlama kapasitesi).
    *   *Temperature:* 0.7 (Yaratıcı ama tutarlı yanıtlar).
*   **Ses Servisi:** `edge-tts` (Online kalitesinde offline ses üretimi).
*   **Sunucu:** `Uvicorn` (ASGI sunucusu).

### Frontend (User Interface)
Kullanıcı deneyiminin aktığı modern web arayüzü.
*   **Core:** `React 19` + `Vite` (Ultra hızlı geliştirme ve build süreci).
*   **Dil:** `TypeScript` (Tip güvenli ve hatasız kodlama).
*   **Styling:** `TailwindCSS v4` (Modern ve responsive tasarım sistemi).
*   **3D Graphics:** 
    *   `Three.js`: WebGL motoru.
    *   `@react-three/fiber`: React için Three.js renderlayıcısı.
    *   `@react-three/drei`: Hazır 3D bileşenleri (Kamera, Işık, Ortam).
*   **Durum Yönetimi:** React Hooks (`useState`, `useEffect`, `useRef`).

## 📂 Detaylı Proje Yapısı

```
ozgellmfinal/
├── backend/                  # ARKA UÇ (Logic & AI)
│   ├── main.py              # API Gateway (Endpoints: /chat)
│   ├── services.py          # LLM ve TTS servislerinin mantıksal katmanı
│   ├── requirements.txt     # Python kütüphane bağımlılıkları
│   └── __pycache__/         # Derlenmiş Python dosyaları
├── frontend/                 # ÖN YÜZ (UI & UX)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInterface.tsx  # Ana sohbet ekranı ve mantığı
│   │   │   ├── Avatar.tsx         # 3D Model dosyası ve animasyon kontrolü
│   │   │   └── Experience.tsx     # 3D sahne ayarları (Işık, Ortam)
│   │   ├── App.tsx          # Ana uygulama konteyneri
│   │   └── index.css        # Tailwind ve global stiller
│   ├── vite.config.ts       # Vite yapılandırması
│   └── package.json         # NPM paketleri ve scriptler
├── ai_interview_coach.ipynb # Model Ar-Ge ve Prompt Mühendisliği notları
├── LLM_Rapor.pdf            # Akademik/Teknik Proje Raporu
├── tek_tikla_baslat.bat     # Windows için Otomatik Başlatıcı
└── llama-3-8b-instruct.Q4_K_M.gguf # ÖNEMLİ: Büyük Dil Modeli Dosyası
```

## ⚙️ Kurulum ve Çalıştırma Rehberi

### Ön Gereksinimler
*   **İşletim Sistemi:** Windows 10/11 (Linux/Mac de destekler ancak `.bat` dosyası Windows içindir).
*   **Python:** Sürüm 3.10 veya üzeri.
*   **Node.js:** Sürüm 18 veya üzeri (Frontend için).
*   **RAM:** En az 8GB (16GB önerilir).
*   **Model Dosyası:** `llama-3-8b-instruct.Q4_K_M.gguf` dosyasının proje ana dizininde bulunduğundan emin olun.

### Adım Adım Kurulum

#### 1. Projeyi Klonlayın
```bash
git clone https://github.com/kullaniciadi/ozgellmfinal.git
cd ozgellmfinal
```

#### 2. Backend Bağımlılıklarını Yükleyin
```bash
cd backend
# Sanal ortam oluşturmanız önerilir (Opsiyonel)
python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt
cd ..
```
*> Not: CUDA destekli bir NVIDIA ekran kartınız varsa, `llama-cpp-python` kütüphanesini GPU desteğiyle kurarak performansı 10x artırabilirsiniz.*

#### 3. Frontend Bağımlılıklarını Yükleyin
```bash
cd frontend
npm install
cd ..
```

### 🚀 Uygulamayı Başlatma

**Yöntem A: Otomatik (Önerilen)**
Ana dizindeki `tek_tikla_baslat.bat` dosyasına çift tıklayın. Bu script:
1.  Python backend sunucusunu yeni bir pencerede başlatır.
2.  Node.js development sunucusunu yeni bir pencerede başlatır.
3.  Uygulamaya hazır olduğunda tarayıcı otomatik açılmazsa linkleri gösterir.

**Yöntem B: Manuel**
*Terminal 1 (Backend):*
```bash
cd backend
python main.py
```
*Backend `http://127.0.0.1:8000` adresinde çalışacaktır.*

*Terminal 2 (Frontend):*
```bash
cd frontend
npm run dev
```
*Frontend `http://localhost:5173` (veya terminalde belirtilen port) adresinde çalışacaktır.*

## � Sorun Giderme (Troubleshooting)

*   **"Model file not found" hatası:** `llama-3-8b-instruct.Q4_K_M.gguf` dosyasının tam olarak `ozgellmfinal` klasörünün içinde (backend veya frontend klasörünün içinde DEĞİL) olduğunu kontrol edin.
*   **Ses gelmiyor:** Tarayıcınızın "Otomatik Oynatma" (Autoplay) izinlerini kontrol edin. Genellikle sayfaya bir kez tıkladıktan sonra sesler aktif olur.
*   **C++ Build Tools Hatası:** Python paketlerini yüklerken hata alırsanız, bilgisayarınızda "Visual Studio C++ Build Tools"un yüklü olduğundan emin olun (özellikle `llama-cpp-python` için gereklidir).

## � Lisans ve İletişim

Bu proje açık kaynaklıdır ve eğitim amaçlı geliştirilmiştir. 
*   **Geliştirici:** [Adınız/Ekibiniz]
*   **Model Lisansı:** Meta Llama 3 Community License.

---
*Powered by Llama 3 & React Three Fiber*
