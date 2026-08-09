import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import { eq } from 'drizzle-orm';

export async function seedDatabase(db: BetterSQLite3Database<typeof schema>) {
  const existingAccounts = db.select().from(schema.accounts).all();
  if (existingAccounts.length > 0) {
    return; // Already seeded
  }

  const now = new Date().toISOString();

  // 1. Seed Main Chart of Accounts
  const baseAccounts: (typeof schema.accounts.$inferInsert)[] = [
    // 1 DÖNEN VARLIKLAR
    { id: 'acc_100', code: '100', name: 'Kasa', type: 'asset', parentCode: null, createdAt: now },
    { id: 'acc_102', code: '102', name: 'Bankalar', type: 'asset', parentCode: null, createdAt: now },
    { id: 'acc_120', code: '120', name: 'Alıcılar (Müşteriler)', type: 'asset', parentCode: null, createdAt: now },
    { id: 'acc_121', code: '121', name: 'Alacak Senetleri', type: 'asset', parentCode: null, createdAt: now },
    { id: 'acc_150', code: '150', name: 'İlk Madde ve Malzeme', type: 'asset', parentCode: null, createdAt: now },
    { id: 'acc_153', code: '153', name: 'Ticari Mallar', type: 'asset', parentCode: null, createdAt: now },
    { id: 'acc_159', code: '159', name: 'Verilen Sipariş Avansları', type: 'asset', parentCode: null, createdAt: now },

    // 2 DURAN VARLIKLAR
    { id: 'acc_252', code: '252', name: 'Binalar', type: 'asset', parentCode: null, createdAt: now },
    { id: 'acc_253', code: '253', name: 'Tesis, Makine ve Cihazlar', type: 'asset', parentCode: null, createdAt: now },
    { id: 'acc_254', code: '254', name: 'Taşıtlar', type: 'asset', parentCode: null, createdAt: now },
    { id: 'acc_255', code: '255', name: 'Demirbaşlar', type: 'asset', parentCode: null, createdAt: now },

    // 3 KISA VADELİ YABANCI KAYNAKLAR
    { id: 'acc_320', code: '320', name: 'Satıcılar (Tedarikçiler)', type: 'liability', parentCode: null, createdAt: now },
    { id: 'acc_321', code: '321', name: 'Borç Senetleri', type: 'liability', parentCode: null, createdAt: now },
    { id: 'acc_335', code: '335', name: 'Personele Borçlar', type: 'liability', parentCode: null, createdAt: now },
    { id: 'acc_360', code: '360', name: 'Ödenecek Vergiler ve Fonlar', type: 'liability', parentCode: null, createdAt: now },
    { id: 'acc_361', code: '361', name: 'Ödenecek Sosyal Güvenlik Kesintileri', type: 'liability', parentCode: null, createdAt: now },

    // 5 ÖZ KAYNAKLAR
    { id: 'acc_500', code: '500', name: 'Sermaye / Ortak Hesapları', type: 'equity', parentCode: null, createdAt: now },

    // 6 GELİRLER
    { id: 'acc_600', code: '600', name: 'Mobilya Satış Gelirleri', type: 'revenue', parentCode: null, createdAt: now },
    { id: 'acc_601', code: '601', name: 'Montaj ve Hizmet Gelirleri', type: 'revenue', parentCode: null, createdAt: now },
    { id: 'acc_602', code: '602', name: 'Diğer Gelirler', type: 'revenue', parentCode: null, createdAt: now },

    // 7 MALİYET & GİDERLER
    { id: 'acc_710', code: '710', name: 'Direkt İlk Madde ve Malzeme Giderleri', type: 'expense', parentCode: null, createdAt: now },
    { id: 'acc_720', code: '720', name: 'Direkt İşçilik Giderleri', type: 'expense', parentCode: null, createdAt: now },
    { id: 'acc_730', code: '730', name: 'Genel Üretim Giderleri', type: 'expense', parentCode: null, createdAt: now },
    { id: 'acc_760', code: '760', name: 'Pazarlama Satış Dağıtım Giderleri', type: 'expense', parentCode: null, createdAt: now },
    { id: 'acc_770', code: '770', name: 'Genel Yönetim Giderleri', type: 'expense', parentCode: null, createdAt: now },

    // Sub-accounts
    { id: 'acc_100_001', code: '100.001', name: 'Merkez TL Kasa', type: 'asset', parentCode: '100', createdAt: now },
    { id: 'acc_102_001', code: '102.001', name: 'Ziraat Bankası', type: 'asset', parentCode: '102', createdAt: now },
    { id: 'acc_102_002', code: '102.002', name: 'Garanti BBVA', type: 'asset', parentCode: '102', createdAt: now },
    { id: 'acc_120_001', code: '120.001', name: 'ABC Mobilya Sanayi', type: 'asset', parentCode: '120', createdAt: now },
    { id: 'acc_120_002', code: '120.002', name: 'Stil İç Dekorasyon', type: 'asset', parentCode: '120', createdAt: now },
    { id: 'acc_320_001', code: '320.001', name: 'MDF Ahşap A.Ş.', type: 'liability', parentCode: '320', createdAt: now },
    { id: 'acc_320_002', code: '320.002', name: 'Orman Ürünleri Ltd.', type: 'liability', parentCode: '320', createdAt: now },
    { id: 'acc_500_001', code: '500.001', name: 'Ortak Ahmet Yılmaz', type: 'equity', parentCode: '500', createdAt: now },
    { id: 'acc_500_002', code: '500.002', name: 'Ortak Mehmet Kaya', type: 'equity', parentCode: '500', createdAt: now },
    { id: 'acc_500_003', code: '500.003', name: 'Ortak Mustafa Demir', type: 'equity', parentCode: '500', createdAt: now },
  ];

  db.insert(schema.accounts).values(baseAccounts).run();

  // 2. Seed Initial Entities (Customers, Suppliers, Banks, Cash, Partners)
  const initialEntities: (typeof schema.entities.$inferInsert)[] = [
    {
      id: 'ent_cash_001',
      name: 'Merkez TL Kasa',
      type: 'cash',
      accountId: 'acc_100_001',
      phone: '',
      taxNumber: '',
      address: 'Fabrika İçi Kasa',
      notes: 'Ana Şirket Kasası',
      isActive: true,
      createdAt: now,
    },
    {
      id: 'ent_bank_001',
      name: 'Ziraat Bankası - Ticari Hesabı',
      type: 'bank',
      accountId: 'acc_102_001',
      phone: '0850 220 0000',
      taxNumber: 'TR9900001000022334455',
      address: 'Organize Sanayi Şubesi',
      notes: 'TR99 0001 0000 2233 4455 6677 88',
      isActive: true,
      createdAt: now,
    },
    {
      id: 'ent_bank_002',
      name: 'Garanti BBVA - Kurumsal',
      type: 'bank',
      accountId: 'acc_102_002',
      phone: '0850 222 0333',
      taxNumber: 'TR1100006200055443322',
      address: 'Sanayi Şubesi',
      notes: 'TR11 0006 2000 5544 3322 1100 99',
      isActive: true,
      createdAt: now,
    },
    {
      id: 'ent_cust_001',
      name: 'ABC Mobilya Sanayi',
      type: 'customer',
      accountId: 'acc_120_001',
      phone: '0532 111 22 33',
      taxNumber: '1234567890',
      address: 'Mobilyacılar Sitesi No: 45 İnegöl / Bursa',
      notes: 'Mutfak Dolabı ve Masa Siparişi Müşterisi',
      isActive: true,
      createdAt: now,
    },
    {
      id: 'ent_cust_002',
      name: 'Stil İç Dekorasyon',
      type: 'customer',
      accountId: 'acc_120_002',
      phone: '0533 444 55 66',
      taxNumber: '9876543210',
      address: 'Siteler Karacakaya Cad. No: 12 Ankara',
      notes: 'Villa Mutfak Ve Vestiyer Projesi',
      isActive: true,
      createdAt: now,
    },
    {
      id: 'ent_supp_001',
      name: 'MDF Ahşap A.Ş.',
      type: 'supplier',
      accountId: 'acc_320_001',
      phone: '0224 888 77 66',
      taxNumber: '5554443332',
      address: 'Keresteciler Sanayi Sitesi No: 100 Bursa',
      notes: 'MDF Lam ve Sunta Tedarikçisi',
      isActive: true,
      createdAt: now,
    },
    {
      id: 'ent_supp_002',
      name: 'Orman Ürünleri Ltd.',
      type: 'supplier',
      accountId: 'acc_320_002',
      phone: '0212 333 22 11',
      taxNumber: '7778889991',
      address: 'İkitelli OSB Keresteciler Sit. No: 4 Istanbul',
      notes: 'Aksesuar, Ray ve Menteşe Tedariği',
      isActive: true,
      createdAt: now,
    },
    {
      id: 'ent_partner_001',
      name: 'Ahmet Yılmaz (Ortak %40)',
      type: 'partner',
      accountId: 'acc_500_001',
      phone: '0532 000 00 01',
      taxNumber: '11111111111',
      address: 'Kurucu Ortak',
      notes: '%40 Şirket Hissedarı',
      isActive: true,
      createdAt: now,
    },
    {
      id: 'ent_partner_002',
      name: 'Mehmet Kaya (Ortak %35)',
      type: 'partner',
      accountId: 'acc_500_002',
      phone: '0532 000 00 02',
      taxNumber: '22222222222',
      address: 'Üretimden Sorumlu Ortak',
      notes: '%35 Şirket Hissedarı',
      isActive: true,
      createdAt: now,
    },
    {
      id: 'ent_partner_003',
      name: 'Mustafa Demir (Ortak %25)',
      type: 'partner',
      accountId: 'acc_500_003',
      phone: '0532 000 00 03',
      taxNumber: '33333333333',
      address: 'Finans ve Pazarlama Sorumlusu',
      notes: '%25 Şirket Hissedarı',
      isActive: true,
      createdAt: now,
    },
  ];

  db.insert(schema.entities).values(initialEntities).run();

  // 3. Seed Income/Expense Categories
  const categories: (typeof schema.categories.$inferInsert)[] = [
    { id: 'cat_001', name: 'Mobilya Satışı', type: 'income', accountId: 'acc_600', isActive: true },
    { id: 'cat_002', name: 'Montaj Geliri', type: 'income', accountId: 'acc_601', isActive: true },
    { id: 'cat_003', name: 'Diğer Gelirler', type: 'income', accountId: 'acc_602', isActive: true },
    { id: 'cat_004', name: 'MDF & Sunta Alımı', type: 'expense', accountId: 'acc_710', isActive: true },
    { id: 'cat_005', name: 'İşçilik & Maaş Ödemesi', type: 'expense', accountId: 'acc_720', isActive: true },
    { id: 'cat_006', name: 'Fabrika Elektrik & Su', type: 'expense', accountId: 'acc_730', isActive: true },
    { id: 'cat_007', name: 'Nakliye & Benzin Gideri', type: 'expense', accountId: 'acc_760', isActive: true },
    { id: 'cat_008', name: 'Ofis & Yemek Gideri', type: 'expense', accountId: 'acc_770', isActive: true },
  ];

  db.insert(schema.categories).values(categories).run();

  // 4. Seed Settings
  db.insert(schema.settings).values({
    id: 'app_settings',
    companyName: 'ABC Mobilya İmalat & Dekorasyon',
    taxNumber: '1234567890',
    address: 'Organize Sanayi Bölgesi 4. Cadde No: 18 İnegöl / BURSA',
    phone: '0224 715 00 00',
    pinCode: null,
    autoBackupEnabled: true,
    backupIntervalDays: 7,
    lastBackupAt: null,
    updatedAt: now,
  }).run();
}
