# 💼 Cari & Kasa Finance — Pratik Cari, Kasa, Banka & Finans Takip Sistemi

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Electron](https://img.shields.io/badge/Electron-33.0-47848F.svg)](https://www.electronjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg)](https://nextjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED.svg)](https://www.docker.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-SQLite-C5F74F.svg)](https://orm.drizzle.team/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8.svg)](https://tailwindcss.com/)
[![pnpm Workspace](https://img.shields.io/badge/pnpm-Monorepo-F69220.svg)](https://pnpm.io/)

**Cari & Kasa Finance**, işletmeler, imalathaneler, perakende ve hizmet sektörleri için tasarlanmış; karmaşık muhasebe terimlerinden arındırılmış **Pratik Cari, Kasa, Banka ve İşletme Finans Takip Sistemi**dir.

> 💡 **Arka Plan Mimarisi**: Kullanıcı arayüzünde sadece *Satış*, *Tahsilat*, *Alış*, *Ödeme*, *Gider*, *Ortak İşlemi*, *Transfer* gibi doğal iş dili kullanılır. İşlemlerinizin güvenilirliği ve tam bakiye tutarlılığı için sistem arka planda **çift taraflı muhasebe kayıt motoru** ile otomatik çalışır.

---

## ⚙️ Çift Taraflı Kayıt Motoru İşlem Akışı

Sisteme girilen her iş eylemi arka planda şu mimari sırayla kaydedilir:

$$\text{İşlem} \longrightarrow \text{Belge (Document)} \longrightarrow \text{Borç Hesabı (+) \& Alacak Hesabı (-)} \longrightarrow \text{Muhasebe Hareketi} \longrightarrow \text{Cari / Kasa / Banka Bakiyesi}$$

---

## 🐳 Docker ile Otomatik Yedekleme Servisi (`docker-compose.yml`)

Masaüstü yerel yedeklemeye ek olarak, web/sunucu ortamında **Docker tabanlı otomatik günlük `.cari` yedekleme servisi** sunulmuştur:

- `cari-finance-web`: Next.js web / API sunucusu (`:3000`)
- `cari-finance-backup`: Her gün gece 00:00'da veritabanının `.cari` formatında yedeğini alan ve 30 günden eski yedekleri otomatik temizleyen Docker hacim konteyneri.

```bash
# Docker konteynerlerini başlatma (Web + Otomatik Otomatik Yedekleme)
docker-compose up -d --build
```

---

## 🌟 Ana Özellikler & İşlevler

- 💼 **Pratik İşletme Finans Yönetimi**: Karmaşık yevmiye fişi yazmadan, doğal dille hızlı Satış, Tahsilat, Ödeme ve Gider takibi.
- 👥 **Müşteri & Tedarikçi Carileri**: Alacak ve borç bakiyeleri, hareket detayları ve tek tıkla kurumsal ekstreler.
- 💵 **Kasa & Banka Yönetimi**: Nakit TL kasaları, banka hesapları, gelen/giden havaleler ve hesaplar arası virman/transferler.
- 👤 **Ortak İşlemleri**: Şirket ortaklarının işletmeye koyduğu fonlar veya işletmeden yaptığı para çekişlerinin şeffaf takibi.
- 📄 **Kurumsal Antetli PDF & Excel Raporlama**: Şirket logonuz ve bilgilerinizi içeren antetli PDF dökümleri, mizan ve muavin hesap özetleri.
- 💾 **Özel `.cari` Şirket Dosya Formatı & Docker Backup**: Veritabanınızı hem masaüstünden hem Docker konteynerinden otomatik yedekleme.
- 📅 **Bütçe & Mali Yıl Filtreleme ($N, N-1 \dots N-5$)**: Cari yıl ve 5 yıl geriye dönük mali dönem filtrelemesi.
- 🌓 **Aydınlık / Karanlık Tema**: Tek tıkla göz yormayan Light ve Dark tema geçişi.

---

## 🏛️ Monorepo Mimari Yapısı

```
cari-finance-desktop/
├── pnpm-workspace.yaml               # Monorepo paket tanım dosyası
├── package.json                      # Kök dizin komutları
├── Dockerfile                        # Multi-stage Next.js & Web Docker image
├── docker-compose.yml                # Web App + Automatic Backup Volume Container
├── scripts/
│   └── docker-backup.sh              # 24 saatlik otomatik SQLite / .cari yedekleme betiği
│
├── apps/
│   ├── desktop/                      # (@cari-finance/desktop) Electron 33 + React Masaüstü Uygulaması (Ana Hedef)
│   └── web/                          # (@cari-finance/web) Next.js 14 Web / API Katmanı
│
└── packages/
    ├── domain/                       # (@cari-finance/domain) Saf Finans Mantığı & Tip Tanımları
    └── db/                           # (@cari-finance/db) Drizzle ORM SQLite Veritabanı Şemaları
```

---

## 🚀 Kurulum ve Çalıştırma

### 1. Bağımlılıkları Yükleme
```bash
pnpm install
```

### 2. Masaüstü Uygulamasını Çalıştırma
```bash
pnpm dev:desktop
```

### 3. Uygulamayı Derleme
```bash
pnpm build
```

---

## 🤝 Lisans

Bu proje **MIT Lisansı** altında lisanslanmıştır.  
Geliştirici: **İlyas Bozdemir**
