import { ipcMain } from 'electron';
import { getDatabase } from '../database/client';
import * as schema from '../database/schema';
import { eq, desc, sql, and } from 'drizzle-orm';

export interface CreateTransactionPayload {
  type: 'sale' | 'customer_payment' | 'purchase' | 'supplier_payment' | 'partner_draw' | 'partner_deposit' | 'transfer' | 'expense';
  date: string; // YYYY-MM-DD
  description: string;
  amount: number;
  entityId?: string;       // Customer, Supplier, Partner, Cash, or Bank entity ID
  targetEntityId?: string; // For transfers or payment destination
  categoryId?: string;     // For expense/revenue classification
}

export function registerTransactionsIPC() {
  // Create High-Level Transaction with double-entry enforcement
  ipcMain.handle('transactions:create', async (_, payload: CreateTransactionPayload) => {
    const db = getDatabase();

    if (payload.amount <= 0) {
      throw new Error('İşlem tutarı 0 veya negatif olamaz.');
    }

    const now = new Date().toISOString();
    const docId = 'doc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const entryId = 'yev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    // Document Prefix map
    const prefixMap: Record<string, string> = {
      sale: 'SAT',
      customer_payment: 'TAH',
      purchase: 'ALIM',
      supplier_payment: 'ODE',
      partner_draw: 'ORT-CEK',
      partner_deposit: 'ORT-YAT',
      transfer: 'VIR',
      expense: 'GID',
    };

    const countRes = db.select({ count: sql<number>`count(*)` }).from(schema.documents).get();
    const docSeq = ((countRes?.count || 0) + 1).toString().padStart(5, '0');
    const year = new Date(payload.date || Date.now()).getFullYear();
    const docNumber = `${prefixMap[payload.type] || 'ISL'}-${year}-${docSeq}`;
    const entryNumber = `YEV-${year}-${docSeq}`;

    let debitAccountId = '';
    let creditAccountId = '';
    let debitEntityId: string | undefined = undefined;
    let creditEntityId: string | undefined = undefined;

    // Resolve entities & accounts based on transaction type
    if (payload.type === 'sale') {
      // 120 Müşteri (BORÇ) / 600 Mobilya Satış Geliri (ALACAK)
      if (!payload.entityId) throw new Error('Satış işlemi için müşteri seçilmelidir.');
      const customer = db.select().from(schema.entities).where(eq(schema.entities.id, payload.entityId)).get();
      if (!customer) throw new Error('Müşteri bulunamadı.');

      debitAccountId = customer.accountId;
      debitEntityId = customer.id;

      // Revenue account
      let revenueCategory = payload.categoryId
        ? db.select().from(schema.categories).where(eq(schema.categories.id, payload.categoryId)).get()
        : null;
      creditAccountId = revenueCategory ? revenueCategory.accountId : 'acc_600';
    } else if (payload.type === 'customer_payment') {
      // Kasa/Banka (BORÇ) / 120 Müşteri (ALACAK)
      if (!payload.entityId) throw new Error('Tahsilat için müşteri seçilmelidir.');
      if (!payload.targetEntityId) throw new Error('Tahsilatın aktarılacağı Kasa/Banka seçilmelidir.');

      const customer = db.select().from(schema.entities).where(eq(schema.entities.id, payload.entityId)).get();
      const cashOrBank = db.select().from(schema.entities).where(eq(schema.entities.id, payload.targetEntityId)).get();
      if (!customer || !cashOrBank) throw new Error('Müşteri veya Kasa/Banka kaydı bulunamadı.');

      debitAccountId = cashOrBank.accountId;
      debitEntityId = cashOrBank.id;

      creditAccountId = customer.accountId;
      creditEntityId = customer.id;
    } else if (payload.type === 'purchase') {
      // 153/710 Stok (BORÇ) / 320 Satıcı (ALACAK)
      if (!payload.entityId) throw new Error('Satınalma için satıcı/tedarikçi seçilmelidir.');
      const supplier = db.select().from(schema.entities).where(eq(schema.entities.id, payload.entityId)).get();
      if (!supplier) throw new Error('Tedarikçi bulunamadı.');

      let expenseCat = payload.categoryId
        ? db.select().from(schema.categories).where(eq(schema.categories.id, payload.categoryId)).get()
        : null;
      debitAccountId = expenseCat ? expenseCat.accountId : 'acc_153';

      creditAccountId = supplier.accountId;
      creditEntityId = supplier.id;
    } else if (payload.type === 'supplier_payment') {
      // 320 Satıcı (BORÇ) / Kasa veya Banka (ALACAK)
      if (!payload.entityId) throw new Error('Ödeme yapılan satıcı seçilmelidir.');
      if (!payload.targetEntityId) throw new Error('Ödemenin yapıldığı Kasa/Banka seçilmelidir.');

      const supplier = db.select().from(schema.entities).where(eq(schema.entities.id, payload.entityId)).get();
      const cashOrBank = db.select().from(schema.entities).where(eq(schema.entities.id, payload.targetEntityId)).get();
      if (!supplier || !cashOrBank) throw new Error('Satıcı veya Kasa/Banka kaydı bulunamadı.');

      debitAccountId = supplier.accountId;
      debitEntityId = supplier.id;

      creditAccountId = cashOrBank.accountId;
      creditEntityId = cashOrBank.id;
    } else if (payload.type === 'partner_draw') {
      // 500 Ortak (BORÇ) / Kasa veya Banka (ALACAK)
      if (!payload.entityId) throw new Error('Para çeken ortak seçilmelidir.');
      if (!payload.targetEntityId) throw new Error('Paranın çekildiği Kasa/Banka seçilmelidir.');

      const partner = db.select().from(schema.entities).where(eq(schema.entities.id, payload.entityId)).get();
      const cashOrBank = db.select().from(schema.entities).where(eq(schema.entities.id, payload.targetEntityId)).get();
      if (!partner || !cashOrBank) throw new Error('Ortak veya Kasa/Banka kaydı bulunamadı.');

      debitAccountId = partner.accountId;
      debitEntityId = partner.id;

      creditAccountId = cashOrBank.accountId;
      creditEntityId = cashOrBank.id;
    } else if (payload.type === 'partner_deposit') {
      // Kasa veya Banka (BORÇ) / 500 Ortak (ALACAK)
      if (!payload.entityId) throw new Error('Para yatıran ortak seçilmelidir.');
      if (!payload.targetEntityId) throw new Error('Paranın yatırıldığı Kasa/Banka seçilmelidir.');

      const partner = db.select().from(schema.entities).where(eq(schema.entities.id, payload.entityId)).get();
      const cashOrBank = db.select().from(schema.entities).where(eq(schema.entities.id, payload.targetEntityId)).get();
      if (!partner || !cashOrBank) throw new Error('Ortak veya Kasa/Banka kaydı bulunamadı.');

      debitAccountId = cashOrBank.accountId;
      debitEntityId = cashOrBank.id;

      creditAccountId = partner.accountId;
      creditEntityId = partner.id;
    } else if (payload.type === 'transfer') {
      // Hedef Kasa/Banka (BORÇ) / Kaynak Kasa/Banka (ALACAK)
      if (!payload.entityId) throw new Error('Kaynak Kasa/Banka seçilmelidir.');
      if (!payload.targetEntityId) throw new Error('Hedef Kasa/Banka seçilmelidir.');

      const sourceAcc = db.select().from(schema.entities).where(eq(schema.entities.id, payload.entityId)).get();
      const targetAcc = db.select().from(schema.entities).where(eq(schema.entities.id, payload.targetEntityId)).get();
      if (!sourceAcc || !targetAcc) throw new Error('Virman hesapları bulunamadı.');

      debitAccountId = targetAcc.accountId;
      debitEntityId = targetAcc.id;

      creditAccountId = sourceAcc.accountId;
      creditEntityId = sourceAcc.id;
    } else if (payload.type === 'expense') {
      // Gider Hesabı (BORÇ) / Kasa veya Banka (ALACAK)
      if (!payload.targetEntityId) throw new Error('Giderin ödendiği Kasa/Banka seçilmelidir.');

      let expenseCat = payload.categoryId
        ? db.select().from(schema.categories).where(eq(schema.categories.id, payload.categoryId)).get()
        : null;
      debitAccountId = expenseCat ? expenseCat.accountId : 'acc_770';

      const cashOrBank = db.select().from(schema.entities).where(eq(schema.entities.id, payload.targetEntityId)).get();
      if (!cashOrBank) throw new Error('Ödeme yapılan Kasa/Banka kaydı bulunamadı.');

      creditAccountId = cashOrBank.accountId;
      creditEntityId = cashOrBank.id;
    }

    // Dynamic Invariant Check: SUM(debit) MUST EQUAL SUM(credit)
    const totalDebit = payload.amount;
    const totalCredit = payload.amount;
    if (Math.abs(totalDebit - totalCredit) > 0.001) {
      throw new Error(`Muhasebe Kayıt Hatası: Toplam Borç (${totalDebit}) !== Toplam Alacak (${totalCredit}). Fiş kaydedilemez.`);
    }

    // Execute atomic transaction in SQLite
    const documentRecord = {
      id: docId,
      docNumber: docNumber,
      type: payload.type,
      date: payload.date,
      description: payload.description,
      totalAmount: payload.amount,
      createdAt: now,
    };

    const journalEntryRecord = {
      id: entryId,
      entryNumber: entryNumber,
      documentId: docId,
      date: payload.date,
      description: payload.description,
      status: 'active' as const,
      createdAt: now,
    };

    const debitItem = {
      id: 'ji_' + Date.now() + '_1',
      journalEntryId: entryId,
      accountId: debitAccountId,
      entityId: debitEntityId || null,
      debit: payload.amount,
      credit: 0,
      description: payload.description,
    };

    const creditItem = {
      id: 'ji_' + Date.now() + '_2',
      journalEntryId: entryId,
      accountId: creditAccountId,
      entityId: creditEntityId || null,
      debit: 0,
      credit: payload.amount,
      description: payload.description,
    };

    db.insert(schema.documents).values(documentRecord).run();
    db.insert(schema.journalEntries).values(journalEntryRecord).run();
    db.insert(schema.journalItems).values([debitItem, creditItem]).run();

    return { success: true, docNumber, entryNumber };
  });

  // List recent transactions with filters
  ipcMain.handle('transactions:list', async (_, options?: { entityId?: string; limit?: number }) => {
    const db = getDatabase();
    const limit = options?.limit || 100;

    let query = db
      .select({
        id: schema.journalEntries.id,
        entryNumber: schema.journalEntries.entryNumber,
        docNumber: schema.documents.docNumber,
        docType: schema.documents.type,
        date: schema.journalEntries.date,
        description: schema.journalEntries.description,
        totalAmount: schema.documents.totalAmount,
        status: schema.journalEntries.status,
      })
      .from(schema.journalEntries)
      .leftJoin(schema.documents, eq(schema.journalEntries.documentId, schema.documents.id))
      .where(eq(schema.journalEntries.status, 'active'))
      .orderBy(desc(schema.journalEntries.date), desc(schema.journalEntries.createdAt))
      .limit(limit);

    return query.all();
  });

  // Cancel transaction (Soft cancellation - Reversal entry to preserve audit log)
  ipcMain.handle('transactions:cancel', async (_, entryId: string) => {
    const db = getDatabase();

    const entry = db.select().from(schema.journalEntries).where(eq(schema.journalEntries.id, entryId)).get();
    if (!entry) throw new Error('İşlem kaydı bulunamadı.');

    if (entry.status === 'cancelled') {
      throw new Error('İşlem zaten iptal edilmiş.');
    }

    db.update(schema.journalEntries)
      .set({ status: 'cancelled' })
      .where(eq(schema.journalEntries.id, entryId))
      .run();

    return { success: true };
  });
}
