# 💼 Cari & Kasa Finance — Pratik Cari, Kasa, Banka & Finans Takip Sistemi

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Electron](https://img.shields.io/badge/Electron-33.0-47848F.svg)](https://www.electronjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg)](https://nextjs.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-SQLite-C5F74F.svg)](https://orm.drizzle.team/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8.svg)](https://tailwindcss.com/)
[![pnpm Workspace](https://img.shields.io/badge/pnpm-Monorepo-F69220.svg)](https://pnpm.io/)

**Cari & Kasa Finance**, işletmeler, imalathaneler, perakende ve hizmet sektörleri için tasarlanmış; karmaşık muhasebe terimlerinden arındırılmış **Pratik Cari, Kasa, Banka ve İşletme Finans Takip Sistemi**dir.

> 💡 **Arka Plan Mimarisi**: Kullanıcı arayüzünde sadece *Satış*, *Tahsilat*, *Alış*, *Ödeme*, *Gider*, *Ortak İşlemi*, *Transfer* gibi doğal iş dili kullanılır. İşlemlerinizin güvenilirliği ve tam bakiye tutarlılığı için sistem arka planda **çift taraflı muhasebe kayıt motoru** ile otomatik çalışır.

---

## ⚙️ Çift Taraflı Kayıt Motoru İşlem Akışı

Sisteme girilen her iş eylemi arka planda şu mimari sırayla kaydedilir:

$$\text{İşlem} \longrightarrow \text{Belge (Document)} \longrightarrow \text{Borç Hesabı (+) \& Alacak Hesabı (-)} \longrightarrow \text{Muhasebe Hareketi} \longrightarrow \text{Cari / Kasa / Banka Bakiyesi}$$

1. **İşlem Girişi**: Kullanıcı *"ABC Mobilya'ya 10.000 TL Satış Yap"* der.
2. **Belge Kaydı**: `documents` tablosunda `SAT-2026-00001` evrak numaralı belge oluşur.
3. **Çift Taraflı Fiş**: `journal_entries` ve `journal_items` tablolarında `120.001` (Borç: 10.000 TL) ve `600.01` (Alacak: 10.000 TL) satırları yazılır.
4. **Canlı Bakiye**: Müşteri cari bakiyesi `SUM(Borç) - SUM(Alacak)` SQL toplamıyla canlı güncellenir.

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

## 📊 Raporlama & Defter Hiyerarşisi

- **İşletme Raporları**:
  - 👥 Müşteri Cari Ekstresi
  - 🚚 Tedarikçi Cari Ekstresi
  - 💵 Kasa & Banka Raporu
  - ⚡ Gelir - Gider Özeti
- **Gelişmiş & Yönetici Alanı**:
  - 📊 Mizan (Geçici & Kesin)
  - 📖 Defter-i Kebir & Muavin
  - 📜 Yevmiye Fiş Listesi

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
