# 💼 Cari & Kasa Finance — Kurumsal Cari, Kasa & Stok Yönetim Sistemi

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Electron](https://img.shields.io/badge/Electron-33.0-47848F.svg)](https://www.electronjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg)](https://nextjs.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-SQLite-C5F74F.svg)](https://orm.drizzle.team/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8.svg)](https://tailwindcss.com/)
[![pnpm Workspace](https://img.shields.io/badge/pnpm-Monorepo-F69220.svg)](https://pnpm.io/)
[![Docker](https://img.shields.io/badge/Docker-Supported-2496ED.svg)](https://www.docker.com/)

**Cari & Kasa Finance**, genel özel firmalar, imalathaneler, tedarikçiler, ticaret, perakende ve hizmet sektörleri için geliştirilmiş; **Çift Taraflı Yevmiye Kaydı Motoru (Double-Entry Bookkeeping)** tabanlı kurumsal masaüstü ve web finans yönetim sistemidir.

---

## 🌟 Öne Çıkan Özellikler

- ⚖️ **%100 Çift Taraflı Yevmiye Kayıt Motoru**: Her işlem arka planda `SUM(Borç) === SUM(Alacak)` eşitliğiyle yevmiye maddesi oluşturur. Bakiyeler canlı SQL toplamlarıyla hesaplanır.
- 🏢 **Genel Özel Firma & Sektör Esnekliği**: Firma ünvanı ve sektör amblemi (`Genel Şirket`, `Mobilya & İmalat`, `Lojistik`, `Ticaret`, `Hizmet`, `Sanayi`, `Finans`, `E-Ticaret`) özelleştirilebilir.
- 📦 **Stok & Ürün Yönetim Modülü**: Hammadde, mamul, yarı mamul ve aksesuar stok kartları; alış/satış fiyatları, depo stok miktarları, kritik stok uyarıları ve tarihsel hareket ekstreleri.
- 📄 **Dinamik Kurumsal Antetli PDF & Excel Raporlama**: Firma logonuz ve bilgilerinizi içeren kurumsal antetli PDF ekstreleri, mizan dökümleri ve kaşe/imza bloklu resmi evrak çıktısı.
- 💾 **Özel `.cari` Şirket Dosya Formatı**: Excel şablonu gibi firmanıza ait tüm veritabanını tek tıkla `.cari` dosyası olarak yedekleme ve geri yükleme.
- 📅 **Mali & Bütçe Yılı Filtreleme (`N`, `N-1` .. `N-5`)**: Cari çalışma yılı ($N$) ve 5 yıl geriye dönük ($N-1 \dots N-5$) bütçe ve hesap filtrelemesi.
- 🌓 **Tam Light / Dark Tema Desteği**: Aydınlık ve karanlık modlar arasında anında akıcı geçiş.
- 🔒 **Güvenlik PIN Kodu Kilidi**: Ekran kilitleme ve PIN kodu koruması.

---

## 🏛️ Monorepo Mimari Yapısı

Proje `pnpm workspace` mimarisinde 4 temel pakete ayrılmıştır:

```
cari-finance-desktop/
├── pnpm-workspace.yaml               # Workspace tanım dosyası
├── package.json                      # Kök dizin komutları ve pnpm bağımlılık yönetimi
├── docker-compose.yml                # Docker konteyner orkestrasyonu
├── Dockerfile                        # Multi-stage Next.js Web Dockerfile
│
├── apps/
│   ├── desktop/                      # (@cari-finance/desktop) Electron 33 + React + Vite Masaüstü Uygulaması
│   └── web/                          # (@cari-finance/web) Next.js 14 App Router Web Uygulaması & REST API
│
└── packages/
    ├── domain/                       # (@cari-finance/domain) Saf Muhasebe Kuralları, Para Birimi & Tip Tanımları
    └── db/                           # (@cari-finance/db) Drizzle ORM SQLite Veritabanı Şemaları
```

---

## 🚀 Hızlı Başlangıç & Kurulum

### Ön Gereksinimler
- **Node.js** `>= 18.0.0`
- **pnpm** `>= 9.0.0`

### 1. Bağımlılıkları Yükleme
```bash
git clone https://github.com/ilyas-bozdemir/cari-finance-desktop.git
cd cari-finance-desktop
pnpm install
```

### 2. Geliştirme Modunda Çalıştırma

- **Masaüstü Electron Uygulaması**:
  ```bash
  pnpm dev:desktop
  # veya
  pnpm dev
  ```

- **Next.js Web Uygulaması & REST API**:
  ```bash
  pnpm dev:web
  ```

### 3. Tüm Paketleri Derleme (Production Build)
```bash
pnpm build
```

### 4. Windows `.exe` Yükleyicisi Paketi Oluşturma
```bash
pnpm package
```
*Çıktı dosyası `apps/desktop/release/` dizininde oluşturulur.*

---

## 🐳 Docker Yapılandırması

Next.js Web ve API sunucusunu Docker konteyneri olarak tek komutla başlatabilirsiniz:

```bash
# Docker İmajını Derleme
pnpm docker:build

# Konteyneri Başlatma (Port 3000)
pnpm docker:up
```

veya doğrudan Docker Compose ile:

```bash
docker compose up -d --build
```
Uygulama **`http://localhost:3000`** adresinde çalışmaya başlar.

---

## 📊 Çift Taraflı Yevmiye Hesap Planı

Sistem standart tekdüzen hesap planı mantığında çalışır:

| Hesap Kodu | Hesap Adı | Türü | Borç Çalışma | Alacak Çalışma |
| :--- | :--- | :--- | :--- | :--- |
| **`100`** | Kasa Hesabı | Varlık (Asset) | Para Girişi | Para Çıkışı |
| **`102`** | Banka Hesapları | Varlık (Asset) | Havale / Gelen | Gönderilen Ödeme |
| **`120`** | Müşteri Cari Hesapları | Varlık (Asset) | Vadeli Satış | Tahsilat Alınması |
| **`153`** | Ticari Mallar / Stok | Varlık (Asset) | Mal Alımı | Mal Satışı |
| **`320`** | Tedarikçi & Satıcılar | Kaynak (Liability) | Ödeme Yapılması | Mal / Hizmet Alımı |
| **`500`** | Ortak Cari Hesapları | Özkaynak (Equity) | Ortak Para Çekme | Ortak Para Yatırma |
| **`600`** | Yurtiçi Satış Gelirleri | Gelir (Revenue) | - | Satış Hasılatı |
| **`770`** | Genel Yönetim Giderleri | Gider (Expense) | Harcama / Fatura | - |

---

## 🤝 Katkıda Bulunma & Lisans

Bu proje **MIT Lisansı** ile lisanslanmıştır.  
Geliştirici: **İlyas Bozdemir**
