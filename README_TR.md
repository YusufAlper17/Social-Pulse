# SocialPulse: Sosyal Medya Dinleme ve Analiz Platformu

<div align="right">
  <strong>Language / Dil:</strong> 
  <a href="README_TR.md">🇹🇷 Türkçe</a> | 
  <a href="README.md">🇬🇧 English</a>
</div>

Markaların ve bireylerin çevrimiçi varlıklarını takip etmek, duygu analizi yapmak ve sosyal medya konuşmalarından değerli içgörüler elde etmek için tasarlanmış modern, gerçek zamanlı bir sosyal medya izleme ve duygu analizi platformu.

**Hızlı Bağlantılar:** [📸 Ekran Görüntüleri](#ekran-görüntüleri) • [Özellikler](#özellikler) • [Kurulum](#kurulum) • [Kullanım](#kullanım) • [API Dokümantasyonu](#api-dokümantasyonu)

---

## İçindekiler

- [Hakkında](#hakkında)
- [Özellikler](#özellikler)
- [Teknoloji Yığını](#teknoloji-yığını)
- [Kurulum](#kurulum)
- [Yapılandırma](#yapılandırma)
- [Kullanım](#kullanım)
- [Ekran Görüntüleri](#ekran-görüntüleri)
- [Proje Yapısı](#proje-yapısı)
- [API Dokümantasyonu](#api-dokümantasyonu)
- [Katkıda Bulunma](#katkıda-bulunma)
- [Sorun Giderme](#sorun-giderme)
- [Lisans](#lisans)

---

## Hakkında

SocialPulse, haber siteleri, sosyal medya platformları, forumlar, bloglar ve mesajlaşma uygulamaları dahil olmak üzere birden fazla kaynaktan veri toplayan kapsamlı bir sosyal medya dinleme ve analiz platformudur. Platform, gerçek zamanlı izleme, duygu analizi ve kapsamlı analitikler için birleşik bir kontrol paneli sağlar.

### Temel Yetenekler

- Birden fazla medya kaynağından eşzamanlı gerçek zamanlı izleme
- Otomatik duygu sınıflandırması (Pozitif, Negatif, Nötr)
- Haber siteleri, sosyal medya, forumlar ve daha fazlasından çok kaynaklı veri toplama
- Kaynak, duygu durumu, tarih aralığı ve anahtar kelimelere göre gelişmiş filtreleme
- Grafikler ve çizelgelerle etkileşimli görsel analitikler
- Yapılandırılabilir anahtar kelime setleriyle çoklu hesap yönetimi

---

## Özellikler

### Temel Özellikler

- **Gerçek Zamanlı Veri Toplama**: Seçilen medya kaynaklarından otomatik olarak gönderi çekme ve güncelleme
- **Duygu Analizi**: Doğal dil işleme kullanarak yapay zeka destekli duygu sınıflandırması
- **Analitik Kontrol Paneli**: Etkileşimli grafikler ve görselleştirmelerle kapsamlı analitikler
- **Modern Kullanıcı Arayüzü**: Karanlık mod desteği ile temiz, minimal ve profesyonel arayüz
- **Çoklu Hesap Yönetimi**: Farklı yapılandırmalar ve anahtar kelime setleriyle birden fazla hesap yönetme
- **Duyarlı Tasarım**: Masaüstü, tablet ve mobil cihazlarda sorunsuz çalışan tamamen duyarlı tasarım
- **Çoklu Dil Desteği**: Türkçe ve İngilizce dil desteği
- **Performans Optimizasyonu**: Optimize edilmiş önbellekleme ve verimli veri işleme

### Desteklenen Medya Kaynakları

Platform aşağıdaki kategorilerden izleme desteği sunar:

**Haber Siteleri**
- Hürriyet, Sabah, Milliyet, CNN Türk, NTV, TRT Haber, Sözcü, T24, BirGün, Gazete Duvar, Evrensel, OdaTV, Bloomberg HT, Dünya Gazetesi, Mynet Finans

**Sosyal Medya Platformları**
- Twitter/X, Instagram, Facebook, TikTok, YouTube, LinkedIn, Snapchat, Pinterest

**Forum ve Sözlük Siteleri**
- Ekşi Sözlük, Uludağ Sözlük, İnci Sözlük, Kızlar Soruyor, DonanımHaber Forum, ForumTR, Technopat Sosyal, R10 Forum, ShiftDelete.Net Forum

**Video ve Yayın Platformları**
- YouTube, Twitch, Dailymotion, Vimeo, Periscope

**Blog ve İçerik Platformları**
- Medium, Blogger, WordPress, Onedio, Webtekno, Tumblr, Squarespace

**Mesajlaşma Platformları**
- Telegram, WhatsApp, Discord, Signal, Reddit

**Eğlence ve Magazin Siteleri**
- Onedio, Acunn, MedyaTava, RaniniTV, MagazinNot

### Analitik Özellikler

- **Zaman Çizelgesi Analizi**: Etkileşimli çubuk grafiklerle zaman içindeki bahsedilmeleri takip etme
- **Platform Dağılımı**: Pasta grafikler kullanarak farklı platformlardaki veri dağılımını görselleştirme
- **Duygu Durumu Analizi**: Detaylı görselleştirmelerle duygu dağılımını analiz etme
- **Platform Karşılaştırması**: Farklı medya kaynakları arasında performans metriklerini karşılaştırma
- **Kategori Analizi**: Verileri kategoriye göre analiz etme (Haber, Sosyal Medya, Forumlar, vb.)
- **Etkileşim Metrikleri**: Etkileşim oranları, erişim ve diğer temel performans göstergelerini takip etme

---

## Teknoloji Yığını

### Frontend

- **React 19.0.0**: Kullanıcı arayüzleri oluşturmak için modern UI kütüphanesi
- **TypeScript 4.9.5**: Geliştirilmiş kod kalitesi için tip güvenli JavaScript
- **Material-UI (MUI) 5.15.14**: Kapsamlı React bileşen kütüphanesi
- **Tailwind CSS 3.4.3**: Utility-first CSS framework
- **Recharts 2.15.1**: React bileşenleri üzerine kurulu kompozisyon grafik kütüphanesi
- **Chart.js 4.4.2**: Ek grafik yetenekleri
- **React Router 6.22.3**: React uygulamaları için bildirimsel yönlendirme

### Backend

- **Python 3.10+**: Yüksek seviye programlama dili
- **Flask 2.0.1**: Hafif WSGI web uygulama framework'ü
- **Flask-CORS 3.0.10**: Cross-Origin Resource Sharing işlemleri için Flask uzantısı
- **MySQL**: İlişkisel veritabanı yönetim sistemi (isteğe bağlı, gelecekteki özellikler için)
- **News API**: Haber verisi toplama için üçüncü taraf API
- **TextBlob**: Metinsel verileri işlemek için Python kütüphanesi
- **NLTK**: Doğal dil işleme için Doğal Dil Araç Seti

### Geliştirme Araçları

- **Node.js 20+**: JavaScript çalışma zamanı ortamı
- **npm**: Node paket yöneticisi
- **Git**: Dağıtılmış sürüm kontrol sistemi

---

## Kurulum

### Ön Gereksinimler

Başlamadan önce, sisteminizde aşağıdakilerin yüklü olduğundan emin olun:

- **Node.js** (v20 veya üzeri) - [İndir](https://nodejs.org/)
- **Python** (v3.10 veya üzeri) - [İndir](https://www.python.org/)
- **pip**: Python paket yöneticisi (genellikle Python ile birlikte gelir)
- **MySQL** (isteğe bağlı): Yalnızca veritabanı özelliklerini kullanmayı planlıyorsanız gerekir

### Adım 1: Depoyu Klonlayın

```bash
git clone https://github.com/yourusername/Social-Pulse.git
cd Social-Pulse
```

### Adım 2: Backend Kurulumu

1. Backend dizinine gidin:
```bash
cd backend
```

2. Sanal ortam oluşturun:
```bash
python3 -m venv venv
```

3. Sanal ortamı etkinleştirin:

   **macOS/Linux'ta:**
   ```bash
   source venv/bin/activate
   ```

   **Windows'ta:**
   ```bash
   venv\Scripts\activate
   ```

4. Python bağımlılıklarını yükleyin:
```bash
pip install -r requirements.txt
```

5. (İsteğe bağlı) MySQL veritabanını kurun:
```bash
mysql -u root -p < init_db.sql
```

6. Ortam değişkenlerini yapılandırın:
   Örnek ortam dosyasını kopyalayın ve değerlerinizle güncelleyin:
   ```bash
   cp .env.example .env
   ```
   Sonra `.env` dosyasını gerçek değerlerinizle düzenleyin:
   ```env
   NEWS_API_KEY=your_news_api_key_here
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=social_listening
   ```

### Adım 3: Frontend Kurulumu

1. Frontend dizinine gidin:
```bash
cd ../frontend
```

2. Node.js bağımlılıklarını yükleyin:
```bash
npm install
```

### Adım 4: Uygulamayı Başlatın

#### Seçenek 1: Başlatma Betiğini Kullanma (Önerilen)

Proje kök dizininden:
```bash
chmod +x start.sh
./start.sh
```

#### Seçenek 2: Manuel Başlatma

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # Windows'ta: venv\Scripts\activate
python app.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Uygulama şu adreslerde kullanılabilir olacaktır:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5004

---

## Yapılandırma

### Backend Yapılandırması

Aşağıdaki ayarları yapılandırmak için `backend/app.py` dosyasını düzenleyin:

- **Veritabanı Bağlantısı**: MySQL kimlik bilgilerinizle `DB_CONFIG` sözlüğünü güncelleyin
- **API Anahtarları**: `NEWS_API_KEY` değişkeninde News API anahtarınızı ayarlayın
- **CORS Ayarları**: CORS yapılandırmasında izin verilen kaynakları yapılandırın
- **Önbellek Süresi**: Önbellek sona erme süresini değiştirmek için `CACHE_DURATION` sabitini ayarlayın (varsayılan: 900 saniye)

### Frontend Yapılandırması

Yapılandırmak için `frontend/src/App.tsx` dosyasını düzenleyin:

- **API Uç Noktası**: Farklı bir portta çalışıyorsa backend API URL'sini güncelleyin
- **Tema Ayarları**: Renk şeması ve tema tercihlerini özelleştirin
- **Dil**: Varsayılan dili ayarlayın (Türkçe veya İngilizce)

### News API Anahtarı Kurulumu

Haber verilerinin çalışması için bir News API anahtarı gerekir. Anahtarı iki şekilde tanımlayabilirsiniz:

#### Seçenek 1: Arayüzden Girme (Önerilen)

1. [NewsAPI.org](https://newsapi.org/) adresinde ücretsiz bir hesap oluşturun
2. Kontrol panelinden API anahtarınızı alın
3. Uygulamada **Ayarlar → Genel → News API Anahtarı** bölümüne gidin
4. Anahtarınızı yapıştırıp **Kaydet**'e tıklayın
5. Kontrol paneline dönüp **Ara** butonuna basın

Anahtar tarayıcınızda saklanır ve backend'e `X-News-Api-Key` header'ı ile gönderilir.

#### Seçenek 2: Backend Ortam Değişkeni

Sunucu tarafında varsayılan bir anahtar tanımlamak isterseniz `backend/.env` dosyanıza ekleyin:

```bash
NEWS_API_KEY=your_news_api_key_here
```

Vercel backend deploy'u için aynı değişkeni Vercel dashboard'da **Project Settings → Environment Variables** bölümüne ekleyin.

---

## Kullanım

### Başlangıç

1. Yukarıdaki kurulum talimatlarını takip ederek uygulamayı başlatın

2. Web tarayıcınızı açın ve `http://localhost:3000` adresine gidin

3. Medya Kaynaklarını Seçin:
   - Kontrol panelindeki "Medya Kaynakları" düğmesine tıklayın
   - Kategorize edilmiş listeden izlemek istediğiniz kaynakları seçin
   - Seçilen kaynaklar "Seçili Medya Kaynakları" bölümünde görünecektir

4. Anahtar Kelimeleri Yapılandırın (İsteğe Bağlı):
   - Ayarlar → Hesap Yönetimi'ne gidin
   - Bir hesap seçin veya oluşturun
   - İzlemek istediğiniz anahtar kelimeleri ekleyin
   - Bu anahtar kelimeler gönderileri filtrelemek ve aramak için kullanılacaktır

5. News API Anahtarını Girin:
   - Ayarlar → Genel → News API Anahtarı bölümüne gidin
   - NewsAPI.org anahtarınızı kaydedin

6. Gönderileri Arayın:
   - Seçilen kaynaklardan gönderileri çekmek için "Ara" düğmesine tıklayın
   - Gönderiler duygu analizi ile ana kontrol panelinde görünecektir

### Kontrol Paneli Özellikleri

- **Kaynağa Göre Filtreleme**: Belirli kaynaklara göre gönderileri filtrelemek için seçili medya kaynağı çiplerine tıklayın
- **Duygu Durumuna Göre Filtreleme**: "Duygu Durumu Filtrele" düğmesini kullanarak gönderileri duygu durumuna göre filtreleyin (Pozitif, Negatif, Nötr)
- **Gönderi Detaylarını Görüntüleme**: Orijinal gönderiyi yeni bir sekmede açmak için "Kaynağa Git"e tıklayın
- **İçerik Bildirme**: Uygunsuz veya zararlı içeriği bildirmek için "Bildir" düğmesini kullanın

### Analitikler

Aşağıdakilere erişmek için "Analiz" bölümüne gidin:

- **Zaman Çizelgesi Analizi**: Etkileşimli çubuk grafiklerle zaman içindeki bahsedilmeleri görüntüleme
- **Platform Dağılımı**: Pasta grafikler kullanarak farklı platformlardaki veri dağılımını görme
- **Duygu Analizi**: Detaylı görselleştirmelerle duygu durumu analizini analiz etme
- **Platform Karşılaştırması**: Farklı medya kaynakları arasında performans metriklerini karşılaştırma
- **Kategori Analizi**: Verileri kategoriye göre analiz etme (Haber, Sosyal Medya, Forumlar, vb.)

### Ayarlar

Kenar çubuğu navigasyonu aracılığıyla ayarlara erişin:

- **Genel**: Tema tercihlerini (açık/koyu mod) ve dil ayarlarını yapılandırma
- **Hesap Yönetimi**: Farklı anahtar kelime yapılandırmalarıyla hesapları ekleme, düzenleme veya silme
- **Bildirimler**: E-posta ve push bildirim tercihlerini yapılandırma
- **Güvenlik**: İki faktörlü kimlik doğrulama ve şifre ayarlarını yönetme

---

## Ekran Görüntüleri

### 1. Analitik Paneli
![Analitik Paneli](screenshots/01-analytics.png)
*Zaman çizelgesi analizi, platform dağılımı ve duygu analizi grafikleriyle kapsamlı analitik paneli*

### 2. Ayarlar Sayfası
![Ayarlar Sayfası](screenshots/02-settings.png)
*Anahtar kelimeler ve yönetim seçenekleriyle hesap listesini gösteren hesap yönetimi arayüzü*

### 3. Kontrol Paneli - Karanlık Mod
![Kontrol Paneli Karanlık Mod](screenshots/03-dashboard-dark.png)
*Seçili medya kaynaklarını ve duygu analizi ile gönderileri gösteren karanlık moddaki ana kontrol paneli*

### 4. Kontrol Paneli - Açık Mod
![Kontrol Paneli Açık Mod](screenshots/04-dashboard-light.png)
*Gönderiler, medya kaynakları ve yazar bilgilerini gösteren açık moddaki ana kontrol paneli*

### 5. Medya Kaynağı Seçimi
![Medya Kaynağı Seçimi](screenshots/05-media-sources.png)
*Kategorilere göre düzenlenmiş medya kaynağı seçim arayüzü (Haber Siteleri, Sosyal Medya, Forumlar, vb.)*

> **Not**: Ekran görüntülerinizi `screenshots/` dizinine aşağıdaki dosya adlarıyla ekleyin:
> - `01-analytics.png` - Analitik paneli ekran görüntüsü
> - `02-settings.png` - Ayarlar sayfası ekran görüntüsü
> - `03-dashboard-dark.png` - Karanlık mod kontrol paneli ekran görüntüsü
> - `04-dashboard-light.png` - Açık mod kontrol paneli ekran görüntüsü
> - `05-media-sources.png` - Medya kaynağı seçimi ekran görüntüsü

---

## Proje Yapısı

```
SocialPulse/
├── backend/
│   ├── app.py                 # Ana Flask uygulaması
│   ├── requirements.txt       # Python bağımlılıkları
│   ├── init_db.sql           # Veritabanı başlatma betiği
│   └── venv/                 # Python sanal ortamı
├── frontend/
│   ├── public/               # Statik dosyalar ve varlıklar
│   ├── src/
│   │   ├── components/       # React bileşenleri
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Analytics.tsx
│   │   │   ├── Settings.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── ...
│   │   ├── App.tsx           # Ana uygulama bileşeni
│   │   └── index.tsx         # Uygulama giriş noktası
│   ├── package.json          # Node.js bağımlılıkları ve betikler
│   └── tsconfig.json         # TypeScript yapılandırması
├── screenshots/              # Uygulama ekran görüntüleri
├── start.sh                 # Uygulama başlatma betiği
└── README.md                # Proje dokümantasyonu
```

---

## API Dokümantasyonu

### Uç Noktalar

#### GET `/api/posts`

Sağlanan filtreler temelinde seçilen medya kaynaklarından gönderileri getirir.

**Sorgu Parametreleri:**
- `sources[]` (dizi, isteğe bağlı): Filtrelemek için kaynak ID'leri dizisi (örn. `sources[]=hurriyet&sources[]=sabah`)
- `keywords[]` (dizi, isteğe bağlı): Aranacak anahtar kelimeler dizisi
- `search` (string, isteğe bağlı): Genel arama sorgu dizisi

**Yanıt:**
```json
[
  {
    "id": "post_id",
    "title": "Gönderi Başlığı",
    "sourceId": "hurriyet",
    "content": "Gönderi içeriği...",
    "author": {
      "name": "Yazar Adı",
      "avatar": "/avatars/default.png",
      "followers": 1000,
      "posts": 500
    },
    "sentiment": "positive",
    "date": "2025-11-11T15:43:00Z",
    "sourceUrl": "https://..."
  }
]
```

#### GET `/api/sources`

Tüm mevcut medya kaynaklarının listesini alır.

**Yanıt:**
```json
{
  "sources": [
    {
      "id": "hurriyet",
      "name": "Hürriyet",
      "logo": "/logos/hurriyet.png"
    }
  ]
}
```

#### GET `/api/search`

Bir sorgu dizisi kullanarak gönderileri arar.

**Sorgu Parametreleri:**
- `search` (string, gerekli): Arama sorgu dizisi
- `sources[]` (dizi, isteğe bağlı): Arama kapsamını sınırlamak için kaynak ID'leri dizisi

**Yanıt:**
`/api/posts` ile aynı format

---

## Katkıda Bulunma

SocialPulse'a katkıda bulunmayı memnuniyetle karşılıyoruz. Lütfen şu yönergeleri izleyin:

1. Depoyu GitHub hesabınıza **çatallayın**

2. **Bir özellik dalı oluşturun**:
   ```bash
   git checkout -b feature/ozellik-adi
   ```

3. **Değişikliklerinizi yapın** ve tüm kodun mevcut stil yönergelerini takip ettiğinden emin olun

4. **Değişikliklerinizi test edin** göndermeden önce kapsamlı bir şekilde

5. **Değişikliklerinizi net, açıklayıcı commit mesajlarıyla commit edin**:
   ```bash
   git commit -m 'Özellik ekle: değişikliklerin açıklaması'
   ```

6. **Dalınıza push edin**:
   ```bash
   git push origin feature/ozellik-adi
   ```

7. Değişikliklerinizin ayrıntılı bir açıklamasıyla **Bir Pull Request açın**

### Geliştirme Yönergeleri

- Mevcut kod stili ve kurallarını takip edin
- Anlamlı commit mesajları yazın, geleneksel commit formatını takip edin
- Karmaşık mantık ve algoritmalar için yorumlar ekleyin
- Göndermeden önce tüm testlerin geçtiğinden emin olun
- Yeni özellikler veya API değişiklikleri için dokümantasyonu güncelleyin
- Pull request'leri tek bir özellik veya düzeltmeye odaklı tutun

---

## Sorun Giderme

### Yaygın Sorunlar

**Backend başlamıyor:**
- Python sanal ortamının etkinleştirildiğinden emin olun
- 5004 portunun zaten kullanılmadığını doğrulayın
- Tüm bağımlılıkların düzgün şekilde yüklendiğini kontrol edin
- Belirli hata mesajları için backend loglarını inceleyin

**Frontend başlamıyor:**
- Node.js v20 veya üzerinin yüklü olduğundan emin olun
- `node_modules` dizinini silin ve `npm install` komutunu tekrar çalıştırın
- 3000 portunun zaten kullanılmadığını doğrulayın
- JavaScript hataları için tarayıcı konsolunu kontrol edin

**API hataları:**
- News API anahtarının doğru ve aktif olduğunu doğrulayın
- API hız sınırlarını ve kotayı kontrol edin
- Backend sunucusunun çalıştığından ve erişilebilir olduğundan emin olun
- Ağ bağlantısını ve güvenlik duvarı ayarlarını gözden geçirin

**Veritabanı bağlantı hataları:**
- MySQL sunucusunun çalıştığını doğrulayın
- Yapılandırmadaki veritabanı kimlik bilgilerini kontrol edin
- Veritabanının var olduğundan ve kullanıcının uygun izinlere sahip olduğundan emin olun
- Belirli hatalar için veritabanı bağlantı loglarını inceleyin

---

## Lisans

Bu proje MIT Lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

## Yazarlar

- **Adınız** - İlk çalışma - [GitHub Profili](https://github.com/yourusername)

---

## Depo Açıklaması

**Social-Pulse**, modern, gerçek zamanlı bir sosyal medya dinleme ve duygu analizi platformudur. Haber siteleri, sosyal medya platformları, forumlar ve bloglardaki bahsedilmeleri izleyin. Otomatik duygu sınıflandırması, etkileşimli analitik kontrol panelleri, çoklu hesap yönetimi ve kapsamlı filtreleme özellikleri içerir. React, TypeScript, Flask ve Python ile geliştirilmiştir.

---

## Teşekkürler

- Haber verisi toplama hizmetleri sağladığı için NewsAPI.org
- Kapsamlı React bileşen kütüphanesi için Material-UI ekibi
- Bu projeyi geliştirmeye yardımcı olan tüm katkıda bulunanlar ve kullanıcılar

---

## İletişim

Sorular, öneriler, hata raporları veya destek için lütfen GitHub deposunda bir issue açın.

---

