# 💼 Cari & Kasa Finance — Pratik Cari, Kasa, Banka & Finans Takip Sistemi

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Electron](https://img.shields.io/badge/Electron-33.0-47848F.svg)](https://www.electronjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg)](https://nextjs.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-SQLite-C5F74F.svg)](https://orm.drizzle.team/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8.svg)](https://tailwindcss.com/)
[![pnpm Workspace](https://img.shields.io/badge/pnpm-Monorepo-F69220.svg)](https://pnpm.io/)

**Cari & Kasa Finance**, işletmeler, imalathaneler, perakende ve hizmet sektörleri için tasarlanmış; karmaşık muhasebe terimlerinden arındırılmış **Pratik Cari, Kasa, Banka ve İşletme Finans Takip Sistemi**dir.

> 💡 **Arka Plan Mimarisi**: Kullanıcı arayüzünde sadece *Satış*, *Tahsilat*, *Alış*, *Ödeme*, *Gider*, *Ortak İşlemi* gibi doğal iş dili kullanılır. İşlemlerinizin tam bakiye tutarlılığı ve güvenilirliği için sistem arka planda **çift taraflı bakiye doğrulama motoru** ile hareketleri otomatik işler.

---

## 🌟 Ana Özellikler & İşlevler

- 💼 **Pratik İşletme Finans Yönetimi**: Karmaşık yevmiye fişi yazmadan, doğal dille hızlı Satış, Tahsilat, Ödeme ve Gider takibi.
- 👥 **Müşteri & Tedarikçi Carileri**: Alacak ve borç bakiyeleri, hareket detayları ve tek tıkla kurumsal ekstreler.
- 💵 **Kasa & Banka Yönetimi**: Nakit TL kasaları, banka hesapları, gelen/giden havaleler ve hesaplar arası virman/transferler.
- 👤 **Ortak İşlemleri**: Şirket ortaklarının işletmeye koyduğu fonlar veya işletmeden yaptığı para çekişlerinin şeffaf takibi.
- 📄 **Kurumsal Antetli PDF & Excel Raporlama**: Şirket logonuz ve bilgilerinizi içeren antetli PDF dökümleri, mizan ve muavin hesap özetleri.
- 💾 **Özel `.cari` Şirket Dosya Formatı**: Veritabanınızı tek tıkla `.cari` dosyası olarak yedekleme ve geri yükleme.
- 📅 **Bütçe & Mali Yıl Filtreleme ($N, N-1 \dots N-5$)**: Cari yıl ve 5 yıl geriye dönük mali dönem filtrelemesi.
- 🌓 **Aydınlık / Karanlık Tema**: Tek tıkla göz yormayan Light ve Dark tema geçişi.

---

## 🚀 MVP Modül Öncelik Sıralaması

Proje temel işletme ihtiyaçlarına göre önceliklendirilmiştir:

1. 👥 **Cari Hesap Yönetimi** (Müşteriler & Tedarikçiler)
2. 💵 **Kasa Takibi** (Nakit Kasalar)
3. 🏦 **Banka Hesapları & Transfer**
4. 👤 **Şirket Ortakları Hesabı**
5. ⚡ **Hızlı Gelir / Gider & Harcama Kaydı**
6. 📊 **Ana Ekran & İşlem Fişleri**
7. 📄 **Raporlar & Antetli Ekstreler**
8. 💾 **Yedekleme (`.cari` Dosya Formatı)**
9. 📦 **Stok & Ürün Takibi (Opsiyonel Destek)**

---

## 🏛️ Monorepo Mimari Yapısı

Masaüstü öncelikli monorepo mimarisi:

```
cari-finance-desktop/
├── pnpm-workspace.yaml               # Monorepo paket tanım dosyası
├── package.json                      # Kök dizin komutları
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
