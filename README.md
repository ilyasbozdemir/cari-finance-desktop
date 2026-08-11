# 💼 Cari & Kasa Finance — Pratik Cari, Kasa, Banka & Finans Takip Sistemi

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Electron](https://img.shields.io/badge/Electron-33.0-47848F.svg)](https://www.electronjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15_%2F_16_Latest-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![Pulumi](https://img.shields.io/badge/Pulumi-IaC-8A3391.svg)](https://www.pulumi.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED.svg)](https://www.docker.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-SQLite-C5F74F.svg)](https://orm.drizzle.team/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8.svg)](https://tailwindcss.com/)
[![pnpm Workspace](https://img.shields.io/badge/pnpm-Monorepo-F69220.svg)](https://pnpm.io/)

**Cari & Kasa Finance**, işletmeler, imalathaneler, perakende ve hizmet sektörleri için tasarlanmış; karmaşık muhasebe terimlerinden arındırılmış **Pratik Cari, Kasa, Banka ve İşletme Finans Takip Sistemi**dir.

---

## 🏗️ Next.js 15/16 & React 19 Güncelleme Adımları

Web katmanı (`apps/web`) en güncel Next.js & React 19 sürüm mimarisine uyarlanmıştır:

```bash
# Next.js 15/16 & React 19 Bağımlılık Yükseltmesi
cd apps/web
pnpm add next@latest react@rc react-dom@rc

# Codemod Otomatik Yükseltme Betiği
npx @next/codemod@canary upgrade latest
```

---

## 🏗️ Pulumi (Infrastructure as Code - IaC) Mimarisi (`infra/`)

**Pulumi**, sunucu, konteyner ve veritabanı altyapılarını TypeScript ile kod olarak yönetmeye yarayan modern **Infrastructure as Code (IaC)** aracıdır.

Projeye eklenen `infra/index.ts` ve `infra/Pulumi.yaml` altyapı kodları sayesinde Docker konteynerleri ve persistent SQLite hacimleri Pulumi üzerinden otomatik canlıya alınabilir:

```bash
# Pulumi Altyapısını Canlıya Alma
cd infra
pulumi up
```

---

## 🛠️ Makefile & Terminal Kısayol Komutları (`Makefile`)

Terminalde uzun komutlar yazmak yerine `make` veya `pnpm` kısayolları kullanılabilir:

| Kısayol Komut | İşlev |
| :--- | :--- |
| `make dev` veya `pnpm dev` | Masaüstü uygulamasını geliştirme modunda açar. |
| `make build` veya `pnpm build` | Tüm monorepo paketlerini derler. |
| `make package` veya `pnpm package` | Windows `.exe` kurucu paketini oluşturur. |
| `make docker-up` veya `pnpm docker:up` | Docker servislerini arka planda başlatır. |
| `make docker-backup` veya `pnpm docker:backup` | Otomatik `.cari` veritabanı yedeği alır. |
| `make pulumi-up` veya `pnpm pulumi:up` | Pulumi IaC altyapısını canlıya alır. |

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
├── Makefile                          # Terminal kısayol görev çalıştırıcısı (Task Runner)
├── package.json                      # Kök dizin komutları & Docker kısayolları
├── Dockerfile                        # Multi-stage Next.js 15/16 & Web Docker image
├── docker-compose.yml                # Web App + Automatic Backup Volume Container
├── infra/                            # Pulumi Infrastructure as Code (IaC) TypeScript Stack
│   ├── Pulumi.yaml
│   └── index.ts                      # Pulumi Docker Container & Volume Tanımları
├── scripts/
│   └── docker-backup.sh              # 24 saatlik otomatik SQLite / .cari yedekleme betiği
│
├── apps/
│   ├── desktop/                      # (@cari-finance/desktop) Electron 33 + React Masaüstü Uygulaması (Ana Hedef)
│   └── web/                          # (@cari-finance/web) Next.js 15 / 16 + React 19 Web Katmanı
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
