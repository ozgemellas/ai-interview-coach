# AI Interview Coach (ÖzgeLLM Final)

Bu proje, en son teknoloji **Yapay Zeka** ve **Web Teknolojilerini** birleştirerek oluşturulmuş, tamamen yerel makinenizde çalışan (Privacy-First) devrimsel bir **Sanal Mülakat Koçu** uygulamasıdır. 

Kullanıcılara gerçek bir İnsan Kaynakları uzmanı ile konuşuyormuş hissi vermek için **Llama 3** dil modeli, **Edge-TTS** ses sentezleme teknolojisi ve **React Three Fiber** tabanlı 3D avatar görselleştirmesi kullanır.

![Sohbet Arayüzü](final_demo_chat.png)

## 🌟 Öne Çıkan Özellikler

*   **🧠 Yerel ve Akıllı Zeka (Local LLM):** Meta'nın güçlü **Llama 3 8B Instruct** modelini (`Q4_K_M` quantization ile) kullanarak, internet bağlantısına ihtiyaç duymadan, KVKK uyumlu ve gizli bir mülakat deneyimi sunar.
*   **🗣️ Doğal Ses Deneyimi (TTS):** Microsoft Edge'in `en-US-AriaNeural` (veya Türkçe varyasyonları) motorunu kullanarak robottan uzak, vurgulamalı ve doğal bir konuşma sesi üretir.
*   **👤 3D Sanal Avatar:** `React Three Fiber` ve `Drei` kütüphaneleri ile güçlendirilmiş, tarayıcı üzerinde çalışan interaktif bir 3D karakter.
*   **⚡ Düşük Gecikme (Low Latency):** `FastAPI` ve asenkron (`async/await`) mimari sayesinde anlık cevaplar.
*   **📄 PDF Raporlama:** Mülakat sonunda performansınızı analiz eden çıktılar alabilme (`jspdf` entegrasyonu).

![Mülakat Analizi](transcript_view.png)
*Mülakat sonrası detaylı analiz ve transkript ekranı.*

## 🏗️ Mimari ve Teknolojiler

Proje, modern ve ölçeklenebilir bir **Microservice** (benzeri) mimari üzerine kurulmuştur:

![Sistem Mimarisi](architecture.png)

### Backend (Python & AI)
Sunucu tarafı, yapay zeka işlemlerini yönetir ve frontend ile API aracılığıyla haberleşir.
*   **Framework:** `FastAPI` (Yüksek performanslı, asenkron web servisi).
*   **AI Engine:** `llama-cpp-python` (Llama.cpp Python bindings).
    *   *Context Window:* 4096 token.
    *   *Temperature:* 0.7.
*   **Ses Servisi:** `edge-tts`.
*   **Sunucu:** `Uvicorn`.

### Frontend (User Interface)
Kullanıcı deneyiminin aktığı modern web arayüzü.
*   **Core:** `React 19` + `Vite`.
*   **Dil:** `TypeScript`.
*   **Styling:** `TailwindCSS v4`.
*   **3D Graphics:** `Three.js`, `@react-three/fiber`, `@react-three/drei`.

## 📂 Detaylı Proje Yapısı

```
ozgellmfinal/
├── backend/                  # ARKA UÇ (Logic & AI)
│   ├── main.py              # API Gateway (Endpoints: /chat)
│   ├── services.py          # LLM ve TTS servislerinin mantıksal katmanı
│   └── requirements.txt     # Python kütüphane bağımlılıkları
├── frontend/                 # ÖN YÜZ (UI & UX)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInterface.tsx  # Ana sohbet ekranı
│   │   │   ├── Avatar.tsx         # 3D Model dosyası
│   │   │   └── Experience.tsx     # 3D sahne ayarları
│   │   └── App.tsx
│   ├── vite.config.ts       # Vite yapılandırması
│   └── package.json         # NPM paketleri
├── ai_interview_coach.ipynb # Model Ar-Ge ve Prompt Mühendisliği notları
├── LLM_Rapor.pdf            # Akademik/Teknik Proje Raporu
├── tek_tikla_baslat.bat     # Windows için Otomatik Başlatıcı
└── llama-3-8b-instruct.Q4_K_M.gguf # ÖNEMLİ: Büyük Dil Modeli Dosyası
```

## ⚙️ Kurulum ve Çalıştırma Rehberi

### Ön Gereksinimler
*   **OS:** Windows 10/11.
*   **Runtime:** Python 3.10+, Node.js 18+.
*   **Donanım:** Min 8GB RAM.
*   **Dosya:** `llama-3-8b-instruct.Q4_K_M.gguf` ana dizinde olmalı.

### Adım Adım Kurulum

#### 1. Projeyi Klonlayın
```bash
git clone https://github.com/kullaniciadi/ozgellmfinal.git
cd ozgellmfinal
```

#### 2. Backend Kurulumu
```bash
cd backend
pip install -r requirements.txt
cd ..
```

#### 3. Frontend Kurulumu
```bash
cd frontend
npm install
cd ..
```

### 🚀 Uygulamayı Başlatma

**Otomatik Başlatma:**
`tek_tikla_baslat.bat` dosyasına çift tıklayın.

**Manuel Başlatma:**
*   Backend: `cd backend && python main.py`
*   Frontend: `cd frontend && npm run dev`

## 📊 Dokümantasyon
Modelin eğitim süreci ve teorik altyapısı için `LLM_Rapor.pdf` ve `ai_interview_coach.ipynb` dosyalarını inceleyebilirsiniz.

## 🔒 Lisans ve İletişim

*   **Geliştirici:** [Özge Mellaş]
*   **Lisans:** MIT & Meta Llama 3 Community License.

---
*Powered by Llama 3 & React Three Fiber*
